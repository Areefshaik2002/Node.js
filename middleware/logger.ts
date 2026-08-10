import express from 'express'
import logEvents  from './logEvents.js'

const logger = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    logEvents(`${req.method}\t${req.path}`, 'reqlog.txt')
    console.log(req.method, req.path)
    next()
}

export default logger