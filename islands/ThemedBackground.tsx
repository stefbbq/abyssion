import {} from 'preact/hooks'

import { currentUITheme } from '@lib/theme/index.ts'
import { currentBaseTheme } from '@lib/theme/state.ts'
import { createShades } from '@lib/theme/colorUtils/createShades.ts'
import { hexToCSS } from '@lib/theme/colorUtils/hexToCSS.ts'
import { isMobileDevice } from '@lib/utils/isMobileDevice.ts'
import { useMobileBackground } from '@lib/ui/useMobileBackground.ts'
import { useParallax } from '@lib/ui/useParallax.ts'
import { useNoiseBackground } from '@lib/ui/useNoiseBackground.ts'
import { useScrollMask } from '@lib/ui/useScrollMask.ts'

type Props = {
  intensity: number
  showNoise: boolean
}

/**
 * Handles the themed background overlay, colorued by the theme system
 * On mobile, renders the noise effect as well (since we don't render videdo background on mobile)
 *
 * @param intensity - The intensity of the background
 * @param showNoise - Whether to show the noise effect
 * @returns ThemedBackground component
 *
 * @example
 * Usage:
 *   import ThemedBackground from '@islands/ThemedBackground.tsx'
 *   <ThemedBackground intensity={0.5} showNoise={true} />
 */
export default function ThemedBackground({ intensity = 0, showNoise = true }: Props) {
  const theme = currentUITheme.value
  const baseTheme = currentBaseTheme.value
  const isMobile = isMobileDevice()
  const maskStyle = useScrollMask(isMobile, { topFadeStartPx: 35, bottomFadeStartPx: 65, solidBandPx: 150 })

  // shared styling classes
  const baseClasses = 'fixed inset-0 pointer-events-none'
  const zIndexNoise = '-z-10'
  const zIndexTint = '-z-10'

  // tinted-background
  const tintShade = 400
  const backgroundShades = createShades(baseTheme.palette.background as number)
  const computedBackgroundColor = backgroundShades[tintShade] ? hexToCSS(backgroundShades[tintShade] as number) : 'var(--colors-background)'
  const backgroundOpacity = theme.backgroundOpacity
  const fadeOpacity = backgroundOpacity * intensity // 0-1

  // noise-background
  const noiseClasses = 'fixed inset-0 pointer-events-none bg-repeat bg-[length:150px_75px]' // noise background
  const { index: noiseIndex, images: noiseImages } = useNoiseBackground(isMobile && showNoise, { cycleMs: 5000 })

  // on mobile: start at 0.15, rise to 0.30 as themed bg fully fades in
  const mobileNoiseOpacity = 0.03 + 0.01 * Math.min(1, Math.max(0, intensity))
  const defaultNoiseOpacity = Math.min(0.06, 0.06 * intensity)
  const noiseFadeOpacity = isMobile ? mobileNoiseOpacity : defaultNoiseOpacity

  // mobile image background (behind tint/noise), only when enabled
  const { shouldEnable: showMobileBackground, index, images } = useMobileBackground()
  const parallaxY = useParallax(showMobileBackground, { driftSpeed: 0, scrollFactor: -0.015 })

  return (
    <>
      {/* tinted background */}
      <div
        id='tinted-background'
        className={`${baseClasses} ${zIndexTint}`}
        style={{ ...maskStyle, opacity: fadeOpacity, backgroundColor: computedBackgroundColor }}
        aria-hidden='true'
      />

      {/* noise background */}
      {showMobileBackground && showNoise && (
        <div
          id='noise-background'
          className={`${noiseClasses} ${zIndexNoise}`}
          style={{ ...maskStyle, backgroundImage: `url(${noiseImages[noiseIndex]})`, opacity: noiseFadeOpacity }}
          aria-hidden='true'
        />
      )}

      {/* mobile image background (behind tint/noise), only when enabled */}
      {showMobileBackground && (
        <div
          id='image-cycle'
          class='fixed inset-0 -z-30'
          style={{
            backgroundImage: `url(${images[index]})`,
            transform: `scale(1.1`,
            backgroundPosition: `center calc(50% + ${parallaxY}px)`,
            backgroundSize: '1000px',
            backgroundRepeat: 'no-repeat',
            ...maskStyle,
          }}
          aria-hidden='true'
        />
      )}
    </>
  )
}
