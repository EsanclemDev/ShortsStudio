import {authorized} from '../tools/social/auth';
async function main(){const {api,channel}=await authorized();const r=await api.channels.list({part:['statistics'],id:[channel.id]});const c=r.data.items?.[0];if(!c||c.id!==channel.id)throw Error('Channel mismatch');console.log(JSON.stringify({id:c.id,...c.statistics}));}main().catch(()=>{process.exitCode=1;});
