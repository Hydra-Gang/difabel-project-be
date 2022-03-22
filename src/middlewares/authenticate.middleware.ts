import { NextFunction, Request, Response } from 'express';
import { sendResponse, Errors } from '../utils/api.util';
import { extractFromHeader, TokenType } from '../utils/auth.util';

/**
 * Handles user authentication
 * This middleware also has the ability to check user's {@link AccessLevels}.
 *
 * @param tokenType the kind of to token should be check
 * @param permissions the permissions required to access
 */
function authenticate(
    tokenType: TokenType = 'ACCESS') {

    return (req: Request, res: Response, next: NextFunction) => {
        const payload = extractFromHeader(req, tokenType);
        if (!payload) {
            return sendResponse(res, Errors.NO_SESSION_ERROR);
        }

        return next();
    };
}

export default authenticate;