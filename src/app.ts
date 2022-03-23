import cors from 'cors';
import helmet from 'helmet';
import express from 'express';

import {
    ResponseError,
    sendResponse, Errors
} from './utils/api.util';

const app = express();

// global middlewares
app.use(helmet());
app.use(cors({
    origin: '*',
    /** Some legacy browsers (IE11, various SmartTVs) choke on 204 */
    optionsSuccessStatus: 200,
    preflightContinue: true
}));
app.use(express.json());

export function errorHandling(
    err: Error,
    req: express.Request, res: express.Response,
    _: express.NextFunction) {

    let error: ResponseError;
    if (err.name === ResponseError.name) {
        error = err as ResponseError;
    } else {
        error = Errors.SERVER;
        error.stack = err.stack;
    }

    return sendResponse(res, ResponseError.toResponseBody(error));
}


export default app;