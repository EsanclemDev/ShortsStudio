import {z} from 'zod';
import {parseAIJson,type AIProvider} from '../ai/providers/AIProvider';
import {AnimationSchema,validateAnimation} from './ComponentAnimation';
import type {Component3D} from './ComponentSchema';
export async function buildAnimation(provider:AIProvider,component:Component3D,description:string){
 let feedback='';for(let i=0;i<3;i++){try{const raw=await provider.generate({system:'Return only JSON animation instance. Animate existing parts only. Absolute local transforms, radians. Preserve geometry. Start each track at zero and end at duration; for loops endpoints identical. Use scale for squash/stretch. Schema: '+JSON.stringify(z.toJSONSchema(AnimationSchema,{io:'input'})),prompt:JSON.stringify({componentId:component.id,componentVersion:component.version,parts:component.parts.map(({id,parentId,position,rotation,scale})=>({id,parentId,position,rotation,scale})),description,feedback}),temperature:0.2,maxTokens:[8192,16000,32000][i]});return validateAnimation(parseAIJson(raw),component);}catch(e){if(i===2||/HTTP 429|HTTP 401|HTTP 403/i.test(String(e)))throw e;feedback=String(e).slice(0,2000);}}throw new Error('Animation generation exhausted');
}
