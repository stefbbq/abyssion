import type { Logo3DTheme } from '../theme.d.ts'

/**
 * Creates a theme selector function for specific theme properties
 * Higher-order function for extracting theme values
 */
export const selectFromTheme = <K extends keyof Logo3DTheme>(key: K) => (theme: Logo3DTheme): Logo3DTheme[K] => theme[key]
