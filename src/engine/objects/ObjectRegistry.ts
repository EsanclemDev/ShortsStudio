import type { ComponentType } from "react";
import type { ObjectType, SupplementOptions } from "./ObjectTypes";
import { WaterBottle3D } from "./models/WaterBottle3D";
import { WaterGlass3D } from "./models/WaterGlass3D";
import { Apple3D } from "./models/Apple3D";
import { Banana3D } from "./models/Banana3D";
import { Dumbbell3D } from "./models/Dumbbell3D";
import { SugarCube3D } from "./models/SugarCube3D";
import { CreatineJar3D } from "./models/CreatineJar3D";
import { Scoop3D } from "./models/Scoop3D";
import { Shaker3D } from "./models/Shaker3D";
export const OBJECT_REGISTRY: Record<ObjectType, ComponentType<SupplementOptions>> = {
  waterBottle: WaterBottle3D, waterGlass: WaterGlass3D, apple: Apple3D,
  banana: Banana3D, dumbbell: Dumbbell3D, sugarCube: SugarCube3D,
  creatineJar: CreatineJar3D, scoop: Scoop3D, shaker: Shaker3D,
};
