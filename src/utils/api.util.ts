import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export type ApiResponseParams<T> = {
    statusCode?: number,
    success?: boolean,
    message: string,
    data?: T
}

export type ErrorResponseList = {
    [key: string]: ApiResponseParams<unknown>
}

export function asErrors<T extends ErrorResponseList>(obj: T) {
    return obj;
}

/**
 * Sends response
 *
 * The usual way doesn't have any template to sending responses,
 * therefore you don't get help from the autocomplete.
 */
export function sendResponse<T>(res: Response, params: ApiResponseParams<T>) {
    const { statusCode, success, ...newParams } = params;

    const isSuccess = (success ?? true);
    const code = statusCode ?? StatusCodes.OK;

    const response = {
        status: (isSuccess ? 'success' : 'fail'),
        ...newParams
    };

    return res.status(code).json(response);
}

export const Errors = asErrors({
    SERVER_ERROR: {
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Unexpected server error'
    },
    NO_SESSION_ERROR: {
        success: false,
        statusCode: StatusCodes.UNAUTHORIZED,
        message: "You don't have an account session"
    },
    NO_PERMISSION_ERROR: {
        success: false,
        statusCode: StatusCodes.FORBIDDEN,
        message: "You don't have the permission to access this content"
    }
});