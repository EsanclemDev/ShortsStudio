export type MicroType = "cell" | "redBloodCell" | "waterMolecule" | "sodiumIon" | "bacteria" | "virus" | "muscleFiber" | "atp" | "adp" | "phosphocreatine";
export type MicroAnimation = "static" | "float" | "rotate" | "pulse" | "swelling" | "shrink" | "division" | "vibrate" | "appear";
export type MicroModelProps = { color?: string; activity?: number };
export type MicroConfig = { type: MicroType; position?: [number,number,number]; rotation?: [number,number,number]; scale?: number; animation?: MicroAnimation; speed?: number; intensity?: number; duration?: number; color?: string; startFrame?: number };
