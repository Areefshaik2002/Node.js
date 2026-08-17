import type { Response, NextFunction } from 'express'
import type { AuthenticatedRequest } from './verifyJWT.js'

export const verifyRoles = (...allowedRoles: number[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!req.roles) {
            res.status(401)
            return
        }

         const rolesArray = [...allowedRoles]
         const result = req.roles.map(role => rolesArray.includes(role)).find(val => val === true)

         if (!result) {
            res.sendStatus(401)
            return
         }

         next() 
    }
}