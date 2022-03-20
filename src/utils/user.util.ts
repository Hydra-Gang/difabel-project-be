import jwt from 'jsonwebtoken';
import config from '../configs/config';

import { User } from '../entities/user.entity';

export type UserLike = {
    id: number,
    email: string
};

export function createPayload(user: User | UserLike) {
    return {
        id: user.id,
        email: user.email
    };
}

/**
 * TODO: Use proper storage
 */
export const REFRESH_TOKEN_LIST: string[] = [];

export function genRefreshToken(user: User | UserLike) {
    const refreshToken = jwt.sign(
        createPayload(user),
        config.jwt.refreshSecret,
        {
            notBefore: config.jwt.notBefore,
            expiresIn: config.jwt.refreshExpire
        }
    );

    REFRESH_TOKEN_LIST.push(refreshToken);
    return refreshToken;
}

export function genAccessToken(user: User | UserLike) {
    const accessToken = jwt.sign(
        createPayload(user),
        config.jwt.accessSecret,
        {
            notBefore: config.jwt.notBefore,
            expiresIn: config.jwt.accessExpire,
        }
    );

    return accessToken;
}