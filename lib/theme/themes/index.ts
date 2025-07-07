/**
 * @module themes
 * @description Comprehensive theme definitions for both Preact and GL usage
 */

import type { ThemeFamily } from '../index.types.ts'
// import { neonGridOSDarkTheme, neonGridOSLightTheme } from './neonGridOS.ts'
import { neonGridOSDarkTheme } from './neonGridOS/dark.ts'
import { neonGridOSLightTheme } from './neonGridOS/light.ts'
// import { deepSpaceHUDLightTheme, deepSpaceHUDTheme } from './deepSpaceHUD.ts'
// import { geomodAtlasLightTheme, geomodAtlasTheme } from './geomodAtlas.ts'
// import { techscapeLightTheme, techscapeTheme } from './techscape.ts'
// import { synthwaveLightTheme, synthwaveTheme } from './synthwave.ts'
// import { monochromeLightTheme, monochromeTheme } from './monochrome.ts'

/**
 * All available theme families in order
 */
export const themeFamilies: ThemeFamily[] = [
  // {
  //   name: 'deep-space-hud',
  //   light: deepSpaceHUDLightTheme,
  //   dark: deepSpaceHUDTheme,
  // },
  {
    name: 'Neon Grid OS',
    light: neonGridOSLightTheme,
    dark: neonGridOSDarkTheme,
  },
  // {
  //   name: 'geomod-atlas',
  //   light: geomodAtlasLightTheme,
  //   dark: geomodAtlasTheme,
  // },
  // {
  //   name: 'techscape',
  //   light: techscapeLightTheme,
  //   dark: techscapeTheme,
  // },
  // {
  //   name: 'synthwave',
  //   light: synthwaveLightTheme,
  //   dark: synthwaveTheme,
  // },
  // {
  //   name: 'monochrome',
  //   light: monochromeLightTheme,
  //   dark: monochromeTheme,
  // },
]
