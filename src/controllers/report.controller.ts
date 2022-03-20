import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Controller, Route } from '../decorators/express.decorator';
import { Report } from '../entities/report.entity';
import authenticate from '../middlewares/authenticate.middleware';
import { sendResponse } from '../utils/api.util';

@Route({ path: 'reports' })
export class ReportRoute {

    @Controller('GET', '/', authenticate)
    async getReports(req: Request, res: Response) {
        try {
            const reports = await Report.find();

            return sendResponse(res, {
                message: 'Managed to get all reports',
                data: {
                    reports
                }
            });
        } catch (error) {
            sendResponse(res, {
                success: false,
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                message: 'Unexpected server error'
            });
        }
    }

}