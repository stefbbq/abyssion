import { type Config } from 'tailwindcss'

const themeColor = (variable: string) => `var(--colors-${variable})`
const fontFamily = (variable: string) => `var(--typography-fontFamily-${variable})`
const glass = (variable: string) => `var(--glass-${variable})`
const frost = (variable: string) => `var(--frost-${variable})`

export default {
  content: [
    '{routes,islands,components}/**/*.{ts,tsx,js,jsx}',
    './static/styles.css',
  ],
  theme: {
    extend: {
      colors: {
        background: {
          primary: themeColor('background-primary'),
          secondary: themeColor('background-secondary'),
          tertiary: themeColor('background-tertiary'),
        },
        surface: {
          primary: themeColor('surface-primary'),
          secondary: themeColor('surface-secondary'),
          elevated: themeColor('surface-elevated'),
        },
        text: {
          primary: themeColor('text-primary'),
          secondary: themeColor('text-secondary'),
          tertiary: themeColor('text-tertiary'),
          inverse: themeColor('text-inverse'),
        },
        border: {
          primary: themeColor('border-primary'),
          secondary: themeColor('border-secondary'),
          focus: themeColor('border-focus'),
        },
        interactive: {
          primary: themeColor('interactive-primary'),
          primaryHover: themeColor('interactive-primaryHover'),
          secondary: themeColor('interactive-secondary'),
          secondaryHover: themeColor('interactive-secondaryHover'),
          ghost: themeColor('interactive-ghost'),
          ghostHover: themeColor('interactive-ghostHover'),
          ghostActive: themeColor('interactive-ghostActive'),
        },
      },
      backgroundColor: {
        glass: glass('background'),
        frost: frost('background'),
      },
      borderColor: {
        glass: glass('border'),
        frost: frost('border'),
      },
      backdropBlur: {
        glass: glass('backdrop'),
        frost: frost('backdrop'),
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-in-out',
        fadeOut: 'fadeOut 0.3s ease-in-out',
      },
      fontFamily: {
        heading: fontFamily('heading'),
        sans: fontFamily('body'),
        quote: fontFamily('quote'),
      },
    },
  },
} satisfies Config
