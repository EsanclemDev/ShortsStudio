import React from "react";
import type { MicroModelProps } from "../MicroTypes";
import { EnergyMolecule } from "./EnergyMolecule";
export const ATP3D: React.FC<MicroModelProps> = ({color="#22c55e",activity=0}) => <EnergyMolecule count={3} coreColor={color} activity={activity}/>;
