export type Point2D = {
  x: number;
  y: number;
};

export type ArmAngles = {
  armAngle: number;
  elbowAngle: number;
};

const toRadians = (degrees: number) =>
  degrees * Math.PI / 180;

const toDegrees = (radians: number) =>
  radians * 180 / Math.PI;

export const rotatePoint = (
  point: Point2D,
  angle: number,
): Point2D => {
  const radians = toRadians(angle);

  return {
    x:
      point.x * Math.cos(radians) -
      point.y * Math.sin(radians),
    y:
      point.x * Math.sin(radians) +
      point.y * Math.cos(radians),
  };
};

export const solveArmIK = (
  shoulder: Point2D,
  target: Point2D,
  upperArm: Point2D,
  forearm: Point2D,
  bendDirection: 1 | -1 = -1,
): ArmAngles => {
  const length1 = Math.hypot(
    upperArm.x,
    upperArm.y,
  );

  const length2 = Math.hypot(
    forearm.x,
    forearm.y,
  );

  const dx = target.x - shoulder.x;
  const dy = target.y - shoulder.y;

  const distance = Math.max(
    Math.abs(length1 - length2) + 0.001,
    Math.min(
      Math.hypot(dx, dy),
      length1 + length2 - 0.001,
    ),
  );

  const cosElbow =
    (
      distance * distance -
      length1 * length1 -
      length2 * length2
    ) /
    (2 * length1 * length2);

  const elbow =
    bendDirection *
    Math.acos(
      Math.max(-1, Math.min(1, cosElbow)),
    );

  const shoulderAngle =
    Math.atan2(dy, dx) -
    Math.atan2(
      length2 * Math.sin(elbow),
      length1 + length2 * Math.cos(elbow),
    );

  const upperRestAngle = Math.atan2(
    upperArm.y,
    upperArm.x,
  );

  const forearmRestAngle = Math.atan2(
    forearm.y,
    forearm.x,
  );

  return {
    armAngle: toDegrees(
      shoulderAngle - upperRestAngle,
    ),
    elbowAngle: toDegrees(
      elbow + upperRestAngle - forearmRestAngle,
    ),
  };
};