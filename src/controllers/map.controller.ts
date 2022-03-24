import { Location } from '../entities/location.entity';
import { Request, Response } from 'express';
import { Controller, Route } from '../decorators/express.decorator';

@Route({ path: 'map' })
export class MapRoute {

    @Controller('POST', '/add')
    async register(req: Request, res: Response) {
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

}