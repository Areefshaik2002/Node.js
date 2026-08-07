import * as os from 'os'
import path from 'path'
import { fileURLToPath } from 'url';


const fileName = fileURLToPath(import.meta.url)
const dirName = path.dirname(fileName)
console.log("Hello World");
console.log(os.platform());
console.log(os.hostname());

console.log(fileName);
console.log(dirName)
