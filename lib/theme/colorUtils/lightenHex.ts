import type { HexColor } from '../index.types.ts'

/**
 * Lighten a hex color by interpolation toward white
 * Pure function that returns a new lightened color
 */
export const lightenHex = (hex: HexColor, factor: number): HexColor => {
  const r = Math.round(((hex >> 16) & 255) + (255 - ((hex >> 16) & 255)) * factor)
  const g = Math.round(((hex >> 8) & 255) + (255 - ((hex >> 8) & 255)) * factor)
  const b = Math.round((hex & 255) + (255 - (hex & 255)) * factor)
  return (r << 16) + (g << 8) + b
}
