import type { HexColor } from '../types.ts'

/**
 * Convert CSS hex string to hex number
 */
export const hexStringToNumber = (hex: string): HexColor => {
  const clean = hex.replace('#', '')
  return parseInt(clean, 16)
}
