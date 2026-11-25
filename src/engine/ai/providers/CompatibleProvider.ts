import type {AIProvider,AIRequest} from './AIProvider';
export type ProviderOptions={baseUrl:string;model:string;apiKey?:string;timeoutMs?:number};
export class CompatibleProvider implements AIProvider {
 constructor(private readonly options:ProviderOptions){}
 async generate(request:AIRequest):Promise<string>{
 const {baseUrl,model,apiKey,timeoutMs=120000}=this.options;
 const response=await fetch(`${baseUrl.replace(/\/+$/,'')}/chat/completions`,{method:'POST',headers:{'Content-Type':'application/json',...(apiKey?{Authorization:`Bearer ${apiKey}`}:{})},signal:AbortSignal.timeout(timeoutMs),body:JSON.stringify({model,messages:[{role:'system',content:request.system},{role:'user',content:request.prompt}],...(request.temperature===undefined?{}:{temperature:request.temperature}),...(request.maxTokens===undefined?{}:{max_tokens:request.maxTokens})})});
if (!response.ok) {
  const details = await response.text();

  throw new Error(
    `AI provider HTTP ${response.status}: ${details}`
  );
} const result=await response.json() as {choices?:{message?:{content?:unknown};finish_reason?:string}[]};
 const choice=result.choices?.[0];
 if(choice?.finish_reason==='length')throw new Error('AI response truncated');
 const content=choice?.message?.content;
 if(typeof content!=='string'||!content.trim())throw new Error('Empty AI response');
 return content;
 }
}
