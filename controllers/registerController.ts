import type { Request, Response } from "express";
import bcrypt from 'bcrypt'
import fsPromises from 'node:fs/promises'
import path from 'path'
import { fileURLToPath } from "url"

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

//Define user interface
export interface User {
    username: string
    password: string
}

// In-memory data store for users (initialized from users.json)
export const usersDB = {
    users: [] as User[],
    setUsers(data: User[]) {
        this.users = data
    }
}

// Import existing users JSON
import usersData from '../data/users.json' with { type: 'json' }
// Initialize in-memory users DB from JSON file
usersDB.setUsers(usersData as User[])

export const handleNewUser = async (req: Request, res: Response): Promise<void> => {
    const { username,password } = req.body

    if ( !username || !password ) {
        res.status(400).json({ message:"username and password are required." })
    }

    //check for duplicate
    const duplicate = usersDB.users.find(user => user.username === username);
    if (duplicate) {
        res.status(422).json({ message:"Username already exists" })//422 conflict
        return
    }

    try {
        // Hash the password (salt rounds = 10)
        const hashedPassword = await bcrypt.hash(password, 10)

        //create and store the new user
        const newUser: User = { username, password: hashedPassword };
        usersDB.setUsers([...usersDB.users, newUser])

        //persist to users.json file
        await fsPromises.writeFile(path.join(dirname, '..', 'data', 'users.json'), JSON.stringify(usersDB.users, null, 2))
        console.log(usersDB.users)

        res.status(201).json({ message:`New user ${username} is created` })
    } catch(err) {
        const error = err as Error
        res.status(500).json({ message: error.message})
    }
}