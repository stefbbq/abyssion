import { currentUITheme, switchToNextThemeFamily } from '@lib/theme/index.ts'

// the props for ThemeSwitcher
type Props = {
  // optional class name for styling
  className?: string
}

/**
 * Theme switcher component that displays a color preview of the current theme
 * Shows primary, secondary, accent, background, and foreground colors in compact vertical strips
 * Cycles through all available theme families while maintaining current light/dark mode
 * Uses theme-aware border radius for consistent styling
 */
export const ThemeSwitcher = ({ className = '' }: Props) => {
  // Read current UI theme (already resolves full palette and CSS colors)
  const ui = currentUITheme.value
  const primaryCSS = ui.colors.primary
  const secondaryCSS = ui.colors.secondary
  const tertiaryCSS = ui.colors.tertiary
  const backgroundCSS = ui.colors.background
  const foregroundCSS = ui.colors.foreground

  return (
    <button
      onClick={switchToNextThemeFamily}
      class={`w-12 px-1.5 h-8 flex items-center justify-center rounded-theme-lg transition-all duration-200 hover:bg-interactive-ghostHover ${className}`}
      title={`Current theme: ${ui ? 'active' : 'unknown'}`}
      type='button'
    >
      {/* Color preview strips */}
      <div class='flex h-5 rounded-theme-sm overflow-hidden gap-px'>
        {/* Primary color strip */}
        <div class='w-1.5 h-full' style={{ backgroundColor: primaryCSS || '#00000050' }} />
        {/* Secondary color strip */}
        <div class='w-1.5 h-full' style={{ backgroundColor: secondaryCSS || '#00000050' }} />
        {/* Accent color strip */}
        <div class='w-1.5 h-full' style={{ backgroundColor: tertiaryCSS || '#00000050' }} />
        {/* Background color strip */}
        <div class='w-1.5 h-full' style={{ backgroundColor: backgroundCSS || '#00000050' }} />
        {/* Foreground color strip */}
        <div class='w-1.5 h-full' style={{ backgroundColor: foregroundCSS || '#00000050' }} />
      </div>
    </button>
  )
}
