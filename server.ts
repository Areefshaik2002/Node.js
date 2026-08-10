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
        default:
            contentType = 'text/html'
    }

    const filePath = path.join(dirName, 'views', req.url == '/' ? 'index.html' : req.url!+ '.html')

    try {
        const data = await fsPromise.readFile(filePath)
        res.writeHead(200, {'content-type': contentType})
        res.end(data)
    } catch {
        res.writeHead(404, {'content-type': 'text/html'})
        const notFound = await fsPromise.readFile(path.join(dirName, 'views', '404.html'))
        res.end(notFound)

    }

    // console.log(req.method, req.url)
    // res.writeHead(200, {'content-type':'text/plain'})
    // res.end("Hello world")
})

server.listen(PORT, () => {
    console.log(`server is running at port: ${PORT}`)
})