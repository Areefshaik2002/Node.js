import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const fileName = fileURLToPath(import.meta.url)
const dirName = path.dirname(fileName)

const router = express.Router()

router.get('/', (req, res) => {
    res.sendFile(path.join(dirName, '..', 'views', 'index.html'))
})

router.get('/index.html', (req, res) => {
    res.sendFile(path.join(dirName, '..', 'views', 'index.html'))
})

router.get('/new-page', (req, res) => {
    res.sendFile(path.join(dirName, '..', 'views', 'new-page.html'))
})

router.get('/new-page.html', (req, res) => {
    res.sendFile(path.join(dirName, '..', 'views', 'new-page.html'))
})

router.get('/old-page', (req, res) => {
    res.redirect(301, '/new-page.html')
})

export default router