import { Location } from '../entities/location.entity';
import { Request, Response } from 'express';
import { Controller, Route } from '../decorators/express.decorator';

@Route({ path: 'map' })
export class MapRoute {

    @Controller('POST', '/add')
    async register(req: Request, res: Response) {
        console.log(req.body.name);
        // const body = req.body as RegisterType;
        // const user = User.create({ ...body });

        // const foundUser = await User.findOne({
        //     where: { email: user.email }
        // });

        // if (foundUser) {
        //     throw new ResponseError(
        //         'This email is already registered',
        //         StatusCodes.BAD_REQUEST);
        // }

        // const hashedPassword = await bcrypt.hash(
        //     user.password,
        //     config.hashRounds);

        // user.password = hashedPassword;
        // await User.save(user);

        // return sendResponse(res, {
        //     statusCode: StatusCodes.CREATED,
        //     message: 'Successfully registered new user'
        // });
    }

}