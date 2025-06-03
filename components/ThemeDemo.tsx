import { useState } from 'preact/hooks'
import { getThemeMode, getUITheme } from '../lib/theme/index.ts'
import { getGLTheme } from '../lib/gl/theme/index.ts'
import ThemeToggle from './ThemeToggle.tsx'

/**
 * Comprehensive theme demonstration component
 * Shows UI colors, GL colors, and theme switching
 */
export default function ThemeDemo() {
  const [refreshKey, setRefreshKey] = useState(0)
  const uiTheme = getUITheme()
  const glTheme = getGLTheme()
  const currentMode = getThemeMode()

  // Force re-render when theme changes
  const handleThemeChange = () => {
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <div
      class='p-6 rounded-lg border'
      style={{
        backgroundColor: uiTheme.colors.background.primary,
        borderColor: uiTheme.colors.border.primary,
        color: uiTheme.colors.text.primary,
      }}
    >
      <div class='flex items-center justify-between mb-6'>
        <h2 class='text-2xl font-bold'>Theme System Demo</h2>
        <div onClick={handleThemeChange}>
          <ThemeToggle />
        </div>
      </div>

      <div class='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* UI Theme Colors */}
        <div class='space-y-4'>
          <h3 class='text-lg font-semibold'>UI Theme Colors</h3>
          <div class='space-y-2'>
            {/* Background Colors */}
            <div class='grid grid-cols-3 gap-2'>
              <div
                class='h-12 rounded border flex items-center justify-center text-xs'
                style={{
                  backgroundColor: uiTheme.colors.background.primary,
                  borderColor: uiTheme.colors.border.primary,
                  color: uiTheme.colors.text.primary,
                }}
              >
                BG Primary
              </div>
              <div
                class='h-12 rounded border flex items-center justify-center text-xs'
                style={{
                  backgroundColor: uiTheme.colors.background.secondary,
                  borderColor: uiTheme.colors.border.primary,
                  color: uiTheme.colors.text.primary,
                }}
              >
                BG Secondary
              </div>
              <div
                class='h-12 rounded border flex items-center justify-center text-xs'
                style={{
                  backgroundColor: uiTheme.colors.surface.primary,
                  borderColor: uiTheme.colors.border.primary,
                  color: uiTheme.colors.text.primary,
                }}
              >
                Surface
              </div>
            </div>

            {/* Text Colors */}
            <div class='space-y-1'>
              <p style={{ color: uiTheme.colors.text.primary }}>Primary text color</p>
              <p style={{ color: uiTheme.colors.text.secondary }}>Secondary text color</p>
              <p style={{ color: uiTheme.colors.text.tertiary }}>Tertiary text color</p>
            </div>

            {/* Interactive Colors */}
            <div class='grid grid-cols-2 gap-2'>
              <button
                class='px-4 py-2 rounded transition-colors'
                style={{
                  backgroundColor: uiTheme.colors.interactive.primary,
                  color: uiTheme.colors.text.inverse,
                }}
              >
                Primary Button
              </button>
              <button
                class='px-4 py-2 rounded border transition-colors'
                style={{
                  backgroundColor: 'transparent',
                  borderColor: uiTheme.colors.border.primary,
                  color: uiTheme.colors.text.primary,
                }}
              >
                Ghost Button
              </button>
            </div>
          </div>
        </div>

        {/* GL Theme Colors */}
        <div class='space-y-4'>
          <h3 class='text-lg font-semibold'>GL Theme Colors</h3>
          <div class='space-y-2'>
            {/* Brand Colors (RGB to hex display) */}
            <div class='grid grid-cols-3 gap-2'>
              <div
                class='h-12 rounded border flex items-center justify-center text-xs text-white'
                style={{
                  backgroundColor: `rgb(${Math.floor(glTheme.primary.r * 255)}, ${Math.floor(glTheme.primary.g * 255)}, ${
                    Math.floor(glTheme.primary.b * 255)
                  })`,
                  borderColor: uiTheme.colors.border.primary,
                }}
              >
                Primary
              </div>
              <div
                class='h-12 rounded border flex items-center justify-center text-xs text-white'
                style={{
                  backgroundColor: `rgb(${Math.floor(glTheme.secondary.r * 255)}, ${Math.floor(glTheme.secondary.g * 255)}, ${
                    Math.floor(glTheme.secondary.b * 255)
                  })`,
                  borderColor: uiTheme.colors.border.primary,
                }}
              >
                Secondary
              </div>
              <div
                class='h-12 rounded border flex items-center justify-center text-xs text-black'
                style={{
                  backgroundColor: `rgb(${Math.floor(glTheme.accent.r * 255)}, ${Math.floor(glTheme.accent.g * 255)}, ${
                    Math.floor(glTheme.accent.b * 255)
                  })`,
                  borderColor: uiTheme.colors.border.primary,
                }}
              >
                Accent
              </div>
            </div>

            {/* GL UI Colors */}
            <div class='text-xs space-y-1'>
              <p>Hexagon Color: #{glTheme.ui.hexagonColor.toString(16).padStart(6, '0')}</p>
              <p>Grid Color: #{glTheme.ui.gridColor.toString(16).padStart(6, '0')}</p>
              <p>Crosshair: #{glTheme.ui.centerCrosshairColor.toString(16).padStart(6, '0')}</p>
            </div>

            {/* Mode-specific adaptations */}
            <div
              class='p-3 rounded border text-sm'
              style={{
                backgroundColor: uiTheme.colors.surface.elevated,
                borderColor: uiTheme.colors.border.secondary,
              }}
            >
              <p class='font-medium mb-1'>Mode: {currentMode}</p>
              <p class='text-xs' style={{ color: uiTheme.colors.text.secondary }}>
                GL colors adapt contrast while maintaining brand consistency
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
