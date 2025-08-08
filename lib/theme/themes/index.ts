/**
 * @module themes
 * @description Comprehensive theme definitions for both Preact and GL usage
 */

import type { ThemeFamily } from '../index.types.ts'
import { neonGridOSDarkTheme } from './neonGridOS/dark.ts'
import { neonGridOSLightTheme } from './neonGridOS/light.ts'
import { deepSpaceHUDDarkTheme } from './deepSpaceHUD/dark.ts'
import { deepSpaceHUDLightTheme } from './deepSpaceHUD/light.ts'
import { geomodAtlasDarkTheme } from './geomodAtlas/dark.ts'
import { geomodAtlasLightTheme } from './geomodAtlas/light.ts'
import { techscapeDarkTheme } from './techscape/dark.ts'
import { techscapeLightTheme } from './techscape/light.ts'
import { synthwaveDarkTheme } from './synthwave/dark.ts'
import { synthwaveLightTheme } from './synthwave/light.ts'
import { monochromeDarkTheme } from './monochrome/dark.ts'
import { monochromeLightTheme } from './monochrome/light.ts'

/**
 * All available theme families in order
 */
export const themeFamilies: ThemeFamily[] = [
  {
    name: 'Neon Grid OS',
    light: neonGridOSLightTheme,
    dark: neonGridOSDarkTheme,
  },
  {
    name: 'Deep Space HUD',
    light: deepSpaceHUDLightTheme,
    dark: deepSpaceHUDDarkTheme,
  },
  {
    name: 'GeoMod Atlas',
    light: geomodAtlasLightTheme,
    dark: geomodAtlasDarkTheme,
  },
  {
    name: 'Techscape',
    light: techscapeLightTheme,
    dark: techscapeDarkTheme,
  },
  {
    name: 'Synthwave',
    light: synthwaveLightTheme,
    dark: synthwaveDarkTheme,
  },
  {
    name: 'Monochrome',
    light: monochromeLightTheme,
    dark: monochromeDarkTheme,
  },
]
