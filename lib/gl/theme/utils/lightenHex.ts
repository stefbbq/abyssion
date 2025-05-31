import type { HexColor } from '../theme.d.ts'

/**
 * Lighten a hex color by interpolation factor
 * Pure function that returns a new lightened color
 */
export const lightenHex = (hex: HexColor) => (factor: number): HexColor => {
  const r = Math.min(255, Math.floor(((hex >> 16) & 255) + (255 - ((hex >> 16) & 255)) * factor))
  const g = Math.min(255, Math.floor(((hex >> 8) & 255) + (255 - ((hex >> 8) & 255)) * factor))
  const b = Math.min(255, Math.floor((hex & 255) + (255 - (hex & 255)) * factor))
  return (r << 16) + (g << 8) + b
}
