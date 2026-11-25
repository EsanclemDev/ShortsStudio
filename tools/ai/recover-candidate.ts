import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {validateDirectorResponse} from '../../src/engine/ai/services/VisualDirector';
async function main(){
 const [inputFile,candidateFile,folder]=process.argv.slice(2);
 if(!inputFile||!candidateFile||!folder)throw new Error('Usage: recover-candidate.ts director-input.json candidate.txt output-folder');
 const input=JSON.parse(await readFile(inputFile,'utf8'));
 const video=validateDirectorResponse(await readFile(candidateFile,'utf8'),input);
 await mkdir(folder,{recursive:true});
 await writeFile(resolve(folder,'video.json'),JSON.stringify(video,null,2));
 await writeFile(resolve(folder,'props.json'),JSON.stringify({video},null,2));
 console.log('Candidate recovered and validated (technical validation only)');
}
void main().catch(e=>{console.error(e);process.exitCode=1;});
