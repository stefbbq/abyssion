/**
 * Convert hex number to CSS hex string
 */
export const hexToCSS = (hex: number) => `#${hex.toString(16).padStart(6, '0')}`
