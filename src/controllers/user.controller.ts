import authenticate from '../middlewares/authenticate.middleware';

import { Request, Response } from 'express';
import { Controller, Route } from '../decorators/express.decorator';
import { User } from '../entities/user.entity';
import { sendResponse, Errors } from '../utils/api.util';
import { extractFromHeader } from '../utils/auth.util';

@Route({ path: 'user' })
export class Auth {

    @Controller('GET', '/', authenticate())
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

}