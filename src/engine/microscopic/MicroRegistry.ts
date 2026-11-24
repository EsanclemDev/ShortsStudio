import type { ComponentType } from "react";
import type { MicroType, MicroModelProps } from "./MicroTypes";
import { Cell3D } from "./models/Cell3D";
import { RedBloodCell3D } from "./models/RedBloodCell3D";
import { WaterMolecule3D } from "./models/WaterMolecule3D";
import { SodiumIon3D } from "./models/SodiumIon3D";
import { Bacteria3D } from "./models/Bacteria3D";
import { Virus3D } from "./models/Virus3D";
import { MuscleFiber3D } from "./models/MuscleFiber3D";
import { ATP3D } from "./models/ATP3D";
import { ADP3D } from "./models/ADP3D";
import { Phosphocreatine3D } from "./models/Phosphocreatine3D";
export const MICRO_REGISTRY: Record<MicroType, ComponentType<MicroModelProps>> = {
  cell: Cell3D,
  redBloodCell: RedBloodCell3D,
  waterMolecule: WaterMolecule3D,
  sodiumIon: SodiumIon3D,
  bacteria: Bacteria3D,
  virus: Virus3D,
  muscleFiber: MuscleFiber3D,
  atp: ATP3D,
  adp: ADP3D,
  phosphocreatine: Phosphocreatine3D,
};
