import jwt from 'jsonwebtoken';
import config from '../configs/config';

import { NextFunction, Request, Response } from 'express';
import { sendResponse, Errors } from '../utils/api.util';

/**
 * Validates a user authentication
 *
 * The middleware uses {@link jwt.verify} function to verify
 * the user's token and add the payload to `$auth` within {@link req.body}
 *
 * Let's say we have `{ userId: 5 }` as our payload,
 * then to get it from the controller, we do this:
 * ```ts
 * const { userId } = req.body.$auth;
 * ```
 */
function authenticate(req: Request, res: Response, next: NextFunction) {
    const rawToken = req.header('authorization');
    const token = extractBearerToken(rawToken);

    if (!token) {
        return sendResponse(res, Errors.NO_SESSION_ERROR);
    }

    try {
        const payload = jwt.verify(token, config.jwt.accessSecret);
        req.body.$auth = payload;

        return next();
    } catch (err) {
        return sendResponse(res, Errors.NO_SESSION_ERROR);
    }
}

export function extractBearerToken(rawToken?: string) {
    const prefix = 'Bearer ';
    const isValid = !!rawToken && rawToken.startsWith(prefix);

    if (isValid) {
        return rawToken.replace(prefix, '');
    }
}

export default authenticate;