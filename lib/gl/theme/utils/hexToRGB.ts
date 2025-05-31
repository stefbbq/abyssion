import type { HexColor, RGBColor } from '../theme.d.ts'

/**
 * Convert hex color to RGB object
 * Pure function for reverse color conversion
 */
export const hexToRGB = (hex: HexColor): RGBColor => {
  const r = ((hex >> 16) & 255) / 255
  const g = ((hex >> 8) & 255) / 255
  const b = (hex & 255) / 255
  return { r, g, b }
}
