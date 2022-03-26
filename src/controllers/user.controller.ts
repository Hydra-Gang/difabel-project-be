import authenticate from '../middlewares/authenticate.middleware';

import { Request, Response } from 'express';
import { Controller, Route } from '../decorators/express.decorator';
import { AccessLevels, User } from '../entities/user.entity';
import { sendResponse, Errors } from '../utils/api.util';
import { extractFromHeader } from '../utils/auth.util';

@Route({ path: 'users' })
export class UserRoute {

    @Controller('GET', '/profile', authenticate())
    async getUser(req: Request, res: Response) {
        const payload = extractFromHeader(req)!;

        const user = await User.findOne({ where: { id: payload.id } });
        if (!user) {
            throw Errors.NO_SESSION;
        }

        return sendResponse(res, {
            message: 'Successfully found user data',
            data: { user: user.filter() }
        });
    }

    @Controller('GET', '/', authenticate())
    async getAllUsers(req: Request, res: Response) {
        const payload = extractFromHeader(req)!;

        const user = await User.findOne({ where: { id: payload.id } });
        if (!user) {
            throw Errors.NO_SESSION;
        }

        if (!user.hasAnyAccess('ADMIN')) {
            throw Errors.NO_PERMISSION;
        }

        const users = await User.find({
            where: [
                { accessLevel: AccessLevels.CONTRIBUTOR },
                { accessLevel: AccessLevels.EDITOR }
            ]
        });

        const output = users.map((usr) => usr.filter());

        return sendResponse(res, {
            message: 'Successfully found all users',
            data: { output }
        });
    }

}