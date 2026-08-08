// npm fundamentals
import { format }  from 'date-fns'
import * as uuid from 'uuid'

console.log(format(new Date(), 'yyyy/MM/dd HH:mm:ss'))

console.log(uuid.v4());