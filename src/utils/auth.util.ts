import jwt from 'jsonwebtoken';
import config from '../configs/config';

import { User } from '../entities/user.entity';

export type TokenType = 'ACCESS' | 'REFRESH';

export type UserPayload = {
    id: number,
    email: string
};

// ------------------------------------------------------------------------ //

/**
 * TODO: Use proper storage
 */
export const REFRESH_TOKEN_LIST: string[] = [];

// ------------------------------------------------------------------------ //

export function createPayload(user: User | UserPayload) {
    return { id: user.id, email: user.email };
}

export function generateToken(user: User | UserPayload, tokenType: TokenType) {
    if (tokenType !== 'ACCESS' && tokenType !== 'REFRESH') {
        throw Error('Token type is not defined');
    }

    let tokenSecret: string;
    const signOption: jwt.SignOptions = { notBefore: config.jwt.notBefore };

    if (tokenType === 'ACCESS') {
        tokenSecret = config.jwt.accessSecret;
        signOption.expiresIn = config.jwt.accessExpire;
    } else {
        tokenSecret = config.jwt.refreshSecret;
        signOption.expiresIn = config.jwt.refreshExpire;
    }

    return jwt.sign(createPayload(user), tokenSecret, signOption);
}

export function extractToken(rawToken?: string) {
    const prefix = 'Bearer ';
    const isValid = !!rawToken && rawToken.startsWith(prefix);

    if (isValid) {
        return rawToken.replace(prefix, '');
    }
}