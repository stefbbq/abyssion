/**
 * Convert a number to a hex string

* @returns The hex string
 */
export const numberToHexString = (num: number): string => `#${num.toString(16).padStart(6, '0')}`
