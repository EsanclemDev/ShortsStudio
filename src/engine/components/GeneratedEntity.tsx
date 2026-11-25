import React,{useMemo} from 'react';
import {useCurrentFrame,useVideoConfig} from 'remotion';
import {validateComponent} from './ComponentSchema';
import {validateAnimation,sampleAnimation} from './ComponentAnimation';
import {ComponentRenderer} from './ComponentRenderer';
import {entityProps} from '../director/schemas/EntitySchema';
export const GeneratedEntity:React.FC<ReturnType<typeof entityProps.generated.parse>>=p=>{
 const frame=useCurrentFrame(),{fps}=useVideoConfig();
 const model=useMemo(()=>validateComponent(p.component),[p.component]);
 if(model.id!==p.componentId||model.version!==p.version)throw new Error('Generated component identity mismatch');
 const clip=useMemo(()=>p.animationId?validateAnimation(p.animation,model):undefined,[p.animationId,p.animation,model]);
 if(clip&&clip.id!==p.animationId)throw new Error('Generated animation identity mismatch');
 return <group position={p.position} rotation={p.rotation} scale={p.scale??1}><group position={p.normalization?.offset} scale={p.normalization?.scale??1}><ComponentRenderer component={clip?sampleAnimation(model,clip,frame/fps*(p.animationSpeed??1)):model}/></group></group>;
};
