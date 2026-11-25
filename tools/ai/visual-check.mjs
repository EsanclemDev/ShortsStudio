import {readFileSync,writeFileSync,mkdirSync,existsSync,statSync} from 'node:fs';
import {resolve,dirname,join,relative} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const root=fileURLToPath(new URL('../../',import.meta.url));
const require=createRequire(join(root,'package.json'));
function samples(video){
 if(!Number.isFinite(video.fps)||video.fps<=0||!Array.isArray(video.scenes)||!video.scenes.length)throw Error('Invalid video timing');
 return video.scenes.flatMap((s,i)=>{const a=Math.round(s.start*video.fps),b=Math.round(s.end*video.fps);if(!Number.isSafeInteger(a)||!Number.isSafeInteger(b)||a<0||b<=a)throw Error('Invalid scene interval');return [...new Set([.1,.5,.9].map(t=>a+Math.floor((b-a-1)*t)))].map((frame,j)=>({scene:String(s.id),frame,time:frame/video.fps,file:`frames/${String(i+1).padStart(3,'0')}-${j+1}.png`}));});
}
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function html(report){return `<!doctype html><html lang="es"><meta charset="utf-8"><title>Visual QA</title><style>body{background:#101820;color:#eee;font:16px system-ui;margin:24px}section{display:flex;flex-wrap:wrap;gap:16px}figure{margin:0;width:220px}img{width:100%;background:#333}small{color:#aaa}h2{border-top:1px solid #555;padding-top:16px}</style><h1>Visual QA — ${esc(report.title)}</h1><p>${report.frames.filter(f=>f.status==='ok').length}/${report.frames.length} capturas correctas. Revisión manual; no puntuación automática.</p>${[...new Set(report.frames.map(f=>f.scene))].map(s=>`<h2>${esc(s)}</h2><section>${report.frames.filter(f=>f.scene===s).map(f=>`<figure>${f.status==='ok'?`<img src="${esc(f.file)}">`:`<p>${esc(f.error||'Pendiente')}</p>`}<figcaption>${f.time.toFixed(2)} s · frame ${f.frame}</figcaption></figure>`).join('')}</section>`).join('')}</html>`;}
if(process.argv.includes('--self-test')){const v={fps:30,scenes:[{id:'<test>',start:0,end:1},{id:'b',start:1,end:1+1/30}]};const f=samples(v);assert.deepEqual(f.map(x=>x.frame),[2,14,26,30]);assert.ok(html({title:'<script>',frames:f}).includes('&lt;script&gt;'));assert.throws(()=>samples({fps:0,scenes:[]}));console.log('Visual QA smoke test OK');process.exit(0);}
const [input,output]=process.argv.slice(2);if(!input)throw Error('Usage: node tools/ai/visual-check.mjs props.json [output-directory]');
const props=resolve(input),video=JSON.parse(readFileSync(props,'utf8')).video;if(!video)throw Error('Expected props.json with video');
const frames=samples(video);const dir=resolve(output||join(dirname(props),'visual-check'));if(existsSync(dir))throw Error('Output exists; choose another directory');
const pkg=require.resolve('@remotion/cli/package.json');const manifest=JSON.parse(readFileSync(pkg,'utf8'));const bin=typeof manifest.bin==='string'?manifest.bin:manifest.bin.remotion;if(!bin)throw Error('Remotion CLI binary not found');const cli=resolve(dirname(pkg),bin);
mkdirSync(join(dir,'frames'),{recursive:true});const report={title:video.title,source:relative(root,props),fps:video.fps,scale:1/3,frames};
function save(){writeFileSync(join(dir,'visual-report.json'),JSON.stringify(report,null,2));writeFileSync(join(dir,'report.html'),html(report));}save();
for(const [i,f] of frames.entries()){
 console.log(`[${i+1}/${frames.length}] ${f.scene} @ ${f.time.toFixed(2)}s`);
 const target=join(dir,f.file);const r=spawnSync(process.execPath,[cli,'still','src/index.ts','ConfigurableVideo',target,`--props=${props}`,`--frame=${f.frame}`,'--scale=0.3333333333333333'],{cwd:root,encoding:'utf8',timeout:300000,maxBuffer:16*1024*1024});
 f.status=r.status===0&&existsSync(target)&&statSync(target).size>0?'ok':'failed';if(f.status==='failed')f.error=[r.error?.message,r.stderr,r.stdout].filter(Boolean).join('\n').slice(-4000);save();
}
const good=frames.filter(f=>f.status==='ok');if(good.length===frames.length){const cols=5,rows=Math.ceil(good.length/cols);const list=good.map((f,i)=>`${i===0?'':';'}[${i}:v]scale=180:320,setsar=1[v${i}]`).join('');const layout=good.map((_,i)=>`${i%cols*180}_${Math.floor(i/cols)*320}`).join('|');const args=['-y',...good.flatMap(f=>['-i',join(dir,f.file)]),'-filter_complex',`${list};${good.map((_,i)=>`[v${i}]`).join('')}xstack=inputs=${good.length}:layout=${layout}:fill=black[out]`,'-map','[out]','-frames:v','1',join(dir,'contact-sheet.png')];if(good.length===1){args.splice(0,args.length,'-y','-i',join(dir,good[0].file),'-frames:v','1',join(dir,'contact-sheet.png'));}const r=spawnSync('ffmpeg',args,{encoding:'utf8',timeout:120000});report.contactSheet=r.status===0?'contact-sheet.png':null;if(r.status!==0)report.contactSheetError=r.error?.message||r.stderr?.slice(-1000);save();}
console.log(`${good.length}/${frames.length} captures OK. ${join(dir,'report.html')}`);process.exitCode=good.length===frames.length?0:1;
