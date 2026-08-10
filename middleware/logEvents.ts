import { format }  from 'date-fns'
import * as uuid from 'uuid'
import fs from 'fs'
import path from 'path'
import * as fsPromises from 'node:fs/promises'
import { fileURLToPath } from 'url';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const logEvents = async (message: string, logFileName: string) => {
    const dateTime = `${format(new Date(), 'yyyy/MM/dd HH:mm:ss')}`;
    const logitem = `${dateTime} \tuuid: ${uuid.v4()}  \tmesssage: ${message}\n`;
    console.log(logitem);
    try {
        if (!fs.existsSync(path.join(dirname, '..', 'logs'))) {
            await fsPromises.mkdir(path.join(dirname, '..', 'logs'));
        }
        await fsPromises.appendFile(path.join(dirname, '..', 'logs', logFileName), logitem)
    } catch (err) {
        console.error(err);
    } 
}

export default logEvents;