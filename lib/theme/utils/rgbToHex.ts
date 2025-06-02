import type { HexColor, RGBColor } from '../types.ts'

/**
 * Convert RGB color to hex number
 * Pure function for color format conversion
 */
export const rgbToHex = (rgb: RGBColor): HexColor => {
  const r = Math.floor(rgb.r * 255)
  const g = Math.floor(rgb.g * 255)
  const b = Math.floor(rgb.b * 255)
  return (r << 16) + (g << 8) + b
}
