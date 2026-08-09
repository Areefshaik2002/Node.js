import { format }  from 'date-fns'
import * as uuid from 'uuid'
import fs from 'fs'
import path from 'path'
import * as fsPromises from 'node:fs/promises'
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const logEvents = async (message:String) => {
    const dateTime = `${format(new Date(), 'yyyy/MM/dd HH:mm:ss')}`;
    const logitem = `${dateTime} \tuuid: ${uuid.v4()}  \tmesssage: ${message}\n`;
    console.log(logitem);
    try {
        if (!fs.existsSync(path.join(__dirname, 'logs'))) {
            await fsPromises.mkdir(path.join(__dirname, 'logs'));
        }
        await fsPromises.appendFile(path.join(__dirname, 'logs', 'eventLog.txt'), logitem);
    } catch (err) {
        console.error(err);
    } 
}

export default logEvents;