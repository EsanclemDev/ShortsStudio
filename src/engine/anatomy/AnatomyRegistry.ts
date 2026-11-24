import type { ComponentType } from "react";

import type {
  OrganType,
  OrganModelProps,
} from "./AnatomyTypes";

import { Brain3D } from "./models/Brain3D";
import { Heart3D } from "./models/Heart3D";
import { Lungs3D } from "./models/Lungs3D";
import { Stomach3D } from "./models/Stomach3D";
import { Kidneys3D } from "./models/Kidneys3D";
import { Intestines3D } from "./models/Intestines3D";

export const ANATOMY_REGISTRY: Record<
  OrganType,
  ComponentType<OrganModelProps>
> = {
  brain: Brain3D,
  heart: Heart3D,
  lungs: Lungs3D,
  stomach: Stomach3D,
  kidneys: Kidneys3D,
  intestines: Intestines3D,
};