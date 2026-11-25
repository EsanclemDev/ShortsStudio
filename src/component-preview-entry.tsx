import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {ComponentPreview} from './engine/components/ComponentPreview';
const sample={schemaVersion:1,id:'preview-sample',version:1,name:'Preview sample',description:'Renderer test',category:'other',dimension:'3d',parts:[{id:'body',geometry:{type:'sphere',radius:1},material:{color:'#b34b45'}},{id:'detail',parentId:'body',position:[0.7,0.3,0],geometry:{type:'sphere',radius:0.45},material:{color:'#e69c63'}}]};
const Root:React.FC=()=> <Composition id="ComponentPreview" component={ComponentPreview} defaultProps={{component:sample}} width={720} height={1280} fps={30} durationInFrames={180}/>;
registerRoot(Root);
