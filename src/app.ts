import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import globalRouter from './routes';
import helmet from 'helmet';

dotenv.config();

const app = express();

// global middlewares
app.use(helmet());
app.use(cors({
    origin: '*',
    /** Some legacy browsers (IE11, various SmartTVs) choke on 204 */
    optionsSuccessStatus: 200,
}));
app.use(express.json());

// bind global router to all routes
app.use('/', globalRouter);

export default app;