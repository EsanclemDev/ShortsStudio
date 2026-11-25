import {parseAIJson,type AIProvider,type AIRequest} from '../providers/AIProvider';
import {stripSchemaMetadata} from './stripSchemaMetadata';
export const dailyQuota=(e:unknown)=>/HTTP 429/i.test(String(e))&&/PerDay|per day|daily/i.test(String(e));
export async function structured<T>(provider:AIProvider,request:AIRequest,parse:(value:unknown)=>T):Promise<T>{
 let feedback='';
 for(let i=0;i<2;i++){
  let raw:string;
  try{raw=await provider.generate({...request,prompt:request.prompt+feedback,maxTokens:i===1&&request.maxTokens!==undefined?Math.min(16000,request.maxTokens*2):request.maxTokens});}
  catch(e){if(i===0&&/AI response truncated/i.test(String(e))){feedback='\nPrevious output was truncated. Return only concise JSON data, prioritizing the most important findings.';continue;}throw e;}
  try{return parse(stripSchemaMetadata(parseAIJson(raw)));}catch(e){if(i===1)throw e;feedback='\nPrevious response was invalid. Return a JSON data instance, NOT a schema. Validation: '+String(e);}
 }
 throw new Error('Unreachable');
}
