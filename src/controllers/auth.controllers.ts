import { Request, Response } from 'express';
import { Controller, Route } from '../decorators/express.decorator';


@Route({ path: 'auth' })
export class Auth {

    @Controller('POST', '/login')
    async login(req: Request, res: Response) {
        // TODO:
    }

    @Controller('POST', '/register')
    async register(req: Request, res: Response) {
        // TODO:
    }

    @Controller('POST', '/refresh')
    async refreshToken(req: Request, res: Response) {
        // TODO:
    }

}