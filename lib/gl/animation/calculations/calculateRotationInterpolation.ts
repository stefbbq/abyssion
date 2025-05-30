/**
 * Smoothly interpolate current rotation toward target rotation
 */
export const calculateRotationInterpolation = (
  currentRotation: number,
  targetRotation: number,
  smoothingFactor: number = 0.05,
): number => currentRotation + (targetRotation - currentRotation) * smoothingFactor
