import { format }  from 'date-fns'
import * as uuid from 'uuid'
import fs from 'fs'
import path from 'path'
import * as fsPromises from 'node:fs/promises'


console.log(format(new Date(), 'yyyy/MM/dd HH:mm:ss'))

console.log(uuid.v4());