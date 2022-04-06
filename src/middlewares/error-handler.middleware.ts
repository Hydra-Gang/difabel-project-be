import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ANSI } from '../utils/ansi.util';
import {
    ResponseError,
    sendResponse, Errors
} from '../utils/api.util';

function errorHandling(
    err: Error, req: Request, res: Response, _: NextFunction) {

    let error;
    if (err.name === ResponseError.name) {
        error = err as ResponseError;
    } else {
        error = Errors.SERVER;
        error.stack = err.stack;
    }

    if (error.statusCode === StatusCodes.INTERNAL_SERVER_ERROR) {
        const { stdout } = process;

        stdout.write(ANSI.RED);
        stdout.write(`${error}\n`);

        stdout.write(ANSI.DARK_RED);
        stdout.write(`${error.stack}`);

        stdout.write(`${ANSI.RESET}\n`);
    }

    return sendResponse(res, ResponseError.toResponseBody(error));
}

export default errorHandling;