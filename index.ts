// npm fundamentals
import { format }  from 'date-fns'
import * as uuid from 'uuid'

console.log(format(new Date(), 'yyyy/MM/dd HH:mm:ss'))

console.log(uuid.v4());

/////

import logEvents from './logEvents.js'
import EventEmitter from 'events'

class MyEmitter extends EventEmitter {};

//Initialize
const myEmitter = new MyEmitter();

//add listner
myEmitter.on('log', (msg) => logEvents(msg));

setTimeout(() => {
    //emit event
    myEmitter.emit('log', 'log event emitted');
}, 2000)