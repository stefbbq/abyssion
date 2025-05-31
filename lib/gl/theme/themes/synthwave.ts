/**
 * synthwave.ts - Synthwave theme for logo3d
 */

import { createTheme } from '../utils/createTheme.ts'
import { createRGB } from '../utils/createRGB.ts'

/**
 * Synthwave theme with purple and pink dominant colors
 */
export const SYNTHWAVE_THEME = createTheme({
  primary: createRGB(1, 1, 1),
  secondary: createRGB(0.8, 0.3, 1),
  accent: createRGB(1, 0.2, 0.6),
  background: 0x000011,
})
