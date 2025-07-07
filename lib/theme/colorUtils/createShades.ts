import type { Shades } from '../index.types.ts'
import { lightenHex } from './lightenHex.ts'
import { darkenHex } from './darkenHex.ts'

/**
 * Generates a palette with shades from a single root color
 *
 * @returns an object with keys 50, 100, ..., 900 (and optionally 0, 950, 1000)
 */
export const createShades = (base: number): Shades => ({
  50: lightenHex(base, 0.25),
  100: lightenHex(base, 0.2),
  200: lightenHex(base, 0.15),
  300: lightenHex(base, 0.1),
  400: lightenHex(base, 0.05),
  500: base,
  neutral: base,
  600: darkenHex(base)(0.9),
  700: darkenHex(base)(0.8),
  800: darkenHex(base)(0.7),
  900: darkenHex(base)(0.6),
  950: darkenHex(base)(0.5),
  1000: darkenHex(base)(0.3),
})
