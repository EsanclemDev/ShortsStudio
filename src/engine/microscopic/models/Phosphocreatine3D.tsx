import React from "react";
import type { MicroModelProps } from "../MicroTypes";
import { EnergyMolecule } from "./EnergyMolecule";
export const Phosphocreatine3D: React.FC<MicroModelProps> = ({color="#a78bfa",activity=0}) => <EnergyMolecule count={1} coreColor={color} activity={activity}/>;
