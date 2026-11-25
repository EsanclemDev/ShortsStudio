import {mkdir,readFile,writeFile,readdir} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {validateComponent,type Component3D} from './ComponentSchema';
import {validateAnimation,type ComponentAnimation} from './ComponentAnimation';
const safeId=(id:string)=>{if(!/^[a-z][a-z0-9-]{0,63}$/.test(id))throw new Error('Invalid registry ID');return id;};
const safeVersion=(v:number)=>{if(!Number.isSafeInteger(v)||v<1)throw new Error('Invalid version');return String(v);};
export async function readRegistryJson(file:string):Promise<unknown>{const b=await readFile(file);if(b.length>4*1024*1024)throw new Error('JSON exceeds 4 MiB');return JSON.parse(b.toString('utf8'));}
async function immutableWrite(file:string,data:unknown){const json=JSON.stringify(data,null,2)+'\n';try{await writeFile(file,json,{flag:'wx'});}catch(e){if((e as NodeJS.ErrnoException).code!=='EEXIST')throw e;if(JSON.stringify(await readRegistryJson(file))!==JSON.stringify(data))throw new Error('Registry version conflict: '+file);}}
export class ComponentRegistry {
 readonly root:string;
 constructor(root='assets/components'){this.root=resolve(root);}
 private folder(id:string,version:number){return join(this.root,safeId(id),safeVersion(version));}
 async registerComponent(raw:unknown):Promise<Component3D>{const c=validateComponent(raw);const dir=this.folder(c.id,c.version);await mkdir(dir,{recursive:true});await immutableWrite(join(dir,'component.json'),c);return c;}
 async getComponent(id:string,version:number):Promise<Component3D>{const c=validateComponent(await readRegistryJson(join(this.folder(id,version),'component.json')));if(c.id!==id||c.version!==version)throw new Error('Registry identity mismatch');return c;}
 async registerAnimation(raw:unknown,id:string,version:number):Promise<ComponentAnimation>{const c=await this.getComponent(id,version);const a=validateAnimation(raw,c);const dir=join(this.folder(id,version),'animations');await mkdir(dir,{recursive:true});await immutableWrite(join(dir,safeId(a.id)+'.json'),a);return a;}
 async getAnimation(id:string,version:number,animationId:string):Promise<ComponentAnimation>{const c=await this.getComponent(id,version);const a=validateAnimation(await readRegistryJson(join(this.folder(id,version),'animations',safeId(animationId)+'.json')),c);if(a.id!==animationId)throw new Error('Animation identity mismatch');return a;}
 async list(){const result:{id:string;version:number;name:string;category:string;animations:string[]}[]=[];await mkdir(this.root,{recursive:true});for(const d of await readdir(this.root,{withFileTypes:true})){if(!d.isDirectory()||!/^[a-z][a-z0-9-]{0,63}$/.test(d.name))continue;for(const v of await readdir(join(this.root,d.name),{withFileTypes:true})){if(!v.isDirectory()||!/^[1-9][0-9]*$/.test(v.name))continue;const version=Number(v.name);const c=await this.getComponent(d.name,version);let files:string[]=[];try{files=await readdir(join(this.folder(c.id,version),'animations'));}catch(e){if((e as NodeJS.ErrnoException).code!=='ENOENT')throw e;}const animations:string[]=[];for(const f of files.filter(f=>/^[a-z][a-z0-9-]{0,63}\.json$/.test(f)).sort()){const a=await this.getAnimation(c.id,version,f.slice(0,-5));animations.push(a.id);}result.push({id:c.id,version,name:c.name,category:c.category,animations});}}return result.sort((a,b)=>a.id.localeCompare(b.id)||a.version-b.version);}
}
