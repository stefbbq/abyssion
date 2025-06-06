import { useEffect, useState } from 'preact/hooks'
import { getThemeMode, getUITheme, toggleThemeMode } from '@lib/theme/index.ts'

/**
 * Simple theme toggle icon that switches between light and dark modes
 * Shows sun icon in dark mode (to switch to light) and moon icon in light mode (to switch to dark)
 */
export default function ThemeToggle() {
  const [currentMode, setCurrentMode] = useState<'light' | 'dark'>(getThemeMode())
  const [theme, setTheme] = useState(getUITheme())

  const handleToggle = () => {
    const newMode = toggleThemeMode()
    setCurrentMode(newMode)
    setTheme(getUITheme())

    // Update document class for global theme switching
    document.documentElement.classList.toggle('light-mode', newMode === 'light')
    document.documentElement.classList.toggle('dark-mode', newMode === 'dark')
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
      {/* Yin-yang style theme icon */}
      <svg
        class='w-5 h-5'
        viewBox='0 0 24 24'
      >
        {/* Outer circle outline */}
        <circle
          cx='12'
          cy='12'
          r='10'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
        />
        {/* Filled semicircle - position changes based on mode */}
        <path
          d={
            currentMode === 'dark'
              ? 'M 12 2 A 10 10 0 0 1 12 22 Z' // Right half filled for dark mode
              : 'M 12 2 A 10 10 0 0 0 12 22 Z' // Left half filled for light mode
          }
          fill='currentColor'
          stroke='none'
        />
      </svg>
    </button>
  )
}
