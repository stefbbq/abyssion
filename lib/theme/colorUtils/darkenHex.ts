import type { HexColor } from '../types.ts'

/**
 * Darken a hex color by multiplication factor
 * Pure function that returns a new darkened color
 */
export const darkenHex = (hex: HexColor) => (factor: number): HexColor => {
  const r = Math.floor(((hex >> 16) & 255) * factor)
  const g = Math.floor(((hex >> 8) & 255) * factor)
  const b = Math.floor((hex & 255) * factor)
  return (r << 16) + (g << 8) + b
}
