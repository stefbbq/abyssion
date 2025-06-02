import type { RGBColor } from '../types.ts'

/**
 * Create normalized RGB color object from 0-1 values
 */
export const createRGB = (r: number, g: number, b: number): RGBColor => ({
  r: Math.max(0, Math.min(1, r)),
  g: Math.max(0, Math.min(1, g)),
  b: Math.max(0, Math.min(1, b)),
})
