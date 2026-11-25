import {dirname} from 'node:path';
import {patch,read,run} from './shared';
run(async()=>{const [file,folder]=process.argv.slice(2);if(!file)throw new Error('Usage: apply-patch.ts patch.json [output-folder]');await patch(await read(file),folder??dirname(file));});
