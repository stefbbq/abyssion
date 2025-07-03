import { currentBaseTheme, switchToNextThemeFamily } from '@lib/theme/index.ts'
import { hexToCSS } from '@lib/theme/colorUtils/hexToCSS.ts'
import { rgbToCSS } from '@lib/theme/colorUtils/rgbToCSS.ts'
import { resolveColorReference } from '@lib/theme/utils/resolveColorReference.ts'
import { hexStringToRGB } from '@lib/theme/colorUtils/hexStringToRGB.ts'

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
  // Use the current theme signal directly
  const currentTheme = currentBaseTheme
  const theme = currentTheme.value

  // Check if this theme has the new palette structure
  const hasNewStructure = theme.palette && theme.colorRoles

  let primaryRGB, secondaryRGB, accentRGB, backgroundHex, foregroundRGB

  if (hasNewStructure) {
    // Use new palette structure
    const primaryHex = resolveColorReference('primary.500', theme.palette, theme.colorRoles)
    const secondaryHex = resolveColorReference('secondary.500', theme.palette, theme.colorRoles)
    const accentHex = resolveColorReference('accent.500', theme.palette, theme.colorRoles)
    backgroundHex = resolveColorReference('background.primary', theme.palette, theme.colorRoles)
    const foregroundHex = resolveColorReference('text.primary', theme.palette, theme.colorRoles)

    // Convert hex to RGB for rgbToCSS function
    primaryRGB = hexStringToRGB('#' + primaryHex.toString(16).padStart(6, '0'))
    secondaryRGB = hexStringToRGB('#' + secondaryHex.toString(16).padStart(6, '0'))
    accentRGB = hexStringToRGB('#' + accentHex.toString(16).padStart(6, '0'))
    foregroundRGB = hexStringToRGB('#' + foregroundHex.toString(16).padStart(6, '0'))
  } else {
    // Use legacy theme structure
    primaryRGB = theme.primary
    secondaryRGB = theme.secondary
    accentRGB = theme.accent
    backgroundHex = theme.background
    foregroundRGB = theme.foreground
  }

  return (
    <button
      onClick={switchToNextThemeFamily}
      class={`w-12 px-1.5 h-8 flex items-center justify-center rounded-theme-lg transition-all duration-200 hover:bg-interactive-ghostHover ${className}`}
      title={`Current theme: ${currentTheme.value.name}`}
      type='button'
    >
      {/* Color preview strips */}
      <div class='flex h-5 rounded-theme-sm overflow-hidden gap-px'>
        {/* Primary color strip */}
        <div class='w-1.5 h-full' style={{ backgroundColor: primaryRGB ? rgbToCSS(primaryRGB) : '#4263eb' }} />
        {/* Secondary color strip */}
        <div class='w-1.5 h-full' style={{ backgroundColor: secondaryRGB ? rgbToCSS(secondaryRGB) : '#7c3aed' }} />
        {/* Accent color strip */}
        <div class='w-1.5 h-full' style={{ backgroundColor: accentRGB ? rgbToCSS(accentRGB) : '#00ffe1' }} />
        {/* Background color strip */}
        <div class='w-1.5 h-full' style={{ backgroundColor: backgroundHex ? hexToCSS(backgroundHex) : '#0a0a0a' }} />
        {/* Foreground color strip */}
        <div class='w-1.5 h-full' style={{ backgroundColor: foregroundRGB ? rgbToCSS(foregroundRGB) : '#ffffff' }} />
      </div>
    </button>
  )
}
