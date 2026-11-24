import React from "react";
import type { MicroModelProps } from "../MicroTypes";
import { EnergyMolecule } from "./EnergyMolecule";
export const ADP3D: React.FC<MicroModelProps> = ({color="#38bdf8",activity=0}) => <EnergyMolecule count={2} coreColor={color} activity={activity}/>;
