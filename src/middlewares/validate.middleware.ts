import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '../utils/api.util';

import joi from 'joi';

/**
 * Validates a request from client
 * within the middleware instead of from each controllers.
 *
 * @param schema the schema to be validated
 * @param isParams go for `true` to validate `params` property, or
 *          go `false` to validate `body` property
 *          within the {@link Request request}.
 */
function validateHandler(schema: joi.ObjectSchema, isParams = false) {
    return (req: Request, res: Response, next: NextFunction) => {
        let targetToValidate;

        if (isParams) {
            targetToValidate = req.params;
        } else {
            targetToValidate = req.body;
        }

        const result = schema.validate(targetToValidate);
        if (result.error) {
            return sendResponse(res, {
                success: false,
                statusCode: StatusCodes.BAD_REQUEST,
                message: result.error.message
            });
        }

        return next();
    };
}

export default validateHandler;