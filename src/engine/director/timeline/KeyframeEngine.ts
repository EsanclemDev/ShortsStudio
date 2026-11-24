import type {Track,KeyframeValue} from '../VideoTypes';
export function sampleTrack(track:Track,time:number):KeyframeValue {
 const keys=track.keyframes; if(time<=keys[0].time)return keys[0].value;
 for(let i=1;i<keys.length;i++){const a=keys[i-1],b=keys[i];if(time===b.time)return b.value;if(time>b.time)continue;let p=(time-a.time)/(b.time-a.time);switch(b.easing){case 'step':return a.value;case 'easeIn':p*=p;break;case 'easeOut':p=1-(1-p)**2;break;case 'easeInOut':p=p*p*(3-2*p);}
 const x=a.value,y=b.value; if(typeof x==='number'&&typeof y==='number')return x+(y-x)*p;
 if(Array.isArray(x)&&Array.isArray(y))return x.map((v,j)=>v+(y[j]-v)*p) as [number,number,number];
 if(typeof x==='string'&&typeof y==='string'&&/^#[0-9a-f]{6}$/i.test(x)&&/^#[0-9a-f]{6}$/i.test(y))return '#'+[1,3,5].map(j=>Math.round(parseInt(x.slice(j,j+2),16)+(parseInt(y.slice(j,j+2),16)-parseInt(x.slice(j,j+2),16))*p).toString(16).padStart(2,'0')).join('');return x;
 }return keys[keys.length-1].value;
}
