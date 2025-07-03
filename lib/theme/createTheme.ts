import type { BaseTheme } from './themes/types.ts'
import type { UITheme } from './types.ts'
import { createUITheme } from './createUITheme.ts'
import { createLegacyUITheme } from './createLegacyUITheme.ts'

/**
 * Main theme creation dispatcher
 * Automatically detects theme structure and calls appropriate creation function
 *
 * For new semantic themes (with palette and colorRoles), uses createUITheme
 * For legacy themes (with individual color properties), uses createLegacyUITheme
 */
export const createTheme = (baseTheme: BaseTheme): UITheme => {
  // Check if this is a new semantic theme or legacy theme
  if (baseTheme.palette && baseTheme.colorRoles) {
    // New semantic theme structure
    return createUITheme(baseTheme)
  } else {
    // Legacy theme structure
    return createLegacyUITheme(baseTheme)
  }
}
