export type AIRequest = {system:string; prompt:string; temperature?:number; maxTokens?:number};
export interface AIProvider { generate(request:AIRequest):Promise<string>; }
export function parseAIJson(text:string):unknown {
 const clean=text.trim().replace(/^```(?:json)?\s*\n/i,'').replace(/\n```\s*$/,'');
 return JSON.parse(clean);
}
