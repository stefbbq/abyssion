import { useSignal, useSignalEffect } from '@preact/signals'
import { currentThemeMode, toggleThemeMode } from '@lib/theme/index.ts'
import { MoonIcon, SunIcon } from '@components/icons/index.ts'

/**
 * ThemeToggle component
 * Simple theme toggle icon that switches between light and dark modes.
 * Shows sun icon in dark mode (to switch to light) and moon icon in light mode (to switch to dark).
 * Theming is handled via CSS variables and icon color.
 *
 * @example
 *   <ThemeToggle />
 */
export const ThemeToggle = () => {
  const mode = useSignal(currentThemeMode.value)

  useSignalEffect(() => {
    mode.value = currentThemeMode.value
  })

  return (
    <button
      onClick={() => toggleThemeMode()}
      class='w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-200 text-text-primary'
      title={`Switch to ${mode.value === 'dark' ? 'light' : 'dark'} mode`}
      type='button'
    >
      {mode.value === 'dark' ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}
