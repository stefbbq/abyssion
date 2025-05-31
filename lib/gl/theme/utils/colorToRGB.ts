import type { RGBColor } from '../theme.d.ts'
import type { Color } from 'three'

/**
 * Convert THREE.js Color to RGB object
 * Pure function for three.js integration
 */
export const colorToRGB = (color: Color): RGBColor => ({
  r: color.r,
  g: color.g,
  b: color.b,
})
