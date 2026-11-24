import React from 'react';
import {Sequence} from 'remotion';
import {ENTITY_REGISTRY} from '../registry/EntityRegistry';
import {toFrame, resolveFrame} from '../timeline/TimelineEngine';
import {ContactShadow} from '../../lighting/ContactShadow';
type ResolvedEntity = ReturnType<typeof resolveFrame>['entities'][number];
export const EntityRenderer: React.FC<{entity:ResolvedEntity;fps:number;sceneDuration:number}> = ({entity,fps,sceneDuration}) => {
  const start=toFrame(entity.start??0,fps);
  const end=entity.end===undefined?sceneDuration:toFrame(entity.end,fps);
  const entry=ENTITY_REGISTRY[entity.type];
  const position=entity.props.position as [number,number,number]|undefined;
  return <Sequence from={start} durationInFrames={end-start} layout="none">
    {entry.render(entity.props)}
    {entity.type==='character' && <ContactShadow position={[position?.[0]??0,(position?.[1]??0)+.015,position?.[2]??0]} size={Number(entity.props.size??4)*.55} opacity={.6}/>}
  </Sequence>;
};
