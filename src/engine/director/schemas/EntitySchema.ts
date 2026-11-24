import {z} from 'zod';
import {TrackSchema,Vec3} from './AnimationSchema';
const n=z.number().optional(), s=z.string().optional(), b=z.boolean().optional(), v=Vec3.optional();
const positive=z.number().positive().optional();
const frame=z.number().int().nonnegative().optional();
const unit=z.number().min(0).max(1).optional();
const workout=z.strictObject({reps:z.number().int().positive(),period:positive,fail:b});
const clock={startFrame:frame,animationSpeed:positive,animationOffset:n};
const spatial={position:v,rotation:v,scale:positive,speed:positive,startFrame:frame};
const microBase={...spatial,intensity:n,duration:positive,color:s};
const effect={color:s,intensity:n,speed:positive,startFrame:frame,duration:positive};
export const entityProps={
 character:z.strictObject({...clock,position:v,size:positive,billboard:b,mouthOpen:unit,workout:workout.optional(),action:z.enum(['idle','walk','run','wave','dance','thumbsUp','point','drink','talk','surprised','bicepsCurl','bicepsCurlFatigue','exhausted','flex','celebrate']).optional(),appearance:z.strictObject({muscularity:unit,upperBodyMuscularity:unit,lowerBodyMuscularity:unit,shirtColor:s,shortsColor:s,shoeColor:s,skinColor:s,hairColor:s,hairStyle:z.enum(['spiky','short']).optional()}).optional()}),
 object:z.strictObject({...spatial,type:z.enum(['waterBottle','waterGlass','apple','banana','dumbbell','sugarCube','creatineJar','scoop','shaker']),animation:z.enum(['static','float','rotate','bounce','pulse','appear','shake','open','pour']).optional(),options:z.strictObject({label:s,fill:unit,open:unit,time:n}).optional()}),
 anatomy:z.strictObject({...microBase,type:z.enum(['brain','heart','lungs','stomach','kidneys','intestines']),animation:z.enum(['static','float','rotate','heartbeat','breathing','swelling','contract','appear','warning']).optional()}),
 micro:z.strictObject({...microBase,type:z.enum(['cell','redBloodCell','waterMolecule','sodiumIon','bacteria','virus','muscleFiber','atp','adp','phosphocreatine']),animation:z.enum(['static','float','rotate','pulse','swelling','shrink','division','vibrate','appear']).optional()}),
 particles:z.strictObject({type:z.enum(['water','bubble','sodium','blood','energy','dust']),motion:z.enum(['float','rise','fall','flow','orbit','burst']).optional(),count:z.number().int().positive().optional(),position:v,spread:v,direction:v,color:s,size:positive,speed:positive,seed:z.number().int().optional(),startFrame:frame}),
 liquid:z.strictObject({type:z.enum(['water','blood','gastric','generic']).optional(),position:v,radius:positive,height:positive,level:unit,animation:z.enum(['static','fill','drain','wave','pulse']).optional(),duration:positive,speed:positive,color:s,startFrame:frame}),
 liquidStream:z.strictObject({type:z.enum(['water','blood','gastric','generic']).optional(),from:Vec3,to:Vec3,radius:positive,speed:positive,curvature:n,startFrame:frame,duration:positive,color:s}),
 primitive:z.strictObject({shape:z.enum(['box','sphere']),position:v,rotation:v,dimensions:Vec3.optional(),radius:positive,color:s}),
 muscleEnergy:z.strictObject({}),osmosis:z.strictObject({mode:z.enum(['isotonic','hypotonic','hypertonic']).optional(),position:v,scale:positive,duration:positive,startFrame:frame}),
 glow:z.strictObject({...effect,position:v,radius:positive}),shockwave:z.strictObject({...effect,position:v,radius:positive,count:z.number().int().positive().optional()}),arrow:z.strictObject({...effect,from:Vec3,to:Vec3,thickness:positive,animated:b}),label:z.strictObject({...effect,text:z.string(),position:Vec3,target:Vec3,fontSize:positive}),
 repCounter:z.strictObject({...clock,workout,color:s,label:s}),energyMeter:z.strictObject({value:z.number().min(0).max(100),label:s,color:s}),progressComparison:z.strictObject({left:z.number(),right:z.number(),week:z.number().int().positive()}),screenEffect:z.strictObject({...effect,type:z.enum(['flash','vignette','danger','focus'])}),meter:z.strictObject({label:s,from:n,to:n,duration:positive,startFrame:frame,color:s,bottom:n,suffix:s}),text:z.strictObject({text:z.string(),color:s,fontSize:positive}),
};
export const EntitySchema=z.strictObject({id:z.string().min(1),type:z.enum(Object.keys(entityProps) as [keyof typeof entityProps,...(keyof typeof entityProps)[]]),props:z.record(z.string(),z.unknown()),speak:z.boolean().optional(),group:z.string().min(1).optional(),layout:z.strictObject({top:n,bottom:n,left:n,right:n,width:positive,height:positive,opacity:unit,zIndex:n}).optional(),start:z.number().nonnegative().optional(),end:z.number().positive().optional(),tracks:z.array(TrackSchema).optional()}).superRefine((e,c)=>{const result=entityProps[e.type].safeParse(e.props);if(!result.success)for(const issue of result.error.issues)c.addIssue({code:'custom',path:['props',...issue.path],message:issue.message});});
