import type { Request, Response } from "express"
import fsPromises from 'node:fs/promises'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { fileURLToPath } from "node:url"
import path from 'path'
import type { User } from './registerController.js'
import { usersDB } from './registerController.js'
import usersData from '../data/users.json' with {type: 'json'}
import { writeFile } from "node:fs"
 
const fileName = fileURLToPath(import.meta.url)
const dirName = path.dirname(fileName)

usersDB.setUsers(usersData as User[])

export const handleLogin = async (req:Request, res:Response): Promise<void> => {
    const { username, password } = req.body

    if (!username || !password) {
        res.status(400).json({message: 'Username and Password are required.'})
        return
    }

    const foundUser = usersDB.users.find(user => user.username === username)

    if (!foundUser) {
        res.status(401).json({message: 'Unauthorized'})
        return
    }

    //evaluate password with bcrypt
    const match = await bcrypt.compare(password, foundUser.password)
    if (match) {
        const roles = Object.values(foundUser.roles);
        //create a jwt access token
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                "username": foundUser.username,
                "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET as string,
            { expiresIn : '30s'}
        )
        //create a jwt refresh token
        const refreshToken = jwt.sign(
            {"username": foundUser.username},
            process.env.REFRESH_TOKEN_SECRET as string,
            { expiresIn: '1d'}
        )
        //save refreshToken with current user in users.json DB
        const otherUsers = usersDB.users.filter(user => user.username !== foundUser.username)
        const currentUser = {...foundUser, refreshToken}
        usersDB.setUsers([...otherUsers, currentUser])

        await fsPromises.writeFile(
            path.join(dirName, '..', 'data', 'users.json'),
            JSON.stringify(usersDB.users, null, 2)
        )

        //send refresh token as http cookie only
        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            sameSite: 'none',
            secure: false,
            maxAge: 24 * 60 * 60 * 1000
        })

        res.json({ accessToken})
        res.json({message: `User ${username} is logged in!`})
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
}

