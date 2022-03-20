import bcrypt from 'bcrypt';
import validate from '../middlewares/validate.middleware';
import config from '../configs/config';
import jwt from 'jsonwebtoken';

import { Request, Response } from 'express';
import { Controller, Route } from '../decorators/express.decorator';
import { AccessLevels, User } from '../entities/user.entity';
import { ApiResponseParams, sendResponse } from '../utils/api.util';
import { StatusCodes } from 'http-status-codes';
import { extractBearerToken } from '../middlewares/authenticate.middleware';
import {
    genAccessToken,
    genRefreshToken,
    REFRESH_TOKEN_LIST, UserLike
} from '../utils/user.util';
import {
    loginSchema, registerSchema,
    LoginType, RegisterType
} from '../validations/user.validations';

@Route({ path: 'auth' })
export class Auth {

    @Controller('POST', '/login', validate(loginSchema))
    async login(req: Request, res: Response) {
        const body = req.body as LoginType;

        const invalidError: ApiResponseParams<unknown> = {
            success: false,
            statusCode: StatusCodes.BAD_REQUEST,
            message: 'Incorrect email or password'
        };

        try {
            const foundUser = await User.findOne({
                where: {
                    email: body.email
                }
            });

            if (!foundUser) {
                return sendResponse(res, invalidError);
            }

            const isPasswordValid = await bcrypt.compare(
                body.password,
                foundUser.password);

            if (!isPasswordValid) {
                return sendResponse(res, invalidError);
            }

            return sendResponse(res, {
                message: 'Successfully logged in as a user',
                data: {
                    accessToken: genAccessToken(foundUser),
                    refreshToken: genRefreshToken(foundUser)
                }
            });
        } catch (err) {
            return sendResponse(res, {
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                success: false,
                message: 'Unexpected server error'
            });
        }
    }

    @Controller('POST', '/register', validate(registerSchema))
    async register(req: Request, res: Response) {
        const body = req.body as RegisterType;

        const user = User.create({
            accessLevel: AccessLevels.CONTRIBUTOR,
            ...body
        });

        try {
            const foundUser = await User.findOne({
                select: ['email'],
                where: { email: user.email }
            });

            if (foundUser) {
                return sendResponse(res, {
                    statusCode: StatusCodes.BAD_REQUEST,
                    success: false,
                    message: 'This email is already registered'
                });
            }

            const hashedPwd = await bcrypt.hash(
                user.password,
                config.hashRounds);

            user.password = hashedPwd;
            await User.save(user);

            return sendResponse(res, {
                statusCode: StatusCodes.CREATED,
                message: 'Successfully registered new user'
            });
        } catch (err) {
            return sendResponse(res, {
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                success: false,
                message: 'Unexpected server error'
            });
        }
    }

    @Controller('POST', '/refresh')
    async refreshToken(req: Request, res: Response) {
        const invalidError: ApiResponseParams<unknown> = {
            success: false,
            statusCode: StatusCodes.UNAUTHORIZED,
            message: "You don't have an account session"
        };

        const rawToken = req.header('authorization');
        const token = extractBearerToken(rawToken);

        if (!token || !REFRESH_TOKEN_LIST.includes(token)) {
            return sendResponse(res, invalidError);
        }

        try {
            const decoded = jwt.verify(token, config.jwt.refreshSecret);
            return sendResponse(res, {
                message: 'Successfully refreshed new token',
                data: {
                    accessToken: genAccessToken(decoded as UserLike)
                }
            });
        } catch (err) {
            return sendResponse(res, invalidError);
        }
    }

    @Controller('DELETE', '/logout')
    async logout(req: Request, res: Response) {
        const invalidError: ApiResponseParams<unknown> = {
            success: false,
            statusCode: StatusCodes.UNAUTHORIZED,
            message: "You don't have an account session"
        };

        const rawToken = req.header('authorization');
        const token = extractBearerToken(rawToken);

        if (!token || !REFRESH_TOKEN_LIST.includes(token)) {
            return sendResponse(res, invalidError);
        }

        try {
            jwt.verify(token, config.jwt.refreshSecret);

            const idx = REFRESH_TOKEN_LIST.indexOf(token);
            REFRESH_TOKEN_LIST.splice(idx);

            return sendResponse(res, {
                statusCode: StatusCodes.ACCEPTED,
                message: 'Successfully logged out'
            });
        } catch (err) {
            return sendResponse(res, invalidError);
        }
    }

}