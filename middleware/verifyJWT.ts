import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthenticatedRequest extends Request {
    user?: string
    roles?: number[]
}

export const verifyJWT = (req: AuthenticatedRequest, res:Response, next:NextFunction): void => {
    const authHeader = req.headers.authorization || req.headers.Authorization as string

    //check if authorization header exist and starts wirh bearer
    if (!authHeader?.startsWith('Bearer ')) {
        res.sendStatus(401)
        return
    }

    // Extract token string
    const token = authHeader.split(' ')[1];
    if (!token) {
        res.sendStatus(401);
        return;
    }
    const secret = process.env.ACCESS_TOKEN_SECRET;
    if (!secret) {
        res.status(500).json({ message: 'Access token secret missing from server config.' });
        return;
    }

    jwt.verify(
        token,
        secret,
        (err, decoded) => {
            if (err) {
                res.sendStatus(401)
                return
            }

            const payload = decoded as { UserInfo: { username: string; roles: number[] }}
            req.user = payload.UserInfo.username
            req.roles = payload.UserInfo.roles
            next()
    })
}