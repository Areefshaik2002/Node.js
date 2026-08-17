import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import type { User } from './registerController.js'
import { usersDB } from './registerController.js'
import usersData from '../data/users.json' with {type: 'json'}


usersDB.setUsers(usersData as User[]);

export const handleRefreshToken = (req: Request, res: Response): void => {
    const cookies = req.cookies;

    if (!cookies?.jwt) {
        res.sendStatus(401); // Unauthorized if no cookie present
        return;
    }
    
    const refreshToken = cookies.jwt as string;

    // Find user in DB matching this refresh token
    const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken);

    if (!foundUser) {
        res.sendStatus(403); // Forbidden
        return;
    }

    const roles = Object.values(foundUser.roles)

    const secret = process.env.REFRESH_TOKEN_SECRET;
    if (!secret) {
        res.status(500).json({ message: 'Refresh token secret missing.' });
        return;
    }

    // Evaluate JWT refresh token
    jwt.verify(
        refreshToken,
        secret,
        (err, decoded) => {
            const payload = decoded as { username: string };
            if (err || foundUser.username !== payload.username) {
                res.sendStatus(403); // Forbidden
                return;
            }

            // Issue a brand new Access Token
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                     "username": payload.username,
                     "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET!,
                { expiresIn: '30s' }
            );

            res.json({ accessToken });
        }
    );
};
