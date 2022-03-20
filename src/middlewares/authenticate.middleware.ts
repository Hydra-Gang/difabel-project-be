import jwt from 'jsonwebtoken';
import config from '../configs/config';

import { NextFunction, Request, Response } from 'express';
import { sendResponse, ApiResponseParams } from '../utils/api.util';
import { StatusCodes } from 'http-status-codes';

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
    const invalidError: ApiResponseParams<unknown> = {
        success: false,
        statusCode: StatusCodes.UNAUTHORIZED,
        message: "You don't have an account session"
    };

    const rawToken = req.header('authorization');
    const token = extractBearerToken(rawToken);

    if (!token) {
        return sendResponse(res, invalidError);
    }

    try {
        const payload = jwt.verify(token, config.jwt.accessSecret);
        req.body.$auth = payload;

        return next();
    } catch (err) {
        return sendResponse(res, invalidError);
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