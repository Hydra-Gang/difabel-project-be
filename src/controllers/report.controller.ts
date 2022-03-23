import authenticate from '../middlewares/authenticate.middleware';
import validate from '../middlewares/validate.middleware';

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Controller, Route } from '../decorators/express.decorator';
import { Report, ReportStatuses } from '../entities/report.entity';
import { User } from '../entities/user.entity';
import { sendResponse } from '../utils/api.util';
import { extractFromHeader } from '../utils/auth.util';
import {
    newReportSchema,
    NewReportType
} from '../validations/report.validation';

@Route({ path: 'reports' })
export class ReportRoute {

    @Controller('GET', '/', authenticate())
    async getReports(req: Request, res: Response) {
        const reports = await Report.find();

        return sendResponse(res, {
            message: 'Managed to get all reports',
            data: {
                reports
            }
        });
    }

    @Controller('POST', '/add', authenticate(), validate(newReportSchema))
    async addReport(req: Request, res: Response) {
        const body = req.body as NewReportType;

        const report = Report.create(
            {
                content: body.content
            }
        );

        await Report.save(report);
        return sendResponse(res, {
            statusCode: StatusCodes.CREATED,
            message: 'Successfully added report'
        });
    }

    @Controller('PUT', '/status-update/:reportId', authenticate())
    async updateReportStatus(req: Request, res: Response) {
        const reportId = parseInt(req.params.reportId);
        const payload = extractFromHeader(req)!;

        const report = await Report.findOne({
            where: {
                id: reportId,
                status: ReportStatuses.PENDING
            }
        });

        if (!report) {
            return sendResponse(res, {
                success: false,
                statusCode: StatusCodes.NOT_FOUND,
                message: 'Report not found'
            });
        }

        const user = await User.findOne({ where: { id: payload.id } });

        report.updatedAt = new Date();
        report.status = ReportStatuses.RESOLVED;
        report.user = user;

        await Report.save(report);

        return sendResponse(res, {
            message: 'Successfully mark the report status as resolved'
        });
    }

}