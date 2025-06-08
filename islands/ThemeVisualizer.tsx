import { Head } from '$fresh/runtime.ts'
import { useSignal } from '@preact/signals'
import {
  createTheme,
  cyberpunkTheme,
  deepSpaceHUDLightTheme,
  deepSpaceHUDTheme,
  geomodAtlasTheme,
  glitchCoreTheme,
  hypertagTheme,
  monochromeTheme,
  neonGridOSTheme,
  synthDriftTheme,
  synthwaveTheme,
  techscapeTheme,
} from '../lib/theme/index.ts'
import type { BaseTheme, UITheme } from '../lib/theme/types.ts'
import { Dropdown } from '../components/atoms/Dropdown.tsx'
import { ComponentChildren } from 'preact'
import { JSX } from 'preact/jsx-runtime'

const themes: Record<string, BaseTheme> = {
  deepSpaceHUD: deepSpaceHUDTheme,
  deepSpaceHUDLight: deepSpaceHUDLightTheme,
  neonGridOS: neonGridOSTheme,
  glitchCore: glitchCoreTheme,
  geomodAtlas: geomodAtlasTheme,
  hypertag: hypertagTheme,
  synthDrift: synthDriftTheme,
  techscape: techscapeTheme,
  synthwave: synthwaveTheme,
  monochrome: monochromeTheme,
  cyberpunk: cyberpunkTheme,
}

const themeOptions = Object.keys(themes).map((key) => ({ value: key, label: key }))

const ColorSwatch = ({ color, name, hex }: { color: string; name: string; hex: string }) => (
  <div class='flex items-center gap-4 p-2 rounded-md' style={{ background: 'rgba(255, 255, 255, 0.1)' }}>
    <div class='w-12 h-12 rounded-md border' style={{ backgroundColor: color }}></div>
    <div>
      <div class='font-semibold'>{name}</div>
      <div class='opacity-80 text-sm'>{color}</div>
      <div class='opacity-50 text-xs'>{hex}</div>
    </div>
  </div>
)

const ThemeSection = ({ title, children }: { title: string; children: ComponentChildren }) => (
  <section class='mb-8'>
    <h2 class='text-2xl font-bold mb-4 pb-2 border-b-2' style={{ borderColor: 'currentColor' }}>{title}</h2>
    <div class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>{children}</div>
  </section>
)

const ThemeShowcase = ({ theme }: { theme: UITheme }) => {
  const { colors, glass, spacing, typography } = theme

  return (
    <div class='p-8 rounded-lg' style={{ backgroundColor: colors.background.primary, color: colors.text.primary }}>
      <ThemeSection title='Background Colors'>
        <ColorSwatch color={colors.background.primary} name='Primary' hex={colors.background.primary} />
        <ColorSwatch color={colors.background.secondary} name='Secondary' hex={colors.background.secondary} />
        <ColorSwatch color={colors.background.tertiary} name='Tertiary' hex={colors.background.tertiary} />
      </ThemeSection>

      <ThemeSection title='Surface Colors'>
        <ColorSwatch color={colors.surface.primary} name='Primary' hex={colors.surface.primary} />
        <ColorSwatch color={colors.surface.secondary} name='Secondary' hex={colors.surface.secondary} />
        <ColorSwatch color={colors.surface.elevated} name='Elevated' hex={colors.surface.elevated} />
      </ThemeSection>

      <ThemeSection title='Text Colors'>
        <ColorSwatch color={colors.text.primary} name='Primary' hex={colors.text.primary} />
        <ColorSwatch color={colors.text.secondary} name='Secondary' hex={colors.text.secondary} />
        <ColorSwatch color={colors.text.tertiary} name='Tertiary' hex={colors.text.tertiary} />
        <ColorSwatch color={colors.text.inverse} name='Inverse' hex={colors.text.inverse} />
      </ThemeSection>

      <ThemeSection title='Border Colors'>
        <ColorSwatch color={colors.border.primary} name='Primary' hex={colors.border.primary} />
        <ColorSwatch color={colors.border.secondary} name='Secondary' hex={colors.border.secondary} />
        <ColorSwatch color={colors.border.focus} name='Focus' hex={colors.border.focus} />
      </ThemeSection>

      <ThemeSection title='Interactive Colors'>
        <ColorSwatch color={colors.interactive.primary} name='Primary' hex={colors.interactive.primary} />
        <ColorSwatch color={colors.interactive.primaryHover} name='Primary Hover' hex={colors.interactive.primaryHover} />
        <ColorSwatch color={colors.interactive.secondary} name='Secondary' hex={colors.interactive.secondary} />
        <ColorSwatch
          color={colors.interactive.secondaryHover}
          name='Secondary Hover'
          hex={colors.interactive.secondaryHover}
        />
        <ColorSwatch color={colors.interactive.ghost} name='Ghost' hex={colors.interactive.ghost} />
        <ColorSwatch color={colors.interactive.ghostHover} name='Ghost Hover' hex={colors.interactive.ghostHover} />
        <ColorSwatch color={colors.interactive.ghostActive} name='Ghost Active' hex={colors.interactive.ghostActive} />
      </ThemeSection>

      <ThemeSection title='Glass Effect'>
        <div
          class='p-8 rounded-lg flex items-center justify-center'
          style={{
            backgroundImage: 'linear-gradient(45deg, #ff00ff, #00ffff)',
          }}
        >
          <div
            class='w-full h-32 rounded-lg border flex items-center justify-center text-center p-4'
            style={{
              background: glass.background,
              backdropFilter: glass.backdrop,
              borderColor: glass.border,
            }}
          >
            <span style={{ color: colors.text.primary }}>
              Glass Effect
              <br />
              <small>
                BG: {glass.background}
                <br />
                Border: {glass.border}
              </small>
            </span>
          </div>
        </div>
      </ThemeSection>

      <ThemeSection title='Spacing'>
        {Object.entries(spacing).map(([key, value]) => (
          <div class='flex items-center gap-4'>
            <div class='w-24 font-semibold'>{key.toUpperCase()}</div>
            <div class='text-lg'>{value}</div>
            <div class='h-8 rounded-full' style={{ width: value, backgroundColor: colors.interactive.primary }}></div>
          </div>
        ))}
      </ThemeSection>

      <ThemeSection title='Typography'>
        <div class='space-y-4'>
          <p style={{ fontFamily: typography.fontFamily }}>Default Font Family: {typography.fontFamily}</p>
          {Object.entries(typography.fontWeights).map(([key, value]) => (
            <p style={{ fontFamily: typography.fontFamily, fontWeight: value }}>
              {key.charAt(0).toUpperCase() + key.slice(1)} - Font Weight {value}
            </p>
          ))}
        </div>
      </ThemeSection>
    </div>
  )
}

export default function ThemeVisualizer() {
  const selectedTheme = useSignal<string>('deepSpaceHUD')

  const handleThemeChange = (event: JSX.TargetedEvent<HTMLSelectElement>) => {
    selectedTheme.value = event.currentTarget.value
  }

  const activeBaseTheme = themes[selectedTheme.value]
  const activeUITheme = createTheme(activeBaseTheme)

  return (
    <>
      <Head>
        <title>Theme Viewer - {selectedTheme.value}</title>
        <style>
          {`
            body {
              background-color: ${activeUITheme.colors.background.primary};
              color: ${activeUITheme.colors.text.primary};
            }
          `}
        </style>
      </Head>
      <div class='p-4 md:p-8'>
        <header class='mb-8 flex flex-col md:flex-row items-center justify-between gap-4'>
          <h1 class='text-3xl font-bold'>Theme Visualizer</h1>
          <div class='w-full md:w-64'>
            <Dropdown options={themeOptions} value={selectedTheme.value} onChange={handleThemeChange} />
          </div>
        </header>

        <main>
          <ThemeShowcase theme={activeUITheme} />
        </main>
      </div>
    </>
  )
}
