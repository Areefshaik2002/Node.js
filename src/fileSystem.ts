import fs from 'fs'
import * as newFs from 'node:fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const fileName = fileURLToPath(import.meta.url)
const dirName = path.dirname(fileName)

const fileOperations = async () => {
    try {
        await newFs.writeFile(path.join(dirName, 'Files', "read.txt"), "sample read file")
        const data = await newFs.readFile(path.join(dirName, 'Files', 'read.txt'), 'utf-8');
        console.log(data);
        await newFs.unlink(path.join(dirName, 'Files', "read.txt"))
        await newFs.writeFile(path.join(dirName, 'Files', "promiseWrite.txt"), data)
        await newFs.appendFile(path.join(dirName, 'Files', "promiseWrite.txt"), "\n\n thank you.")
        await newFs.rename(path.join(dirName, 'Files', "promiseWrite.txt"), path.join(dirName, 'Files', "promiseComplete.txt"))
        const newData = await newFs.readFile(path.join(dirName, 'Files', 'promiseComplete.txt'), 'utf-8');
        console.log(newData);
    } catch(err) {
        console.error(err)
    }
}

fileOperations();

/*
fs.readFile(path.join(dirName, 'Files', 'read.txt'), 'utf-8', (err, data) => {
    if (err) return err;
    console.log(data.toString());
} )

fs.writeFile(path.join(dirName, 'write.txt'),"This is new file", (err) => { //Cal back hell
    if (err) return err;
    console.log("Write completed");

    fs.appendFile(path.join(dirName, 'Files', 'write.txt'), "\n\nThis is a new modification to this file", (err) => {
        if (err) return err;
        console.log("Append completed 1")

        fs.rename(path.join(dirName, 'Files', 'wrote.txt'), path.join(dirName, 'Files', 'write.txt'), (err) => {
            if (err) return err;
            console.log("rename completed")
        })
    })
})


fs.appendFile(path.join(dirName, 'Files', 'append.txt'), "This is a new appended file", (err) => {
    if (err) return err;
    console.log("Append completed 2")
})
*/

process.on('uncaughtException', err => {
    console.error(`There was an uncaugth error: ${err}`);
    process.exit(1);
})