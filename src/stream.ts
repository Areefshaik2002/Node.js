import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const fileName = fileURLToPath(import.meta.url)
const dirName = path.dirname(fileName)

const rs = fs.createReadStream(path.join(dirName, 'files', 'sample.txt'), 'utf-8');
const ws = fs.createWriteStream(path.join(dirName, 'files', 'newSample.txt'))

/*
rs.on('data', (dataChunk) => {
    console.log(dataChunk);
    ws.write(dataChunk);
})
*/

rs.pipe(ws);


