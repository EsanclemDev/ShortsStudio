import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {join} from 'node:path';
import assert from 'node:assert/strict';
import {buildCreativeContext,creativeSystemPrompt,score,rubric} from '../../src/engine/ai/creative/CreativeContext.mjs';
if(process.argv.includes('--self-test')){
 const video={scenes:[{id:'a',start:0,end:2,entities:[]},{id:'b',start:2,end:4,entities:[]}]},input={narration:'test',captions:[{text:'hello',startMs:0,endMs:2000}]};
 const c=buildCreativeContext({video,input});assert.equal(c.scenes[0].narration,'hello');assert.equal(c.scenes[1].narration,'');assert.equal(c.scenes[1].role,'payoff');assert.equal(Object.values(rubric).reduce((a,b)=>a+b),100);assert.equal(score(Object.fromEntries(Object.keys(rubric).map(k=>[k,8]))),8);assert.throws(()=>score({}));assert.throws(()=>buildCreativeContext({video,input,format:'dialogue'}));assert.match(creativeSystemPrompt(c),/scientific accuracy/);console.log('Creative context smoke OK');
}else{
 const [props,input,out,...options]=process.argv.slice(2);if(!props||!input||!out)throw Error('Usage: creative-context.mjs props.json director-input.json output-dir [--format=id] [--catalog=path] [--repair=path]');
 const read=p=>JSON.parse(readFileSync(p,'utf8'));const opt=k=>options.find(x=>x.startsWith('--'+k+'='))?.slice(k.length+3);if(options.some(x=>!/^--(format|catalog|repair)=.+$/.test(x)))throw Error('Unknown option');
 const context=buildCreativeContext({video:read(props).video,input:read(input),format:opt('format')??'auto',catalog:opt('catalog')?read(opt('catalog')):[],repair:opt('repair')?read(opt('repair')):[]});mkdirSync(out,{recursive:true});writeFileSync(join(out,'creative-context.json'),JSON.stringify(context,null,2));writeFileSync(join(out,'creative-system-prompt.txt'),creativeSystemPrompt(context));console.log('Creative context prepared: '+out+' (0 API calls)');
}
