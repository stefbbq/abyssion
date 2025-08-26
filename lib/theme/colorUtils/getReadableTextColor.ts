import { hexStringToRGB } from './hexStringToRGB.ts'

/**
 * returns '#000000' or '#ffffff' based on WCAG relative luminance
 * uses sRGB to linear conversion and Y = 0.2126 R + 0.7152 G + 0.0722 B
 */
export const getReadableTextColor = (backgroundHex: string, light = '#ffffff', dark = '#000000') => {
  const { r, g, b } = hexStringToRGB(backgroundHex)

  const toLinear = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4))
  const R = toLinear(r)
  const G = toLinear(g)
  const B = toLinear(b)
  const luminance = 0.2126 * R + 0.7152 * G + 0.0722 * B

  // pick dark text on light backgrounds and light text on dark backgrounds
  return luminance > 0.5 ? dark : light
}
