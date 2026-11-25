import React from "react";
import {GeneratedEntity} from "../../components/GeneratedEntity";
import type {EntityConfig} from "../VideoTypes";
import {entityProps} from "../schemas/EntitySchema";
import {Character3D} from "../../characters/Character3D";
import {Object3D} from "../../objects/Object3D";
import {AnatomyOrgan} from "../../anatomy/AnatomyOrgan";
import {MicroObject} from "../../microscopic/MicroObject";
import {ParticleSystem} from "../../particles/ParticleSystem";
import {LiquidVolume} from "../../liquids/LiquidVolume";
import {LiquidStream} from "../../liquids/LiquidStream";
import {MuscleEnergyScene} from "../../microscopic/MuscleEnergyScene";
import {OsmosisScene} from "../../microscopic/OsmosisScene";
import {GlowEffect} from "../../effects/world/GlowEffect";
import {ShockwaveEffect} from "../../effects/world/ShockwaveEffect";
import {Arrow3D} from "../../effects/world/Arrow3D";
import {AnatomyLabel} from "../../effects/world/AnatomyLabel";
import {RepCounter} from "../../effects/screen/RepCounter";
import {EnergyMeter} from "../../effects/screen/EnergyMeter";
import {ProgressComparison} from "../../effects/screen/ProgressComparison";
import {ScreenEffect} from "../../effects/screen/ScreenEffect";
import {AnimatedMeter} from "../../effects/screen/AnimatedMeter";
type Entry = {layer: "world" | "screen"; render: (props: Record<string, unknown>) => React.ReactNode};
function entry<P extends object>(layer: Entry["layer"], Component: React.ComponentType<P>, parse: (input: unknown) => P): Entry {
  return {layer, render: props => React.createElement(Component, parse(props))};
}
const TextOverlay: React.FC<{text:string;color?:string;fontSize?:number}> = ({text,color="white",fontSize=72}) => <div style={{width:"100%",textAlign:"center",fontFamily:"Arial",fontWeight:900,fontSize,color,whiteSpace:"pre-line",textShadow:"0 4px 10px black"}}>{text}</div>;
const Primitive:React.FC<ReturnType<typeof entityProps.primitive.parse>>=({shape,position,rotation,dimensions=[1,1,1],radius=.2,color='#ffffff'})=><mesh position={position} rotation={rotation}>{shape==='box'?<boxGeometry args={dimensions}/>:<sphereGeometry args={[radius,20,16]}/>}<meshStandardMaterial color={color}/></mesh>;
export const ENTITY_REGISTRY: Record<EntityConfig["type"], Entry> = {
  generated: entry("world", GeneratedEntity, input => entityProps.generated.parse(input)),
  primitive: entry("world", Primitive, input => entityProps.primitive.parse(input)),
  character: entry("world", Character3D, input => entityProps.character.parse(input)),
  object: entry("world", Object3D, input => entityProps.object.parse(input)),
  anatomy: entry("world", AnatomyOrgan, input => entityProps.anatomy.parse(input)),
  micro: entry("world", MicroObject, input => entityProps.micro.parse(input)),
  particles: entry("world", ParticleSystem, input => entityProps.particles.parse(input)),
  liquid: entry("world", LiquidVolume, input => entityProps.liquid.parse(input)),
  liquidStream: entry("world", LiquidStream, input => entityProps.liquidStream.parse(input)),
  muscleEnergy: entry("world", MuscleEnergyScene, input => entityProps.muscleEnergy.parse(input)),
  osmosis: entry("world", OsmosisScene, input => entityProps.osmosis.parse(input)),
  glow: entry("world", GlowEffect, input => entityProps.glow.parse(input)),
  shockwave: entry("world", ShockwaveEffect, input => entityProps.shockwave.parse(input)),
  arrow: entry("world", Arrow3D, input => entityProps.arrow.parse(input)),
  label: entry("world", AnatomyLabel, input => entityProps.label.parse(input)),
  repCounter: entry("screen", RepCounter, input => entityProps.repCounter.parse(input)),
  energyMeter: entry("screen", EnergyMeter, input => entityProps.energyMeter.parse(input)),
  progressComparison: entry("screen", ProgressComparison, input => entityProps.progressComparison.parse(input)),
  screenEffect: entry("screen", ScreenEffect, input => entityProps.screenEffect.parse(input)),
  meter: entry("screen", AnimatedMeter, input => entityProps.meter.parse(input)),
  text: entry("screen", TextOverlay, input => entityProps.text.parse(input)),
};
