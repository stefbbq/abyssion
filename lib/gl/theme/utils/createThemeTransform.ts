import type { Logo3DTheme } from '../theme.d.ts'
import { pipe } from '../../../utils/pipe.ts'

/**
 * Creates a theme transformation pipeline
 */
export const createThemeTransform = (...transforms: Array<(theme: Logo3DTheme) => Logo3DTheme>) => (baseTheme: Logo3DTheme): Logo3DTheme =>
  pipe(...transforms)(baseTheme)
