import { type Config } from 'tailwindcss'

export default {
  content: [
    '{routes,islands,components}/**/*.{ts,tsx,js,jsx}',
    './static/styles.css',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--colors-primary)',
        secondary: 'var(--colors-secondary)',
        tertiary: 'var(--colors-tertiary)',
        foreground: 'var(--colors-foreground)',
        background: 'var(--colors-background)',
        surface: 'var(--colors-surface)',
      },
      fontSize: {
        xs: 'var(--typography-fontSizes-xs)',
        sm: 'var(--typography-fontSizes-sm)',
        // alias commonly used but non-standard tailwind size
        md: 'var(--typography-fontSizes-base)',
        base: 'var(--typography-fontSizes-base)',
        lg: 'var(--typography-fontSizes-lg)',
        xl: 'var(--typography-fontSizes-xl)',
        '2xl': 'var(--typography-fontSizes-2xl)',
        '3xl': 'var(--typography-fontSizes-3xl)',
        '4xl': 'var(--typography-fontSizes-4xl)',
        '5xl': 'var(--typography-fontSizes-5xl)',
        '6xl': 'var(--typography-fontSizes-6xl)',
      },
      fontFamily: {
        heading: 'var(--typography-fontFamily-heading)',
        sans: 'var(--typography-fontFamily-body)',
        quote: 'var(--typography-fontFamily-quote)',
      },
      borderRadius: {
        'theme-sm': 'var(--borderRadius-sm)',
        'theme-md': 'var(--borderRadius-md)',
        'theme-lg': 'var(--borderRadius-lg)',
        'theme-xl': 'var(--borderRadius-xl)',
        'theme-full': 'var(--borderRadius-full)',
        'shell-collapsed': 'var(--borderRadius-shellCollapsed)',
        'shell-expanded': 'var(--borderRadius-shellExpanded)',
      },
    },
  },
  plugins: [],
} satisfies Config
