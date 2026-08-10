import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const fileName = fileURLToPath(import.meta.url)
const dirName = path.dirname(fileName)
const PORT = process.env.port || 3500
const app = express()
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))

/* Creating a web server - chapter 5

import http from 'http'
import path from 'path'
import * as fsPromise from 'node:fs/promises'
import fs from 'fs'
import { fileURLToPath } from 'url'

const fileName = fileURLToPath(import.meta.url)
const dirName = path.dirname(fileName)
const PORT = process.env.PORT || 3500

const server = http.createServer( async (req, res) => {
    const extension = path.extname(req.url ?? '/')

    let contentType: string

    switch (extension) {
        case '.css':
            contentType = 'text/css'
            break
        case '.js':
            contentType = 'text/javascript'
            break
        case '.json':
            contentType = 'application/json'
            break
        case '.jpg':
            contentType = 'image/jpeg'
            break
        case '.png':
            contentType = 'image/png'
            break
        case '.txt':
            contentType = 'text/plain'
            break
        default:
            contentType = 'text/html'
    }

    let filePath = contentType === 'text/html' && req.url === '/'
        ? path.join(dirName, 'views', 'index.html')
        : contentType === 'text/html' && req.url?.slice(-1) === '/'
        ? path.join(dirName, 'views', req.url, 'index.html')
        : contentType === 'text/html'
        ? path.join(dirName, 'views', req.url ?? '')
        : path.join(dirName, req.url ?? '')

    if (!extension && req.url?.slice(-1) !== '/') {
        filePath += '.html'
    }

    const fileExists = fs.existsSync(filePath)
    
    const serveFile = async (filePath: string, contentType: string, res: http.ServerResponse) => {
        try {
            const data = await fsPromise.readFile(filePath)
            res.writeHead(200, { 'Content-Type': contentType })
            res.end(data)
        } catch (err) {
            console.error(err)
            res.statusCode = 500
            res.end()
        }
    }

    if (fileExists) {
        serveFile(filePath, contentType, res)
    } else {
        switch (path.parse(filePath).base) {
            case 'old-page.html':
                res.writeHead(301, { 'Location': '/new-page.html' })
                res.end()
                break
            case 'www-page.html':
                res.writeHead(301, { 'Location': '/' })
                res.end()
                break
            default:
                serveFile(path.join(dirName, 'views', '404.html'), 'text/html', res)
        }
    }
    // console.log(req.method, req.url)
    // res.writeHead(200, {'content-type':'text/plain'})
    // res.end("Hello world")
})

server.listen(PORT, () => {
    console.log(`server is running at port: ${PORT}`)
})
*/