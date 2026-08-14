import type { Request, Response } from "express"
import fsPromises from 'node:fs/promises'
import bcrypt from 'bcrypt'
import { fileURLToPath } from "node:url"
import path from 'path'
import type { User } from './registerController.js'
import { usersDB } from './registerController.js'
import usersData from '../data/users.json' with {type: 'json'}
 
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
        res.json({message: `User ${username} is logged in!`})
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
}

