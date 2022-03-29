import validate from '../middlewares/validate.middleware';
import authenticate from '../middlewares/authenticate.middleware';

import { User } from '../entities/user.entity';
import { Donation } from '../entities/donation.entity';
import { Route, Controller } from '../decorators/express.decorator';
import { Request, Response } from 'express';
import { Errors, sendResponse } from '../utils/api.util';
import { getPayloadFromHeader } from '../utils/auth.util';
import {
    newDonationSchema,
    NewDonation
} from '../validations/donation.validation';

@Route({ path: 'donations' })
export class DonationRoute {

    @Controller('POST', '/add', validate(newDonationSchema))
    async addDonation(req: Request, res: Response) {
        const body = req.body as NewDonation;

        const donation = Donation.create({ ...body });
        await Donation.save(donation);

        return sendResponse(res, {
            message: 'Successfully added donation'
        });
    }

    @Controller('GET', '/', authenticate())
    async getAllDonations(req: Request, res: Response) {
        const payload = getPayloadFromHeader(req)!;
        const user = await User.findOne({ where: { id: payload.id } });

        if (!user) {
            throw Errors.NO_SESSION;
        }
        if (!user.hasAnyAccess('ADMIN')) {
            throw Errors.NO_PERMISSION;
        }

        const donations = await Donation.find();
        return sendResponse(res, {
            message: 'Found donations',
            data: { donations }
        });
    }

}