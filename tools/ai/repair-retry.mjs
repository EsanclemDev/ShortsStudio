export async function requestWithRetry(send,{sleep=ms=>new Promise(r=>setTimeout(r,ms)),log=console.log}={}) {
 const delays=[15000,30000,60000];
 for(let attempt=0;;attempt++) {
  const response=await send();
  if(response.ok)return response;
  const body=await response.text();
  const error=new Error(`HTTP ${response.status}: ${body.slice(0,800)}`);
  const daily=/per.?day|daily|requestsperday/i.test(body);
  if(attempt>=delays.length||!(response.status===503||response.status===429&&!daily))throw error;
  const header=response.headers.get('retry-after');
  const hint=header===null?0:/^\d+(\.\d+)?$/.test(header)?Number(header)*1000:Math.max(0,Date.parse(header)-Date.now());
  const match=body.match(/"retryDelay"\s*:\s*"([\d.]+)s"/i);
  const wait=Math.max(delays[attempt],hint||0,match?Number(match[1])*1000:0);
  if(wait>300000)throw error;
  log(`HTTP ${response.status}; retry ${attempt+1}/3 in ${wait/1000}s`);await sleep(wait);
 }
}
export function parseReply(raw){return JSON.parse(raw.trim().replace(/^\uFEFF/,'').replace(/^```(?:json)?\s*/i,'').replace(/\s*```$/,''));}
