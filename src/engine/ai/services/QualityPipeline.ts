import {dailyQuota} from './StructuredResponse';
import type {AIProvider} from '../providers/AIProvider';
import {analyzeCapabilities,CapabilityReportSchema,sanitizeCapabilities,type CapabilityReport} from './CapabilityAnalyzer';
import {reviewVideo,ReviewSchema,type Review} from './VisualReviewer';
import {generateVideoWithRepair,validateDirectorResponse,type VisualDirectorInput} from './VisualDirector';
import {repairQuality} from './QualityPatchEngine';
type Options=NonNullable<Parameters<typeof generateVideoWithRepair>[2]>;
export async function generateQualityVideo(provider:AIProvider,input:VisualDirectorInput,options:Options={},report:(name:string,data:unknown)=>void|Promise<void>=()=>{},resume:{initial?:unknown;capabilities?:unknown;review?:unknown;revised?:unknown;checkpoint?:unknown;providers?:Partial<Record<'capability'|'review'|'repair',AIProvider>>}={}){
 let capabilities:CapabilityReport|undefined;
 let capabilityError:string|undefined;
 let quotaError:unknown;
 try{const cached=CapabilityReportSchema.safeParse(resume.capabilities);capabilities=cached.success?sanitizeCapabilities(cached.data):await analyzeCapabilities(resume.providers?.capability??provider,input);}catch(e){if(dailyQuota(e))quotaError=e;capabilityError=String(e);await report('capability-error',{error:capabilityError});}
 await report('missing-capabilities',capabilities??{status:'unavailable',error:capabilityError});
 if(quotaError&&resume.initial===undefined&&!resume.providers?.capability)throw quotaError;
 const guidance=JSON.stringify(capabilities??{});
 const initial=resume.initial===undefined?await generateVideoWithRepair(provider,input,{...options,guidance}):validateDirectorResponse(JSON.stringify(resume.initial),input);
 await report('initial-video',initial);
 let review:Review;
 try{const cached=ReviewSchema.safeParse(resume.review);review=cached.success?cached.data:await reviewVideo(resume.providers?.review??provider,input,initial);}catch(e){await report('review-error',{error:String(e)});return initial;}
 await report('visual-review',review);
 const counts=(r:Review)=>({major:r.issues.filter(i=>i.severity==='major').length,minor:r.issues.filter(i=>i.severity==='minor').length});
 const before=counts(review);
 if(!review.issues.length){await report('quality-selection',{selected:'initial',reason:'No reported issues',before});return initial;}
 try{
  const saved=resume.checkpoint as {video?:unknown;completed?:string[]}|undefined;
  const completed=Array.isArray(saved?.completed)?saved.completed.filter(id=>typeof id==='string'&&initial.scenes.some(s=>s.id===id)):[];
  const base=saved?.video?validateDirectorResponse(JSON.stringify(saved.video),input):initial;
  const revised=(resume.revised===undefined||saved?.video!==undefined)?await repairQuality(resume.providers?.repair??provider,input,base,review,raw=>report('quality-patch-raw',{raw}),{completed,onScene:async(id,video)=>{completed.push(id);await report('repair-checkpoint',{video,completed:[...completed]});},onError:(id,e)=>report('repair-scene-error',{sceneId:id,error:String(e)})}):validateDirectorResponse(JSON.stringify(resume.revised),input);
  await report('revised-video',revised);
  const finalReview=await reviewVideo(resume.providers?.review??provider,input,revised);await report('visual-review-revised',finalReview);
  const after=counts(finalReview);
  if(after.major<before.major||(after.major===before.major&&after.minor<before.minor)){
   await report('quality-selection',{selected:'revised',before,after});return revised;
  }
  await report('quality-selection',{selected:'initial',reason:'No verified improvement',before,after});return initial;
 }catch(e){await report('quality-repair-error',{error:String(e)});}
 await report('quality-selection',{selected:'initial',reason:'Patch or review failed',before});return initial;
}
