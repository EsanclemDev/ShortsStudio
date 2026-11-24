export type WorkoutConfig = { reps: number; period?: number; fail?: boolean };
const clamp = (x: number) => Math.max(0, Math.min(1, x));
const ease = (x: number) => { const t = clamp(x); return t*t*(3-2*t); };
export const getWorkoutState = (time: number, config: WorkoutConfig) => {
  const reps = Math.max(1, Math.floor(config.reps));
  const period = Math.max(0.1, config.period ?? 1.8);
  const t = Math.max(0, time);
  const end = reps * period;
  const failureDuration = period * 1.7;
  const finish = end + (config.fail === false ? 0 : failureDuration);
  const count = Math.min(reps, Math.floor(t / period + 1e-9));
  const failed = config.fail !== false && t >= end && t < finish;
  const done = t >= finish;
  const phase = clamp((t-end)/failureDuration);
  const struggle = failed ? ease(phase/.24)*(1-ease((phase-.65)/.25)) : 0;
  const lift = done ? 0 : failed ? .53*struggle : (1-Math.cos(2*Math.PI*(t%period)/period))/2;
  const fatigue = done ? (config.fail === false ? .28 : 1)*(1-ease((t-finish)/4)) : failed ? 1 : .8*ease((t/end-.55)/.45)*(config.fail === false ? .35 : 1);
  return {count,lift,fatigue,failed,done,struggle,phase,success:done && config.fail === false};
};
