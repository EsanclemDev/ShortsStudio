export type OrganType =
  | "brain"
  | "heart"
  | "lungs"
  | "stomach"
  | "kidneys"
  | "intestines";

export type OrganAnimation =
  | "static"
  | "float"
  | "rotate"
  | "heartbeat"
  | "breathing"
  | "swelling"
  | "contract"
  | "appear"
  | "warning";

export type OrganModelProps = {
  color?: string;
  activity?: number;
};

export type AnatomyConfig = {
  type: OrganType;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  animation?: OrganAnimation;
  speed?: number;
  intensity?: number;
  duration?: number;
  color?: string;
  startFrame?: number;
};