import { useEffect, useState } from 'preact/hooks'
import { getTheme, getThemeMode, toggleThemeMode } from '@lib/theme/index.ts'
import { MoonIcon, SunIcon } from '@atoms/icons/index.ts'

/**
 * Simple theme toggle icon that switches between light and dark modes
 * Shows sun icon in dark mode (to switch to light) and moon icon in light mode (to switch to dark)
 */
export default function ThemeToggle() {
  const [currentMode, setCurrentMode] = useState<'light' | 'dark'>(getThemeMode())
  const [theme, setTheme] = useState(getTheme())

  const handleToggle = () => {
    const newMode = toggleThemeMode()
    setCurrentMode(newMode)
    setTheme(getTheme())

    // Update document class for global theme switching
    document.documentElement.classList.toggle('light-mode', newMode === 'light')
    document.documentElement.classList.toggle('dark-mode', newMode === 'dark')

    // Reload the page to apply theme changes globally
    globalThis.location.reload()
  }

  useEffect(() => {
    // Set initial document class
    document.documentElement.classList.add(`${currentMode}-mode`)
  }, [])

  return (
    <button
      onClick={handleToggle}
      class='w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-200'
      style={{
        color: theme.colors.text.secondary,
        opacity: 0.5,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = theme.colors.text.primary
        e.currentTarget.style.opacity = '1'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = theme.colors.text.secondary
        e.currentTarget.style.opacity = '0.5'
      }}
      title={`Switch to ${currentMode === 'dark' ? 'light' : 'dark'} mode`}
    >
      {currentMode === 'dark' ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}
