import type { RGBColor } from '../theme.d.ts'

/**
 * Create an RGB color from individual values
 * Pure constructor function for RGB colors
 */
export const createRGB = (r: number, g: number, b: number): RGBColor => ({ r, g, b })
