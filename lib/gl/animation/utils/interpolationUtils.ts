/**
 * Linear interpolation between two values
 */
export const lerp = (start: number, end: number, factor: number): number => start + (end - start) * factor

/**
 * Smooth interpolation using ease-out cubic function
 */
export const easeOut = (factor: number): number => 1 - Math.pow(1 - factor, 3)

/**
 * Smooth interpolation using ease-in-out cubic function
 */
export const easeInOut = (factor: number): number => factor < 0.5 ? 4 * factor * factor * factor : 1 - Math.pow(-2 * factor + 2, 3) / 2

/**
 * Smoothly interpolates rotation values considering mouse position
 */
export const smoothRotationInterpolation = (
  current: number,
  target: number,
  smoothingFactor: number = 0.05,
): number => current + (target - current) * smoothingFactor
