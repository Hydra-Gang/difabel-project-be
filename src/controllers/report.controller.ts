import authenticate from '../middlewares/authenticate.middleware';
import validate from '../middlewares/validate.middleware';

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Controller, Route } from '../decorators/express.decorator';
import { Report, ReportStatuses } from '../entities/report.entity';
import { User } from '../entities/user.entity';
import { Errors, sendResponse } from '../utils/api.util';
import { getPayloadFromHeader } from '../utils/auth.util';
import {
    newReportSchema,
    NewReportType
} from '../validations/report.validation';

@Route({ path: 'reports' })
export class ReportRoute {

    @Controller('GET', '/', authenticate())
    async getReports(req: Request, res: Response) {
        const reports = await Report.find({ relations: { resolver: true } });
        const output = reports.map((report) => report.filter());

        return sendResponse(res, {
            message: 'Managed to get all reports',
            data: { reports: output }
        });
    }

    @Controller('POST', '/add', validate(newReportSchema))
    async addReport(req: Request, res: Response) {
        const body = req.body as NewReportType;

        const report = Report.create({ content: body.content });
        await Report.save(report);

        return sendResponse(res, {
            statusCode: StatusCodes.CREATED,
            message: 'Successfully added report'
        });
    }

    @Controller('PUT', '/status/:reportId', authenticate())
    async updateReportStatus(req: Request, res: Response) {
        const reportId = parseInt(req.params.reportId);
        const payload = getPayloadFromHeader(req)!;
        const user = await User.findOneBy({ id: payload.id });

        if (!user) {
            throw Errors.NO_SESSION;
        }
        if (!user.hasAnyAccess('ADMIN')) {
            throw Errors.NO_PERMISSION;
        }

        const report = await Report.findOneBy({
            id: reportId,
            status: ReportStatuses.PENDING
        });

        if (!report) {
            return sendResponse(res, {
                success: false,
                statusCode: StatusCodes.NOT_FOUND,
                message: 'Report not found'
            });
        }

        report.updatedAt = new Date();
        report.status = ReportStatuses.RESOLVED;
        report.resolver = user;

        await Report.save(report);

        return sendResponse(res, {
            message: 'Successfully mark the report status as resolved'
        });
    }

}