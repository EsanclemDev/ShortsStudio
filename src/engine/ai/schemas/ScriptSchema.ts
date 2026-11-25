import {z} from 'zod';
const text=z.string().trim().min(1);
export const ScriptSchema=z.strictObject({title:text,blocks:z.array(z.strictObject({role:z.enum(['hook','explanation','takeaway']),narration:text,visualIntent:text})).min(3).max(12),description:text,hashtags:z.array(text).max(10),claims:z.array(text)}).superRefine((s,c)=>{if(s.blocks[0]?.role!=='hook'||s.blocks.at(-1)?.role!=='takeaway')c.addIssue({code:'custom',message:'Script must start with hook and end with takeaway'});});
export type Script=z.infer<typeof ScriptSchema>;

export const GeneratedScriptSchema=ScriptSchema.safeExtend({narration:text,wordCount:z.number().int().positive(),targetSeconds:z.number().positive(),estimatedSeconds:z.number().nonnegative(),language:text});
