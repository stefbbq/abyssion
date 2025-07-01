/**
 * Convert CSS hex string to CSS rgb string (e.g. "255,255,255")
 */
export const hexStringToCSSRGB = (hex: string): string => {
  const clean = hex.replace('#', '')
  const num = parseInt(clean, 16)
  const r = (num >> 16) & 255
  const g = (num >> 8) & 255
  const b = num & 255
  return `${r},${g},${b}`
}
