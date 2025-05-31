/**
 * monochrome.ts - Monochrome theme for logo3d
 */

import { createTheme } from '../utils/createTheme.ts'
import { createRGB } from '../utils/createRGB.ts'

/**
 * Monochrome theme with white and gray tones
 */
export const MONOCHROME_THEME = createTheme({
  primary: createRGB(1, 1, 1),
  secondary: createRGB(0.8, 0.8, 0.8),
  accent: createRGB(0.6, 0.6, 0.6),
  background: 0x000000,
})
