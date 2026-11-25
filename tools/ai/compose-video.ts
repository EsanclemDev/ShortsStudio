import {readFileSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {composeVideo} from '../../src/engine/director/composition/SceneComposer';
const [input,output]=process.argv.slice(2);if(!input||!output)throw new Error('Usage: compose-video.ts input.json output-directory');
const dir=resolve(output);if(existsSync(dir))throw new Error('Output directory already exists; choose a new directory');
const {video,report}=composeVideo(JSON.parse(readFileSync(input,'utf8')));mkdirSync(dir,{recursive:true});for(const [name,data] of Object.entries({'video.json':video,'props.json':{video},'composition-report.json':report}))writeFileSync(join(dir,name),JSON.stringify(data,null,2));console.log(`Composed ${video.scenes.length} scenes: ${dir}`);
