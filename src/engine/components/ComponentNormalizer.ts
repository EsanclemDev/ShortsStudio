import {componentBounds,animationBounds,type SpatialBounds} from './SpatialBounds';
import {validateComponent} from './ComponentSchema';
import {validateAnimation} from './ComponentAnimation';
export function normalizationTransform(bounds:SpatialBounds,targetSize=2,anchor:'center'|'ground'='center'){
 if(!Number.isFinite(targetSize)||targetSize<=0)throw new Error('Invalid target size');const scale=targetSize/bounds.maxDimension;if(!Number.isFinite(scale)||scale<=0)throw new Error('Invalid normalization scale');const pivot=anchor==='ground'?bounds.ground:bounds.center;return {scale,offset:pivot.map(v=>-v*scale) as [number,number,number],anchor};
}
export function inspectComponent(raw:unknown,animation?:unknown,targetSize=2){const component=validateComponent(raw);const rest=componentBounds(component);const motion=animation===undefined?undefined:animationBounds(component,validateAnimation(animation,component));const bounds=motion??rest;const warnings:string[]=[];if(bounds.maxDimension>100)warnings.push('Large source dimensions');if(bounds.maxDimension<0.01)warnings.push('Small source dimensions');if(Math.min(...bounds.size)/bounds.maxDimension<0.001)warnings.push('Nearly planar bounds');return {id:component.id,version:component.version,rest,motion,centered:normalizationTransform(bounds,targetSize),grounded:normalizationTransform(bounds,targetSize,'ground'),warnings};}
