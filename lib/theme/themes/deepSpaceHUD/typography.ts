/**
 * typography configuration for deep space hud theme
 */
export const deepSpaceHUDTypography = {
  heading: {
    fontFamily: '"Oswald", sans-serif',
    fontSize: '2.25rem',
    fontWeight: 300,
    lineHeight: 1.1,
    letterSpacing: '0.02em',
  },
  body: {
    fontFamily: '"Oxanium", sans-serif',
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1.6,
    letterSpacing: 'normal',
  },
  quote: {
    fontFamily: '"EB Garamond", serif',
    fontSize: '1.125rem',
    fontWeight: 400,
    lineHeight: 1.7,
    letterSpacing: 'normal',
    fontStyle: 'italic' as const,
  },
  logo: {
    fontFamily: '"Oxanium", sans-serif',
    fontSize: '1.25rem',
    fontWeight: 400,
    lineHeight: 1,
    letterSpacing: '0.05em',
  },
  fontUrls: [
    'https://fonts.googleapis.com/css2?family=Oswald:wght@200..500&display=swap',
    'https://fonts.googleapis.com/css2?family=Oxanium:wght@400;700&display=swap',
    'https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400&display=swap',
  ],
}
