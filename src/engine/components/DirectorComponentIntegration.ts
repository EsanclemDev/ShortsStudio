import {ComponentRegistry} from './ComponentRegistry';
import {buildComponent} from './ComponentBuilder';
import type {AIProvider} from '../ai/providers/AIProvider';
import type {CapabilityReport} from '../ai/services/CapabilityAnalyzer';
import {dailyQuota} from '../ai/services/StructuredResponse';
import {validateVideo} from '../director/VideoValidator';
import {entityProps} from '../director/schemas/EntitySchema';
export async function provisionComponents(registry:ComponentRegistry,provider:AIProvider,report:CapabilityReport,maxNew=3){
 const results:{name:string;status:string;error?:string}[]=[];let calls=0;
 const existing=await registry.list();
 for(const item of [...report.missingCapabilities].sort((a,b)=>['high','medium','low'].indexOf(a.priority)-['high','medium','low'].indexOf(b.priority))){
  const category=item.type;if(category!=='anatomy'&&category!=='micro'&&category!=='object')continue;
  const id=item.name.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,64).replace(/-$/,'');
  if(!/^[a-z][a-z0-9-]{0,63}$/.test(id))continue;
  if(existing.some(c=>c.id===id||c.name.toLowerCase()===item.name.toLowerCase())){results.push({name:item.name,status:'reused'});continue;}
  if(calls>=maxNew)break;calls++;
  try{const c=await buildComponent(provider,{id,name:item.name.slice(0,100),category,dimension:'3d',description:('Educational 3D model of '+item.name+'. '+item.reason).slice(0,1000)});await registry.registerComponent(c);existing.push({id:c.id,version:c.version,name:c.name,category:c.category,animations:[]});results.push({name:item.name,status:'created'});}catch(e){results.push({name:item.name,status:'failed',error:String(e)});if(dailyQuota(e))break;}
 }
 return results;
}
export async function hydrateComponents(raw:unknown,registry:ComponentRegistry){
 const video=validateVideo(raw);
 for(const scene of video.scenes)for(const e of scene.entities)if(e.type==='generated'){
  const p=entityProps.generated.parse(e.props);const component=await registry.getComponent(p.componentId,p.version);const animation=p.animationId?await registry.getAnimation(p.componentId,p.version,p.animationId):undefined;
  e.props={...p,component,...(animation?{animation}:{})};
 }
 return validateVideo(video);
}
