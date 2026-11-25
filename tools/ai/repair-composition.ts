import {readFileSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import {join,resolve} from 'node:path';
import {repairComposition} from '../../src/engine/director/composition/DeterministicRepair';
const [input,output]=process.argv.slice(2);if(!input||!output)throw new Error('Usage: repair-composition.ts video.json output-directory');const dir=resolve(output);if(existsSync(dir))throw new Error('Output directory exists');const {video,report}=repairComposition(JSON.parse(readFileSync(input,'utf8')));mkdirSync(dir,{recursive:true});for(const [name,data] of Object.entries({'video.json':video,'props.json':{video},'repair-report.json':report}))writeFileSync(join(dir,name),JSON.stringify(data,null,2));console.log(`Repaired ${video.scenes.length} scenes: ${dir}`);
