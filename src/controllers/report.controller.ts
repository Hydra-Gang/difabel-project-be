import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Controller, Route } from '../decorators/express.decorator';
import { Report } from '../entities/report.entity';
import authenticate from '../middlewares/authenticate.middleware';
import validate from '../middlewares/validate.middleware';
import { sendResponse } from '../utils/api.util';
import { newReportSchema, NewUserType } from '../validations/report.validation';

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

    @Controller('POST', '/add', validate(newReportSchema))
    async addReport(req: Request, res: Response) {
        const body = req.body as NewUserType;

        const report = Report.create(
            {
                content: body.content
            }
        );

        try {
            Report.save(report);

            return sendResponse(res, {
                statusCode: StatusCodes.CREATED,
                message: 'Successfully added report'
            });
        } catch (error) {
            return sendResponse(res, {
                success: false,
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                message: 'Unexpected server error'
            });
        }
    }

}