import type { RGBColor } from '../types.ts'

/**
 * Convert CSS hex string to normalized RGB color object
 */
export const hexStringToRGB = (hex: string): RGBColor => {
  const clean = hex.replace('#', '')
  const num = parseInt(clean, 16)

  return {
    r: ((num >> 16) & 255) / 255,
    g: ((num >> 8) & 255) / 255,
    b: (num & 255) / 255,
  }
}
