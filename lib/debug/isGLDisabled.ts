import { loadDebugSettings } from './loadDebugSettings.ts'

/**
 * Check if GL is disabled via debug settings
 * Loads from localStorage debug settings
 *
 * @returns true if GL should be disabled
 */
export const isGLDisabled = (): boolean => {
  if (typeof window === 'undefined') return false

  const settings = loadDebugSettings()
  return settings?.isGLDisabled ?? false
}
