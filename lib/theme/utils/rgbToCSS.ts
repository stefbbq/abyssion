/**
 * Convert RGB color to CSS rgba string
 */
export const rgbToCSS = (rgb: { r: number; g: number; b: number }, alpha = 1) =>
  `rgba(${Math.round(rgb.r * 255)}, ${Math.round(rgb.g * 255)}, ${Math.round(rgb.b * 255)}, ${alpha})`
