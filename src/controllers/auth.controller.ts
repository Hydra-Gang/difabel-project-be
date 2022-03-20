import validate from '../middlewares/validate.middleware';
import bcrypt from 'bcrypt';
import config from '../configs/config';

import { Request, Response } from 'express';
import { Controller, Route } from '../decorators/express.decorator';
import { registerSchema } from '../validations/user.validations';
import { AccessLevels, User } from '../entities/user.entity';
import { sendResponse } from '../utils/api.util';
import { StatusCodes } from 'http-status-codes';


@Route({ path: 'auth' })
export class Auth {

    // @Controller('POST', '/login')
    async login(req: Request, res: Response) {
        // TODO:
    }

    @Controller('POST', '/register', validate(registerSchema))
    async register(req: Request, res: Response) {
        const { body } = req;

        const user = User.create({
            accessLevel: AccessLevels.CONTRIBUTOR,
            ...body
        }) as unknown as User;

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
                config.hash.rounds);

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