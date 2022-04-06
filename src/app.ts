import cors from 'cors';
import helmet from 'helmet';
import express from 'express';

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

export default app;