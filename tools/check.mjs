import {spawnSync} from 'node:child_process';
import {existsSync,mkdirSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const args=process.argv.slice(2);
if(args.some(a=>a!=='--fail-fast')) {console.error('Usage: node tools/check.mjs [--fail-fast]');process.exit(2);}
const tests=['smoke','provider-smoke','script-smoke','director-smoke','repair-smoke','normalizer-smoke','quality-smoke','track-normalizer-smoke','quality-regression-smoke','scene-repair-smoke','component-contract-smoke','component-builder-smoke','component-geometry-smoke','component-animation-smoke','component-registry-smoke','component-spatial-smoke','scene-composition-smoke','deterministic-repair-smoke'];
const steps=[{name:'TypeScript',args:['tsc','--noEmit']},...tests.map(t=>({name:t,file:`tools/ai/${t}.ts`,args:['--yes','tsx',`tools/ai/${t}.ts`]}))];
steps.push({name:'visual-qa-smoke',file:'tools/ai/visual-check.mjs',args:['tools/ai/visual-check.mjs','--self-test'],native:true});
steps.push({name:'multimodal-review-smoke',file:'tools/ai/visual-review.mjs',args:['tools/ai/visual-review.mjs','--self-test'],native:true});
steps.push({name:"creative-context-smoke",file:"tools/ai/creative-context.mjs",args:["tools/ai/creative-context.mjs","--self-test"],native:true});
steps.push({name:'creative-intelligence-smoke',file:'tools/ai/creative-intelligence-smoke.ts',args:['--yes','tsx','tools/ai/creative-intelligence-smoke.ts']});
steps.push({name:'visual-beat-compiler-smoke',file:'tools/ai/visual-beat-compiler-smoke.ts',args:['--yes','tsx','tools/ai/visual-beat-compiler-smoke.ts']});
steps.push({name:'repair-retry-smoke',file:'tools/ai/repair-retry-smoke.mjs',args:['tools/ai/repair-retry-smoke.mjs'],native:true});
steps.push({name:'social-schema-smoke',file:'tools/social/social-smoke.ts',args:['--yes','tsx','tools/social/social-smoke.ts']});
steps.push({name:'social-management-smoke',file:'tools/social/management-smoke.ts',args:['--yes','tsx','tools/social/management-smoke.ts']});
const results=[];const started=Date.now();
for(const [i,s] of steps.entries()){
 console.log(`\n[${i+1}/${steps.length}] ${s.name}`);
 const start=Date.now();let status='passed',output='',exitCode=0;
 if(s.file&&!existsSync(resolve(root,s.file))){status='failed';output=`Missing file: ${s.file}`;exitCode=1;}
 else {const win=process.platform==='win32';const r=spawnSync(s.native?process.execPath:win?'cmd.exe':'npx',s.native?s.args:win?['/d','/s','/c','npx '+s.args.join(' ')]:s.args,{cwd:root,encoding:'utf8',shell:false,timeout:180000,maxBuffer:8*1024*1024});output=[r.stdout,r.stderr,r.error?.message].filter(Boolean).join('\n');exitCode=r.status??1;if(exitCode!==0||r.error)status='failed';}
 console.log(output.trim());console.log(`${status.toUpperCase()} (${((Date.now()-start)/1000).toFixed(1)}s)`);
 results.push({name:s.name,status,exitCode,durationMs:Date.now()-start,output});
 if(status==='failed'&&args.includes('--fail-fast'))break;
}
for(const s of steps.slice(results.length))results.push({name:s.name,status:'not-run'});
const passed=results.filter(r=>r.status==='passed').length;const failed=results.filter(r=>r.status==='failed').length;
const report={date:new Date().toISOString(),durationMs:Date.now()-started,total:steps.length,passed,failed,results};
const dir=resolve(root,'out/checks');mkdirSync(dir,{recursive:true});writeFileSync(resolve(dir,'latest.json'),JSON.stringify(report,null,2));
console.log(`\n${passed}/${steps.length} passed; ${failed} failed. Report: out/checks/latest.json`);process.exitCode=failed?1:0;
