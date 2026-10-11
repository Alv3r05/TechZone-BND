import { Request, Response, NextFunction } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import config from '../config';
import error from '../utils/error';

const secret: jwt.Secret = config.jwt.secret;

export interface TokenPayload {
    id: number;
    username: string;
}

export function sign(data: TokenPayload): string {
    const options: SignOptions = { expiresIn: config.jwt.expiresIn as SignOptions['expiresIn'] };
    return jwt.sign(data, secret, options);
}

export function verify(token: string): TokenPayload {
    return jwt.verify(token, secret) as TokenPayload;
}

function getToken(authorization: string | undefined): string {
    if (!authorization) {
        throw error('No authorization token provided', 401);
    }
    if (authorization.indexOf('Bearer ') === -1) {
        throw error('Invalid token format', 401);
    }
    return authorization.replace('Bearer ', '');
}

export function decodeHeader(req: Request): TokenPayload {
    const authorization = req.headers.authorization || '';
    const token = getToken(authorization);
    const decoded = verify(token);
    req.user = decoded;
    return decoded;
}

export const check = {
    logged(req: Request): void {
        decodeHeader(req);
    },
    own(req: Request, owner: number | string): void {
        const decoded = decodeHeader(req);
        if (Number(decoded.id) !== Number(owner)) {
            throw error('You are not the owner of this resource', 403);
        }
    },
};

export default { sign, verify, check, decodeHeader };
