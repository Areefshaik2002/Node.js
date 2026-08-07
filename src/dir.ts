import fs from 'fs'

if (!fs.existsSync('./new')) {
fs.mkdir('./new', (err) => {
    if (err) return err;
    console.log("Directory created!")
})
}

if (fs.existsSync('./new')) {
fs.rmdir('./new', (err) => {
    if (err) return err;
    console.log("Directory removed!")
})
}

process.on('uncaughtException', err => {
    console.error(`there was an uncaught error: ${err}`)
    process.exit(1);
})