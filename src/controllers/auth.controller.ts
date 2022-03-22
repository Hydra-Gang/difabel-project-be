import bcrypt from 'bcrypt';
import validate from '../middlewares/validate.middleware';
import config from '../configs/config';
import authenticate from '../middlewares/authenticate.middleware';

import { Request, Response } from 'express';
import { Controller, Route } from '../decorators/express.decorator';
import { User } from '../entities/user.entity';
import { ApiResponseParams, Errors, sendResponse } from '../utils/api.util';
import { StatusCodes } from 'http-status-codes';
import {
    generateToken,
    extractFromHeader,
    REFRESH_TOKEN_LIST
} from '../utils/auth.util';
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
                    accessToken: generateToken(foundUser, 'ACCESS'),
                    refreshToken: generateToken(foundUser, 'REFRESH')
                }
            });
        } catch (err) {
            return sendResponse(res, Errors.SERVER_ERROR);
        }
    }

    @Controller('POST', '/register', validate(registerSchema))
    async register(req: Request, res: Response) {
        const body = req.body as RegisterType;
        const user = User.create({ ...body });

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
            return sendResponse(res, Errors.SERVER_ERROR);
        }
    }

    @Controller('POST', '/refresh', authenticate('REFRESH'))
    async refreshToken(req: Request, res: Response) {
        const userPayload = extractFromHeader(req, 'REFRESH')!;

        return sendResponse(res, {
            message: 'Successfully refreshed new token',
            data: {
                accessToken: generateToken(userPayload, 'ACCESS')
            }
        });
    }

    @Controller('DELETE', '/logout', authenticate('REFRESH'))
    async logout(req: Request, res: Response) {
        const token = req.header('authorization')!.replace('Bearer ', '');
        const idx = REFRESH_TOKEN_LIST.indexOf(token);

        REFRESH_TOKEN_LIST.splice(idx);

        return sendResponse(res, {
            statusCode: StatusCodes.ACCEPTED,
            message: 'Successfully logged out'
        });
    }

}