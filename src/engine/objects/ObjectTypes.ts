export type ObjectType = "waterBottle" | "waterGlass" | "apple" | "banana" | "dumbbell" | "sugarCube" | "creatineJar" | "scoop" | "shaker";
export type ObjectAnimation = "static" | "float" | "rotate" | "bounce" | "pulse" | "appear" | "shake" | "open" | "pour";
export type SupplementOptions = { label?: string; fill?: number; open?: number; time?: number };
export type ObjectConfig = {
  type: ObjectType;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  animation?: ObjectAnimation;
  speed?: number;
  startFrame?: number;
  options?: SupplementOptions;
};
