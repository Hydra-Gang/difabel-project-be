import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Controller, Route } from '../decorators/express.decorator';
import { Report, ReportStatuses } from '../entities/report.entity';
import { User } from '../entities/user.entity';
import authenticate from '../middlewares/authenticate.middleware';
import validate from '../middlewares/validate.middleware';
import { sendResponse } from '../utils/api.util';
import {
    newReportSchema, NewReportType
} from '../validations/report.validation';

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
        const body = req.body as NewReportType;

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

    @Controller('PUT', '/status-update/:reportId', authenticate)
    async updateReportStatus(req: Request, res: Response) {
        const reportId = req.params.reportId;
        const userId = req.body.$auth;

        let report;

        try {
            report = await Report.findOne({ where: { id: reportId } });

            if (!report) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.NOT_FOUND,
                    message: 'Report not found'
                });
            }
        } catch (error) {
            return sendResponse(res, {
                success: false,
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                message: 'Unexpected server error'
            });
        }

        const user = await User.findOne({ where: { id: userId } });

        report.updatedAt = new Date();
        report.status = ReportStatuses.RESOLVED;
        report.user = user;

        try {
            await Report.save(report);

            return sendResponse(res, {
                message: 'Successfully mark the report status as resolved'
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