/**
 * Interpolates between two colors in RGB space
 * @param color1 - First color as hex number or string
 * @param color2 - Second color as hex number or string
 * @param t - Interpolation factor (0 = color1, 1 = color2)
 * @returns Interpolated color as hex number
 */
export const interpolateColors = (
  color1: number | string,
  color2: number | string,
  t: number,
): number => {
  // ensure colors are numbers
  const numericColor1 = typeof color1 === 'string' ? parseInt(color1.replace('#', ''), 16) : color1
  const numericColor2 = typeof color2 === 'string' ? parseInt(color2.replace('#', ''), 16) : color2

  // extract RGB components
  const r1 = (numericColor1 >> 16) & 0xff
  const g1 = (numericColor1 >> 8) & 0xff
  const b1 = numericColor1 & 0xff

  const r2 = (numericColor2 >> 16) & 0xff
  const g2 = (numericColor2 >> 8) & 0xff
  const b2 = numericColor2 & 0xff

  // interpolate each channel
  const r = Math.round(r1 + (r2 - r1) * t)
  const g = Math.round(g1 + (g2 - g1) * t)
  const b = Math.round(b1 + (b2 - b1) * t)

  // combine back into hex number
  return (r << 16) | (g << 8) | b
}
