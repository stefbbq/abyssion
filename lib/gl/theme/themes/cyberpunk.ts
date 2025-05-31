/**
 * cyberpunk.ts - Cyberpunk theme for logo3d
 */

import { createTheme } from '../utils/createTheme.ts'
import { createRGB } from '../utils/createRGB.ts'

/**
 * Default cyberpunk theme colors
 */
export const CYBERPUNK_THEME = createTheme({
  primary: createRGB(1, 1, 1),
  secondary: createRGB(0.53, 1, 1),
  accent: createRGB(1, 0.53, 1),
  background: 0x000000,
})
