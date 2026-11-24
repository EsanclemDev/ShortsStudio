import {z} from 'zod';
export const Vec3 = z.tuple([z.number(),z.number(),z.number()]);
export const ValueSchema = z.union([z.number(),z.string(),z.boolean(),Vec3]);
export const TrackSchema = z.strictObject({property:z.string().regex(/^[a-zA-Z][a-zA-Z0-9]*(\.[a-zA-Z][a-zA-Z0-9]*)*$/).refine(p=>!p.split('.').some(k=>['constructor','prototype','__proto__'].includes(k))),keyframes:z.array(z.strictObject({time:z.number().nonnegative(),value:ValueSchema,easing:z.enum(['linear','easeIn','easeOut','easeInOut','step']).optional()})).min(1)}).superRefine((t,c)=>{for(let i=1;i<t.keyframes.length;i++)if(t.keyframes[i].time<=t.keyframes[i-1].time)c.addIssue({code:'custom',path:['keyframes',i,'time'],message:'Keyframes must be strictly increasing'});});
