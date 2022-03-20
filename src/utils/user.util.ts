import jwt from 'jsonwebtoken';
import config from '../configs/config';
import { User } from '../entities/user.entity';

export const REFRESH_TOKEN_LIST: string[] = [];

export function createUserToken(user: User) {
    const payload = {
        id: user.id,
        email: user.email
    };

    const accessToken = jwt.sign(
        payload,
        config.jwt.accessSecret,
        {
            notBefore: config.jwt.notBefore,
            expiresIn: config.jwt.accessExpire,
        }
    );

    const refreshToken = jwt.sign(
        payload,
        config.jwt.refreshSecret,
        {
            notBefore: config.jwt.notBefore,
            expiresIn: config.jwt.refreshExpire
        }
    );

    REFRESH_TOKEN_LIST.push(refreshToken);
    return { accessToken, refreshToken };
}