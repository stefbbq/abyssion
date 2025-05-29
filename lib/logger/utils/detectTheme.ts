/**
 * Detects if the user is in dark mode preference
 *
 * @example
 * const isDark = detectDarkMode() // true if dark mode
 */
export const detectDarkMode = (): boolean => {
  if (typeof window === 'undefined') return true // Default to dark for SSR

  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
}
