import { NextFunction, Request, Response } from 'express';
import { sendResponse, Errors } from '../utils/api.util';
import { extractFromHeader, TokenType } from '../utils/auth.util';

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
function authenticate(tokenType: TokenType = 'ACCESS') {
    return (req: Request, res: Response, next: NextFunction) => {
        const payload = extractFromHeader(req, tokenType);

        if (!payload) {
            return sendResponse(res, Errors.NO_SESSION_ERROR);
        }

        return next();
    };
}

export default authenticate;