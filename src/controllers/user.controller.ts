import authenticate from '../middlewares/authenticate.middleware';

import { Request, Response } from 'express';
import { Controller, Route } from '../decorators/express.decorator';
import { AccessLevels, User } from '../entities/user.entity';
import { sendResponse, Errors, ResponseError } from '../utils/api.util';
import { getPayloadFromHeader } from '../utils/auth.util';
import { StatusCodes } from 'http-status-codes';

const USER_NOT_FOUND = new ResponseError(
    'Cannot find user',
    StatusCodes.NOT_FOUND);

@Route({ path: 'users' })
export class UserRoute {

    @Controller('GET', '/profile', authenticate())
    async getUser(req: Request, res: Response) {
        const payload = getPayloadFromHeader(req)!;

        const user = await User.findOne({ where: { id: payload.id } });
        if (!user) {
            throw Errors.NO_SESSION;
        }

        return sendResponse(res, {
            message: 'Successfully found user data',
            data: { user: user.filter(true) }
        });
    }

    @Controller('PUT', '/update/:userId', authenticate())
    async changeAccessLevel(req: Request, res: Response) {
        const payload = getPayloadFromHeader(req)!;
        const { userId } = req.params;

        const user = await User.findOne({ where: { id: payload.id } });
        if (!user) {
            throw Errors.NO_SESSION;
        }
        if (!user.hasAnyAccess('ADMIN')) {
            throw Errors.NO_PERMISSION;
        }

        const targetUser = await User.findOne({
            where: { id: parseInt(userId) }
        });

        if (!targetUser) {
            throw USER_NOT_FOUND;
        }

        if (targetUser.hasAnyAccess('CONTRIBUTOR')) {
            targetUser.accessLevel = AccessLevels.EDITOR;
        } else {
            targetUser.accessLevel = AccessLevels.CONTRIBUTOR;
        }

        await User.save(targetUser);
        return sendResponse(res, {
            message: 'Successfully change user access level'
        });
    }

    @Controller('GET', '/', authenticate())
    async getAllUsers(req: Request, res: Response) {
        const payload = getPayloadFromHeader(req)!;
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

        const output = users.map((u) => u.filter(true));

        return sendResponse(res, {
            message: 'Found all users',
            data: { users: output }
        });
    }

    @Controller('GET', '/:userId', authenticate())
    async getUserById(req: Request, res: Response) {
        const payload = getPayloadFromHeader(req)!;
        const { userId } = req.params;

        const user = await User.findOne({ where: { id: payload.id } });
        if (!user) {
            throw Errors.NO_SESSION;
        }

        const targetUser = await User.findOne({
            where: { id: parseInt(userId) }
        });
        if (!targetUser) {
            throw USER_NOT_FOUND;
        }

        const isAdmin = user.hasAnyAccess('ADMIN');
        const output = targetUser.filter(isAdmin);

        return sendResponse(res, {
            message: 'Successfully found user',
            data: { user: output }
        });
    }

}