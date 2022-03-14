import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export type ApiResponseParams<T> = {
    statusCode?: number,
    success?: boolean,
    message: string,
    data?: T
}

/**
 * Sends response
 *
 * The usual way doesn't have any template to sending responses,
 * therefore you don't get help from the autocomplete.
 */
export function sendResponse<T>(res: Response, params: ApiResponseParams<T>) {
    const { statusCode, ...newParams } = params;

    const isSuccess = (newParams.success ?? true);
    const code = statusCode ?? StatusCodes.OK;

    const response = {
        status: (isSuccess ? 'success' : 'fail'),
        ...newParams
    };

    return res.status(code).json(response);
}