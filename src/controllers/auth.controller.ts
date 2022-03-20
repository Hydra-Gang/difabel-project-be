import bcrypt from 'bcrypt';
import validate from '../middlewares/validate.middleware';
import config from '../configs/config';

import { Request, Response } from 'express';
import { Controller, Route } from '../decorators/express.decorator';
import { AccessLevels, User } from '../entities/user.entity';
import { ApiResponseParams, sendResponse } from '../utils/api.util';
import { StatusCodes } from 'http-status-codes';
import { createUserToken } from '../utils/user.util';

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
                foundUser.password,
                body.password);

            if (!isPasswordValid) {
                return sendResponse(res, invalidError);
            }

            return sendResponse(res, {
                message: 'Successfully logged in as a user',
                data: createUserToken(foundUser)
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

    // @Controller('POST', '/refresh')
    async refreshToken(req: Request, res: Response) {
        // TODO:
    }

}