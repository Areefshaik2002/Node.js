import type { Request, Response } from 'express';
import fsPromises from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface User {
    username: string;
    password: string;
    refreshToken?: string;
}

const usersDB = {
    users: [] as User[],
    setUsers(data: User[]) {
        this.users = data;
    }
};

import usersData from '../data/users.json' with { type: 'json' };
usersDB.setUsers(usersData as User[]);

export const handleLogout = async (req: Request, res: Response): Promise<void> => {
    // On client side, also delete the accessToken in memory/state

    const cookies = req.cookies;
    if (!cookies?.jwt) {
        res.sendStatus(204); // No content to clear, but success
        return;
    }

    const refreshToken = cookies.jwt as string;

    // Is refreshToken in DB?
    const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken);
    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });
        res.sendStatus(204);
        return;
    }

    // Delete refreshToken in DB
    const otherUsers = usersDB.users.filter(person => person.refreshToken !== foundUser.refreshToken);
    const currentUser = { ...foundUser, refreshToken: '' };
    usersDB.setUsers([...otherUsers, currentUser]);

    await fsPromises.writeFile(
        path.join(__dirname, '..', 'data', 'users.json'),
        JSON.stringify(usersDB.users, null, 2)
    );

    // Clear cookie
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });
    res.sendStatus(204);
};
