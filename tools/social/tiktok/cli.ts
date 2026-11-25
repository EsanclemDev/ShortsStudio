import {createServer} from 'node:http';
import {randomBytes,createHash} from 'node:crypto';
import {stat,open,unlink,appendFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {read,save,run} from '../core';
import {chunks,challenge,parseArgs,uploadUrl,resumeIndex,canRetry} from './contract';
const root=resolve('.secrets/social/tiktok');
const scopes=['user.info.basic','user.info.stats','video.list','video.upload'];
const base='https://open.tiktokapis.com';
async function config(){const c=await read(join(root,'client.json'));if(c.environment!=='sandbox'||!c.clientKey||!c.clientSecret||c.redirectUri!=='http://127.0.0.1:3455/callback/')throw Error('Invalid Sandbox client configuration');return c;}
async function token(c:any,params:Record<string,string>){const r=await fetch(base+'/v2/oauth/token/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({client_key:c.clientKey,client_secret:c.clientSecret,...params}),redirect:'error',signal:AbortSignal.timeout(30000)});const t=await r.json();if(!r.ok||!t.access_token||!t.refresh_token||!t.open_id||!Number.isFinite(t.expires_in))throw Error('OAuth token exchange failed: '+(t.error||r.status));return {...t,expiresAt:Date.now()+t.expires_in*1000};}
async function api(t:any,path:string,body?:unknown){const r=await fetch(base+path,{method:body===undefined?'GET':'POST',headers:{Authorization:'Bearer '+t.access_token,'Content-Type':'application/json'},...(body===undefined?{}:{body:JSON.stringify(body)}),redirect:'error',signal:AbortSignal.timeout(30000)});const j=await r.json();if(!r.ok||j.error?.code!=='ok')throw Error('TikTok API: '+(j.error?.code||r.status));return j.data;}
const profile=(t:any)=>api(t,'/v2/user/info/?fields=open_id,display_name,follower_count,following_count,likes_count,video_count');
function checkScopes(t:any){if(!scopes.every(s=>String(t.scope).split(',').includes(s)))throw Error('Missing required scopes; reconnect and grant all four permissions');}
async function connect(){const c=await config();const state=randomBytes(32).toString('hex'),verifier=randomBytes(48).toString('base64url');const server=createServer();await new Promise<void>((ok,no)=>{server.once('error',no);server.listen(3455,'127.0.0.1',ok);});let timer:ReturnType<typeof setTimeout>|undefined;try{const url=new URL('https://www.tiktok.com/v2/auth/authorize/');url.search=new URLSearchParams({client_key:c.clientKey,response_type:'code',scope:scopes.join(','),redirect_uri:c.redirectUri,state,code_challenge:challenge(verifier),code_challenge_method:'S256'}).toString();const code=await new Promise<string>((ok,no)=>{timer=setTimeout(()=>no(Error('OAuth timeout')),300000);server.on('request',(req,res)=>{const u=new URL(req.url||'/',c.redirectUri);if(u.pathname!=='/callback/'||u.searchParams.get('state')!==state){res.writeHead(400).end('Invalid callback');return;}const code=u.searchParams.get('code');res.end(code?'Authorization received. Return to terminal.':'Authorization denied.');if(code)ok(code);else no(Error('Authorization denied'));});console.log('Open in browser:\n'+url);});const t=await token(c,{grant_type:'authorization_code',code,redirect_uri:c.redirectUri,code_verifier:verifier});checkScopes(t);const p=(await profile(t)).user;if(p.open_id!==t.open_id)throw Error('Account mismatch');await save(join(root,'token.json'),t);await save(join(root,'account.json'),{open_id:p.open_id,display_name:p.display_name,clientKey:c.clientKey});console.log('Connected:',p.display_name);}finally{clearTimeout(timer);server.close();server.closeAllConnections();}}
async function authorized(){const c=await config(),a=await read(join(root,'account.json'));let t=await read(join(root,'token.json'));if(a.clientKey!==c.clientKey||a.open_id!==t.open_id)throw Error('Account mismatch');if(t.expiresAt<Date.now()+60000){const lock=join(root,'refresh.lock'),fd=await open(lock,'wx');try{t=await read(join(root,'token.json'));if(t.expiresAt<Date.now()+60000){t=await token(c,{grant_type:'refresh_token',refresh_token:t.refresh_token});if(t.open_id!==a.open_id)throw Error('Refreshed account mismatch');await save(join(root,'token.json'),t);}}finally{await fd.close();await unlink(lock);}}checkScopes(t);return {t,a};}
const print=(v:unknown)=>console.log(JSON.stringify(v,null,2));
async function main(){const {cmd,folder,dry}=parseArgs(process.argv.slice(2));if(cmd==='connect')return connect();if(['publish','resume','retry'].includes(cmd)){
 const video=resolve(folder!,'video.mp4'),s=await stat(video);if(!s.isFile())throw Error('Not a video file');
 const plan=chunks(s.size),source_info={source:'FILE_UPLOAD',video_size:s.size,chunk_size:plan.size,total_chunk_count:plan.count};
 const ledger=resolve(folder!,'tiktok-publication.json'),lock=ledger+'.lock';
 if(dry){print({dryRun:true,command:cmd,video,source_info,mode:'inbox draft'});return;}
 const fd=await open(lock,'wx');try{
 let entry:any;try{entry=await read(ledger);}catch(e:any){if(e.code!=='ENOENT')throw e;}
 const {t,a}=await authorized();
 const f=await open(video,'r');try{
 const hash=createHash('sha256');for await(const b of f.createReadStream({autoClose:false,start:0}))hash.update(b);const digest=hash.digest('hex');
 const secretPath=(id:string)=>join(root,'uploads',createHash('sha256').update(id).digest('hex')+'.json');
 let offset=0,session:any;
 if(cmd==='publish'){if(entry)throw Error('Publication already recorded; reconcile before retrying');}
 else {
 if(!entry||entry.open_id!==a.open_id||!entry.publish_id)throw Error('No matching publication; reconcile manually');
 const remote=await api(t,'/v2/post/publish/status/fetch/',{publish_id:entry.publish_id});
 entry={...entry,status:remote,lastSyncedAt:new Date().toISOString()};await save(ledger,entry);
 if(cmd==='retry'){if(!canRetry(remote.status))throw Error('Retry requires remote FAILED; current status: '+remote.status);await appendFile(ledger+'.history.jsonl',JSON.stringify(entry)+'\n');}
 else {if(remote.status!=='PROCESSING_UPLOAD')throw Error('Resume requires PROCESSING_UPLOAD');session=await read(secretPath(entry.publish_id));if(session.open_id!==a.open_id||session.publish_id!==entry.publish_id||session.digest!==digest||session.bytes!==s.size||session.chunkSize!==plan.size||session.count!==plan.count||Date.now()>=session.expiresAt)throw Error('Upload session expired or video/account changed');offset=resumeIndex(remote.uploaded_bytes,s.size,plan.size,plan.count);}
 }
 if(cmd!=='resume'){
 entry={state:'pending',open_id:a.open_id,startedAt:new Date().toISOString()};await save(ledger,entry);
 const d=await api(t,'/v2/post/publish/inbox/video/init/',{source_info});if(typeof d.publish_id!=='string'||!d.publish_id||typeof d.upload_url!=='string')throw Error('Missing upload response');
 entry={...entry,publish_id:d.publish_id,state:'initialized'};await save(ledger,entry);
 uploadUrl(d.upload_url);session={publish_id:d.publish_id,open_id:a.open_id,url:d.upload_url,digest,bytes:s.size,chunkSize:plan.size,count:plan.count,expiresAt:Date.parse(entry.startedAt)+55*60000};await save(secretPath(d.publish_id),session);
 }
 const url=uploadUrl(session.url);console.log('Sending draft to',a.display_name);
 for(let i=offset;i<plan.count;i++){
 if(Date.now()>=session.expiresAt)throw Error('Upload session expired');
 const current=await f.stat();if(current.size!==s.size||current.mtimeMs!==s.mtimeMs)throw Error('Video changed during upload');
 const start=i*plan.size,end=i===plan.count-1?s.size:start+plan.size,buf=Buffer.alloc(end-start);const {bytesRead}=await f.read(buf,0,buf.length,start);if(bytesRead!==buf.length)throw Error('Video changed during upload');
 let r:Response;try{r=await fetch(url,{method:'PUT',headers:{'Content-Type':'video/mp4','Content-Length':String(buf.length),'Content-Range':`bytes ${start}-${end-1}/${s.size}`},body:new Uint8Array(buf),redirect:'error',signal:AbortSignal.timeout(180000)});}catch{throw Error('Upload transport failed; check status before resume');}
 if(r.status!==(i===plan.count-1?201:206))throw Error('Upload HTTP '+r.status);await r.body?.cancel();
 await save(ledger,{...entry,state:'initialized',acknowledgedBytes:end});
 }
 await save(ledger,{...entry,state:'uploaded',uploadedAt:new Date().toISOString()});await unlink(secretPath(entry.publish_id));console.log('Upload sent. Check TikTok inbox after processing.');
 }finally{await f.close();}
 }finally{await fd.close();await unlink(lock);}return;}

const {t,a}=await authorized();if(cmd==='list'){let cursor=0;const seen=new Set<number>();do{const d=await api(t,'/v2/video/list/?fields=id,title,create_time,view_count,like_count,comment_count,share_count',{max_count:20,cursor});for(const v of d.videos||[])print(v);if(!d.has_more)break;if(!Number.isFinite(d.cursor)||seen.has(d.cursor))throw Error('Invalid pagination');cursor=d.cursor;seen.add(cursor);}while(true);return;}if(cmd==='status'){const p=resolve(folder!,'tiktok-publication.json'),lock=p+'.lock',fd=await open(lock,'wx');try{const e=await read(p);if(e.open_id!==a.open_id||!e.publish_id)throw Error('No matching publication ID; reconcile manually');const d=await api(t,'/v2/post/publish/status/fetch/',{publish_id:e.publish_id});await save(p,{...e,status:d,lastSyncedAt:new Date().toISOString()});print(d);}finally{await fd.close();await unlink(lock);}return;}const p=(await profile(t)).user;if(p.open_id!==a.open_id)throw Error('Account mismatch');const snapshot={at:new Date().toISOString(),...p};if(cmd==='history')await appendFile(join(root,'history.jsonl'),JSON.stringify(snapshot)+'\n');print(snapshot);}
run(main);
