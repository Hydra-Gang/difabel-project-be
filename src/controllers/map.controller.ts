import { Location } from '../entities/location.entity';
import { Request, Response } from 'express';
import { Controller, Route } from '../decorators/express.decorator';
import { newMapSchema, NewMapType } from '../validations/map.validation';
import { sendResponse } from '../utils/api.util';
import { StatusCodes } from 'http-status-codes';
import validate from '../middlewares/validate.middleware';

@Route({ path: 'map' })
export class MapRoute {

    @Controller('POST', '/add', validate(newMapSchema))
    async addLocation(req: Request, res: Response) {
        const body = req.body as NewMapType;

        const newLocation = Location.create({
            name: body.name,
            type: body.type,
            address: body.address,
            latitude: body.latitude,
            longitude: body.longitude
        });

        await Location.save(newLocation);
        return sendResponse(res, {
            statusCode: StatusCodes.CREATED,
            message: 'Successfully added report'
        });
    }

    @Controller('GET', '/')
    async getLocations(req: Request, res: Response) {
        const locations = await Location.find();

        return sendResponse(res, {
            message: 'Found location(s)',
            data: { locations }
        });
    }

}