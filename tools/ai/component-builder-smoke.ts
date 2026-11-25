import assert from 'node:assert/strict';
import {buildComponent} from '../../src/engine/components/ComponentBuilder';
import type {ComponentRequest} from '../../src/engine/components/ComponentSchema';
async function main(){
 const request:ComponentRequest={id:'liver',category:'anatomy',name:'Liver',description:'Stylized liver',dimension:'3d'};
 const good={...request,schemaVersion:1,version:1,parts:[{id:'body',geometry:{type:'sphere',radius:1},material:{color:'#994433'}}]};
 let calls=0;const result=await buildComponent({generate:async()=>JSON.stringify(++calls===1?{...good,id:'wrong'}:good)},request);
 assert.equal(calls,2);assert.equal(result.id,'liver');assert.deepEqual(result.parts[0].scale,[1,1,1]);
 await assert.rejects(()=>buildComponent({generate:async()=>JSON.stringify({...good,parts:[]})},request));
 await assert.rejects(()=>buildComponent({generate:async()=>{throw new Error('unexpected call');}},{...request,dimension:'2d'}),/Only 3D/);
 const budgets:number[]=[];
 const recovered=await buildComponent({generate:async(r)=>{budgets.push(r.maxTokens??0);if(budgets.length<3)throw new Error('AI response truncated');return JSON.stringify(good);}},request);
 assert.equal(recovered.id,'liver');assert.deepEqual(budgets,[8192,16000,32000]);
 let quotaCalls=0;
 await assert.rejects(()=>buildComponent({generate:async()=>{quotaCalls++;throw new Error('AI provider HTTP 429: daily quota');}},request),/429/);
 assert.equal(quotaCalls,1);
 console.log('Component builder smoke test OK');
}
void main().catch(e=>{console.error(e);process.exitCode=1;});
