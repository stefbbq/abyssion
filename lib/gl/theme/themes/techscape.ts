/**
 * techscape.ts - Techscape theme for logo3d
 */

import { createTheme } from '../utils/createTheme.ts'
import { createRGB } from '../utils/createRGB.ts'

/**
 * Techscape theme with teal and green topographic highlights
 */
export const TECHSCAPE_THEME = createTheme({
  primary: createRGB(1, 1, 1),
  secondary: createRGB(0, 0.8, 0.8),
  accent: createRGB(0.4, 0.9, 0.5),
  background: 0x151515,
})
