import jwt from 'jsonwebtoken';
import config from '../configs/config';

import { Request } from 'express';
import { User } from '../entities/user.entity';

export type TokenType = 'ACCESS' | 'REFRESH';

export type UserPayload = {
    id: number,
    email: string
}

// ------------------------------------------------------------------------ //

/**
 * TODO: Use proper storage
 */
export const REFRESH_TOKEN_LIST: string[] = [];

// ------------------------------------------------------------------------ //

export function generateToken(user: User | UserPayload, tokenType: TokenType) {
    if (tokenType !== 'ACCESS' && tokenType !== 'REFRESH') {
        throw Error('Token type is not defined');
    }

    const signOption: jwt.SignOptions = { notBefore: config.jwt.notBefore };
    const payload: UserPayload = { id: user.id, email: user.email };
    let tokenSecret: string;

    if (tokenType === 'ACCESS') {
        tokenSecret = config.jwt.accessSecret;
        signOption.expiresIn = config.jwt.accessExpire;
    } else {
        tokenSecret = config.jwt.refreshSecret;
        signOption.expiresIn = config.jwt.refreshExpire;
    }

    return jwt.sign(payload, tokenSecret, signOption);
}

/**
 * Extracts the user's payload from the JWT.
 *
 * With this, we don't need to validate the token manually
 * and instead can focus with the payload content.
 *
 * @returns An `undefined` when invalid,
 *          otherwise you'll get {@link UserPayload}
 * @throws If you input the incorrect {@link TokenType}
 */
export function extractFromJWT(
    rawToken: string | undefined, tokenType: TokenType = 'ACCESS') {

    const prefix = 'Bearer ';
    if (!rawToken || !rawToken.startsWith(prefix)) {
        return;
    }

    const token = rawToken.replace(prefix, '');
    let secret: string;

    switch (tokenType) {
        case 'ACCESS':
            secret = config.jwt.accessSecret;
            break;
        case 'REFRESH':
            secret = config.jwt.refreshSecret;
            break;
        default:
            throw Error('Token type is not defined');
    }

    if (tokenType === 'REFRESH' && !REFRESH_TOKEN_LIST.includes(secret)) {
        return;
    }

    try {
        return jwt.verify(token, secret) as UserPayload;
    } catch (err) {
        // do nothing
    }
}

/**
 * Save an extra line with extracting the header from {@link Request}.
 *
 * @see {@link extractFromJWT}
 */
export function extractFromHeader(
    req: Request, tokenType: TokenType = 'ACCESS') {

    return extractFromJWT(req.header('authorization'), tokenType);
}