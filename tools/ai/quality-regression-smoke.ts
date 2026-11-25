import {strict as assert} from 'node:assert';
import {sanitizeCapabilities,SAFE_FALLBACK} from '../../src/engine/ai/services/CapabilityAnalyzer';
import {structured} from '../../src/engine/ai/services/StructuredResponse';
async function main(){
 const report=sanitizeCapabilities({missingCapabilities:['stomach','atp','cell','apple','banana','drink'].map(fallback=>({type:'other',name:'missing',priority:'high',reason:'test',fallback}))});
 assert(report.missingCapabilities.every(x=>x.fallback===SAFE_FALLBACK));
 let calls=0;
 const result=await structured({async generate(req){calls++;assert.equal(req.maxTokens,calls===1?8192:16000);if(calls===1)throw new Error('AI response truncated');return '{"ok":true}';}},{system:'test',prompt:'test',maxTokens:8192},x=>x);
 assert.deepEqual(result,{ok:true});assert.equal(calls,2);
 calls=0;await assert.rejects(()=>structured({async generate(){calls++;throw new Error('HTTP 429 per day');}},{system:'test',prompt:'test'},x=>x));assert.equal(calls,1);
 console.log('Quality regression smoke test OK');
}
void main().catch(e=>{console.error(e);process.exitCode=1;});
