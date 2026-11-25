import {access} from 'node:fs/promises';
import {basename,resolve,join} from 'node:path';
import {execFileSync} from 'node:child_process';
import {read,save} from './shared';
export async function exists(p:string){try{await access(p);return true;}catch(e){if((e as NodeJS.ErrnoException).code==='ENOENT')return false;throw e;}}
export async function prepareContext(folder:string){
 const target=join(folder,'director-input.json');
 if(await exists(target))return read(target);
 const id=basename(resolve(folder));
 if(!/^[a-zA-Z0-9_-]+$/.test(id))throw new Error('Invalid video folder ID');
 const publicFolder=join('public','audio','director',id);
 async function locate(names:string[]){for(const base of [folder,publicFolder])for(const name of names){const p=join(base,name);if(await exists(p))return p;}return undefined;}
 const voice=await locate(['voice.mp3','voice.wav','voice.m4a']);
 const captions=await locate(['captions.json']);
 const lip=await locate(['lipsync.json']);
 if(!voice||!captions)throw new Error('Missing voice.mp3/wav/m4a or captions.json in '+folder+' or '+publicFolder);
 let script=join(folder,'script.json');
 if(!await exists(script)){
  const words=await read(captions);
  if(!Array.isArray(words)||words.length<3||words.some(w=>typeof w.text!=='string'))throw new Error('Cannot reconstruct narration from captions');
  const blocks=[];let start=0;
  for(let i=0;i<words.length;i++)if(/[.!?…]$/.test(words[i].text.trim())||i===words.length-1){blocks.push(words.slice(start,i+1).map(w=>w.text.trim()).join(' '));start=i+1;}
  if(blocks.length<3){blocks.length=0;for(let i=0;i<3;i++)blocks.push(words.slice(Math.floor(i*words.length/3),Math.floor((i+1)*words.length/3)).map(w=>w.text.trim()).join(' '));}
  while(blocks.length>12)blocks.splice(blocks.length-2,2,blocks.slice(-2).join(' '));
  script=join(folder,'manual-reconstructed-script.json');
  await save(script,{title:id,blocks:blocks.map((narration,i)=>({role:i===0?'hook':i===blocks.length-1?'takeaway':'explanation',narration,visualIntent:'Design visuals from narration'})),description:'Reconstructed from captions',hashtags:[],claims:[]});
 }
 // Run the existing validated preparation pipeline, without a shell or API.
 execFileSync(process.execPath,[...process.execArgv,resolve('tools/ai/prepare-director.ts'),id,script,voice,captions,folder,...(lip?[lip]:[])],{stdio:'inherit'});
 return read(target);
}
