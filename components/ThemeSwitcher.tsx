import { useSignal, useSignalEffect } from '@preact/signals'
import { getNextThemeFamilyPreview, switchToNextThemeFamily } from '@lib/theme/index.ts'
import { hexToCSS } from '@lib/theme/utils/hexToCSS.ts'
import { rgbToCSS } from '@lib/theme/utils/rgbToCSS.ts'
import type { BaseTheme } from '@lib/theme/types.ts'

// the props for ThemeSwitcher
type Props = {
  // optional class name for styling
  className?: string
}

/**
 * Theme switcher component that displays a color preview of the next theme family
 * Shows primary, secondary, accent, background, and foreground colors in compact vertical strips
 * Cycles through all available theme families while maintaining current light/dark mode
 */
export const ThemeSwitcher = ({ className = '' }: Props) => {
  const nextTheme = useSignal<BaseTheme>(getNextThemeFamilyPreview())

  useSignalEffect(() => {
    nextTheme.value = getNextThemeFamilyPreview()
  })

  return (
    <button
      onClick={switchToNextThemeFamily}
      class={`w-12 px-1.5 h-8 flex items-center justify-center rounded-lg transition-all duration-200 hover:bg-interactive-ghostHover ${className}`}
      title={`Switch to ${nextTheme.value.name} theme`}
      type='button'
    >
      {/* Color preview strips */}
      <div class='flex h-5 rounded-sm overflow-hidden gap-px'>
        {/* Primary color strip */}
        <div class='w-1.5 h-full' style={{ backgroundColor: rgbToCSS(nextTheme.value.primary) }} />
        {/* Secondary color strip */}
        <div class='w-1.5 h-full' style={{ backgroundColor: rgbToCSS(nextTheme.value.secondary) }} />
        {/* Accent color strip */}
        <div class='w-1.5 h-full' style={{ backgroundColor: rgbToCSS(nextTheme.value.accent) }} />
        {/* Background color strip */}
        <div class='w-1.5 h-full' style={{ backgroundColor: hexToCSS(nextTheme.value.background) }} />
        {/* Foreground color strip */}
        <div class='w-1.5 h-full' style={{ backgroundColor: rgbToCSS(nextTheme.value.foreground) }} />
      </div>
    </button>
  )
}
