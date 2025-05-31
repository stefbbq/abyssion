import type { RGBColor } from '../theme.d.ts'

/**
 * Mix two RGB colors by interpolation factor
 * Pure function that blends colors
 */
export const mixRGB = (colorA: RGBColor) => (colorB: RGBColor) => (factor: number): RGBColor => ({
  r: colorA.r + (colorB.r - colorA.r) * factor,
  g: colorA.g + (colorB.g - colorA.g) * factor,
  b: colorA.b + (colorB.b - colorA.b) * factor,
})
