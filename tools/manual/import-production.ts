import {dirname} from 'node:path';
import {install,read,run} from './shared';
run(async()=>{const [file,folder]=process.argv.slice(2);if(!file)throw new Error('Usage: import-production.ts production.json [output-folder]');await install(await read(file),folder??dirname(file));});
