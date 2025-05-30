/**
 * Smoothly interpolates rotation values
 * Pure function - no side effects, returns interpolated value
 */
export const smoothRotationInterpolation = (
  current: number,
  target: number,
  smoothingFactor: number = 0.05,
): number => current + (target - current) * smoothingFactor
