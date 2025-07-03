import { createBaseTheme } from '../utils/createBaseTheme.ts'

/**
 * Neon Grid OS color palette - retro CRT-inspired colors (simplified to 3 shades)
 */
const neonGridPalette = {
  primary: {
    50: 0xff9caa, // Light pink
    100: 0xff9caa, // Light pink
    200: 0xff9caa, // Light pink
    300: 0xff9caa, // Light pink
    400: 0xff9caa, // Light pink
    500: 0xff2d55, // Main primary - electric pink
    600: 0xcc1a3b, // Dark pink
    700: 0xcc1a3b, // Dark pink
    800: 0xcc1a3b, // Dark pink
    900: 0xcc1a3b, // Dark pink
  },
  secondary: {
    50: 0x80d9ff, // Light blue
    100: 0x80d9ff, // Light blue
    200: 0x80d9ff, // Light blue
    300: 0x80d9ff, // Light blue
    400: 0x80d9ff, // Light blue
    500: 0x2EC2FF, // Main secondary - electric blue
    600: 0x1f8ecc, // Dark blue
    700: 0x1f8ecc, // Dark blue
    800: 0x1f8ecc, // Dark blue
    900: 0x1f8ecc, // Dark blue
  },
  accent: {
    50: 0xfef08a, // Light yellow
    100: 0xfef08a, // Light yellow
    200: 0xfef08a, // Light yellow
    300: 0xfef08a, // Light yellow
    400: 0xfef08a, // Light yellow
    500: 0xFFF42E, // Main accent - electric yellow
    600: 0xccc224, // Dark yellow
    700: 0xccc224, // Dark yellow
    800: 0xccc224, // Dark yellow
    900: 0xccc224, // Dark yellow
  },
  neutral: {
    0: 0xffffff, // Pure white
    50: 0xe5e5e5, // Light gray
    100: 0xe5e5e5, // Light gray
    200: 0xe5e5e5, // Light gray
    300: 0xe5e5e5, // Light gray
    400: 0xe5e5e5, // Light gray
    500: 0x666666, // Mid gray
    600: 0x666666, // Mid gray
    700: 0x1a1a1a, // Very dark gray
    800: 0x1a1a1a, // Very dark gray
    900: 0x1a1a1a, // Very dark gray
    950: 0x0a0a0a, // Near black
    1000: 0x000000, // Pure black
  },
  semantic: {
    success: 0x10b981, // Green
    warning: 0xf59e0b, // Amber
    error: 0xef4444, // Red
    info: 0x3b82f6, // Blue
  },
}

/**
 * Neon Grid OS semantic color roles - light mode
 */
const neonGridColorRoles = {
  surface: {
    primary: 'primary.500', // Electric pink surfaces
    secondary: 'secondary.500', // Electric blue surfaces
    tertiary: 'accent.500', // Electric yellow surfaces
    neutral: 'neutral.50', // Light neutral surfaces
    elevated: 'neutral.100', // Light elevated surfaces
  },
  background: {
    primary: 'neutral.0', // Pure white background
    secondary: 'neutral.50', // Light gray background
    tertiary: 'neutral.100', // Medium light background
  },
  border: {
    primary: 'neutral.200', // Light border
    secondary: 'neutral.500', // Medium border
    focus: 'primary.500', // Pink focus border
  },
  text: {
    primary: 'neutral.700', // Dark text
    secondary: 'neutral.500', // Medium text
    tertiary: 'neutral.500', // Light text
    inverse: 'neutral.0', // White text for dark backgrounds
  },
  interactive: {
    primary: 'primary.500', // Pink interactive elements
    secondary: 'secondary.500', // Blue interactive elements
    tertiary: 'accent.500', // Yellow interactive elements
  },
}

/**
 * Neon Grid OS semantic color roles - dark mode
 */
const neonGridColorRolesDark = {
  surface: {
    primary: 'primary.500', // Electric pink for dark mode
    secondary: 'secondary.500', // Electric blue for dark mode
    tertiary: 'accent.500', // Electric yellow for dark mode
    neutral: 'neutral.700', // Dark neutral surfaces
    elevated: 'neutral.500', // Elevated dark surfaces
  },
  background: {
    primary: 'neutral.950', // Near black background
    secondary: 'neutral.900', // Dark gray background
    tertiary: 'neutral.700', // Medium dark background
  },
  border: {
    primary: 'neutral.500', // Dark border
    secondary: 'neutral.500', // Medium dark border
    focus: 'primary.200', // Brighter pink for focus in dark mode
  },
  text: {
    primary: 'neutral.50', // Light text
    secondary: 'neutral.50', // Medium light text
    tertiary: 'neutral.500', // Medium text
    inverse: 'neutral.700', // Dark text for light backgrounds
  },
  interactive: {
    primary: 'primary.200', // Brighter pink for dark mode
    secondary: 'secondary.200', // Brighter blue for dark mode
    tertiary: 'accent.200', // Brighter yellow for dark mode
  },
}

/**
 * Neon Grid OS theme - light theme with CRT-style surfaces
 */
export const neonGridOSTheme = createBaseTheme({
  name: 'neon-grid-os',
  mode: 'light',

  // Modern semantic structure
  palette: neonGridPalette,
  colorRoles: neonGridColorRoles,

  // Surface system configuration - CRT retro style
  surfaces: {
    main: {
      color: 'surface.primary', // Electric pink
      opacity: {
        light: 0.85, // Very opaque for solid, chunky feel
        dark: 0.9,
      },
      borderRadius: '0px', // Completely squared for retro grid aesthetic
      border: {
        width: '2px',
        style: 'solid',
        color: 'border.primary',
      },
      effects: {
        backdropBlur: '8px', // Minimal blur for crisp edges
        filter: 'perspective(1000px) rotateX(0.5deg) scale(1.002, 0.998) brightness(1.02) contrast(1.05)',
        boxShadow: '0 0 4px rgba(255, 45, 85, 0.3)',
      },
    },
    alt: {
      color: 'surface.secondary', // Electric blue
      opacity: {
        light: 0.95, // Nearly solid for strong shell appearance
        dark: 0.92,
      },
      borderRadius: '2px', // Minimal rounding for subtle corners
      border: {
        width: '1px',
        style: 'solid',
        color: 'border.primary',
      },
      effects: {
        backdropBlur: '6px', // Minimal blur for retro feel
        boxShadow: '0 0 2px rgba(46, 194, 255, 0.4)',
      },
    },
    header: {
      color: 'background.primary', // White header
      opacity: {
        light: 0.9,
        dark: 0.85,
      },
      borderRadius: '0px', // Completely squared header
      border: {
        width: '0px',
        style: 'none',
      },
      effects: {
        filter: 'brightness(1.01) saturate(1.02)',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
    },
    nav: {
      color: 'background.secondary', // Light gray navigation
      opacity: {
        light: 0.88,
        dark: 0.9,
      },
      borderRadius: '0px', // Squared navigation
      border: {
        width: '1px',
        style: 'solid',
        color: 'border.primary',
      },
      effects: {
        filter: 'brightness(1.03) saturate(1.1) drop-shadow(0 0 2px rgba(189, 16, 224, 0.3))',
        boxShadow: '0 0 6px rgba(255, 45, 85, 0.2)',
      },
    },
    card: {
      color: 'background.primary', // White cards
      opacity: {
        light: 0.92,
        dark: 0.88,
      },
      borderRadius: '0px', // Squared cards
      border: {
        width: '2px',
        style: 'solid',
        color: 'surface.secondary', // Blue border
      },
      effects: {
        backdropBlur: '10px',
        boxShadow: '0 4px 8px rgba(46, 194, 255, 0.3)',
      },
    },
    button: {
      color: 'surface.primary', // Pink buttons
      opacity: {
        light: 0.9,
        dark: 0.85,
      },
      borderRadius: '0px', // Squared buttons
      border: {
        width: '2px',
        style: 'solid',
        color: 'primary.700', // Darker pink border
      },
      effects: {
        filter: 'brightness(1.02) saturate(1.05)',
        boxShadow: '0 2px 4px rgba(255, 45, 85, 0.4)',
        transform: 'scale(1.0)',
      },
    },
    input: {
      color: 'background.primary', // White inputs
      opacity: {
        light: 0.95,
        dark: 0.9,
      },
      borderRadius: '0px', // Squared inputs
      border: {
        width: '2px',
        style: 'solid',
        color: 'surface.secondary', // Blue border
      },
      effects: {
        backdropBlur: '4px',
        boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)',
      },
    },
    dropdown: {
      color: 'background.primary', // White dropdowns
      opacity: {
        light: 0.96,
        dark: 0.92,
      },
      borderRadius: '0px', // Squared dropdowns
      border: {
        width: '2px',
        style: 'solid',
        color: 'surface.primary', // Pink border
      },
      effects: {
        backdropBlur: '12px',
        boxShadow: '0 8px 16px rgba(255, 45, 85, 0.3)',
        filter: 'brightness(1.01)',
      },
    },
  },

  // CRT-style background opacity - solid background for retro feel
  backgroundOpacity: {
    light: 0, // Solid background for CRT light mode
    dark: 0.75, // Strong background for CRT dark mode
  },

  typography: {
    fontFamily: {
      heading: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      quote: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
  },
})

/**
 * Neon Grid OS theme - dark theme with enhanced CRT-style effects
 */
export const neonGridOSDarkTheme = createBaseTheme({
  name: 'neon-grid-os-dark',
  mode: 'dark',

  // Modern semantic structure
  palette: neonGridPalette,
  colorRoles: neonGridColorRolesDark,

  // Surface system configuration for dark mode - enhanced CRT effects
  surfaces: {
    main: {
      color: 'surface.neutral', // Dark neutral
      opacity: {
        light: 0.85,
        dark: 0.88, // Very opaque for strong dark contrast
      },
      borderRadius: '2px', // Minimal rounding in dark mode
      border: {
        width: '2px',
        style: 'solid',
        color: 'border.primary',
      },
      effects: {
        backdropBlur: '10px',
        filter: 'perspective(800px) rotateX(0.8deg) scale(1.003, 0.997) brightness(1.05) contrast(1.08) hue-rotate(1deg)',
        boxShadow: '0 0 8px rgba(255, 69, 110, 0.4)',
      },
    },
    alt: {
      color: 'surface.elevated', // Elevated dark surface
      opacity: {
        light: 0.95,
        dark: 0.94, // Nearly completely solid in dark mode
      },
      borderRadius: '4px', // Slightly more rounded in dark mode
      border: {
        width: '1px',
        style: 'solid',
        color: 'border.primary',
      },
      effects: {
        backdropBlur: '8px',
        boxShadow: '0 0 4px rgba(255, 119, 85, 0.3)',
      },
    },
    header: {
      color: 'background.primary', // Near black header
      opacity: {
        light: 0.9,
        dark: 0.9,
      },
      borderRadius: '0px', // Squared header
      border: {
        width: '0px',
        style: 'none',
      },
      effects: {
        filter: 'brightness(1.02) saturate(1.05) drop-shadow(0 0 1px rgba(255, 69, 110, 0.4))',
        boxShadow: '0 2px 8px rgba(255, 69, 110, 0.2)',
      },
    },
    nav: {
      color: 'background.secondary', // Dark gray navigation
      opacity: {
        light: 0.88,
        dark: 0.92,
      },
      borderRadius: '2px', // Minimal rounding
      border: {
        width: '1px',
        style: 'solid',
        color: 'border.primary',
      },
      effects: {
        filter: 'brightness(1.04) saturate(1.15) drop-shadow(0 0 3px rgba(208, 64, 242, 0.5))',
        boxShadow: '0 0 10px rgba(208, 64, 242, 0.3)',
      },
    },
    card: {
      color: 'surface.neutral', // Dark cards
      opacity: {
        light: 0.92,
        dark: 0.9,
      },
      borderRadius: '4px', // Minimal rounding
      border: {
        width: '2px',
        style: 'solid',
        color: 'surface.secondary', // Brighter blue border in dark mode
      },
      effects: {
        backdropBlur: '12px',
        boxShadow: '0 4px 12px rgba(255, 119, 85, 0.4)',
      },
    },
    button: {
      color: 'surface.primary', // Brighter pink buttons in dark mode
      opacity: {
        light: 0.9,
        dark: 0.88,
      },
      borderRadius: '2px', // Minimal rounding
      border: {
        width: '2px',
        style: 'solid',
        color: 'primary.500', // Standard pink border
      },
      effects: {
        filter: 'brightness(1.03) saturate(1.08)',
        boxShadow: '0 2px 6px rgba(255, 69, 110, 0.5)',
        transform: 'scale(1.0)',
      },
    },
    input: {
      color: 'surface.neutral', // Dark inputs
      opacity: {
        light: 0.95,
        dark: 0.92,
      },
      borderRadius: '2px', // Minimal rounding
      border: {
        width: '2px',
        style: 'solid',
        color: 'surface.secondary', // Brighter blue border
      },
      effects: {
        backdropBlur: '6px',
        boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.3)',
      },
    },
    dropdown: {
      color: 'surface.neutral', // Dark dropdowns
      opacity: {
        light: 0.96,
        dark: 0.94,
      },
      borderRadius: '4px', // Minimal rounding
      border: {
        width: '2px',
        style: 'solid',
        color: 'surface.primary', // Brighter pink border
      },
      effects: {
        backdropBlur: '16px',
        boxShadow: '0 8px 20px rgba(255, 69, 110, 0.4)',
        filter: 'brightness(1.02)',
      },
    },
  },

  // Enhanced CRT background opacity for dark mode
  backgroundOpacity: {
    light: 0.85,
    dark: 0.8, // Higher opacity for pronounced CRT dark mode effect
  },

  typography: {
    fontFamily: {
      heading: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      quote: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
  },
})
