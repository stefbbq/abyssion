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
