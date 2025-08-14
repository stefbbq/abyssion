import { useEffect, useRef, useState } from 'preact/hooks'
import { currentUITheme } from '@lib/theme/index.ts'
import { currentBaseTheme } from '@lib/theme/state.ts'
import { createShades } from '@lib/theme/colorUtils/createShades.ts'
import { hexToCSS } from '@lib/theme/colorUtils/hexToCSS.ts'
import { isMobileDevice } from '@lib/utils/isMobileDevice.ts'
import { useMobileBackground } from '@lib/ui/useMobileBackground.ts'
import { useParallax } from '@lib/ui/useParallax.ts'

const noiseImages = [
  '/images/noiseB.png',
  '/images/noiseC.png',
  '/images/noiseD.png',
  '/images/noiseE.png',
  '/images/noiseF.png',
]

const getRandomInterval = () => 150 + Math.random() * 150 // 200-300ms

const getRandomIndex = (exclude: number, length: number) => {
  let idx = Math.floor(Math.random() * length)
  if (length <= 1) return 0
  while (idx === exclude) idx = Math.floor(Math.random() * length)
  return idx
}

// Accept intensity and showNoise as props
const ThemedBackground = ({ intensity = 0, showNoise = true }: { intensity?: number; showNoise?: boolean }) => {
  const theme = currentUITheme.value
  const baseTheme = currentBaseTheme.value
  const [noiseIndex, setNoiseIndex] = useState(0)
  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    if (!showNoise) return

    // Preload all noise images
    noiseImages.forEach((src) => {
      const img = new globalThis.Image()
      img.src = src
    })

    // Start noise cycling
    let isMounted = true
    const cycle = () => {
      setNoiseIndex((prev) => {
        const next = getRandomIndex(prev, noiseImages.length)
        return next
      })

      if (isMounted) timeoutRef.current = globalThis.setTimeout(cycle, getRandomInterval())
    }

    timeoutRef.current = globalThis.setTimeout(cycle, getRandomInterval()) // Start cycling immediately

    return () => {
      isMounted = false
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [showNoise])

  // shared classes
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
  const isMobile = isMobileDevice()

  // on mobile: start at 0.15, rise to 0.30 as themed bg fully fades in
  const mobileNoiseOpacity = 0.02 + 0.01 * Math.min(1, Math.max(0, intensity))
  const defaultNoiseOpacity = Math.min(0.06, 0.06 * intensity)
  const noiseFadeOpacity = isMobile ? mobileNoiseOpacity : defaultNoiseOpacity

  // mobile image background (behind tint/noise), only when enabled
  const { shouldEnable: showMobileBackground, index, images } = useMobileBackground()
  const parallaxY = useParallax(showMobileBackground, { driftSpeed: 0, scrollFactor: -0.01 })

  return (
    <>
      {/* tinted background */}
      <div
        id='tinted-background'
        className={`${baseClasses} ${zIndexTint}`}
        style={{ opacity: fadeOpacity, backgroundColor: computedBackgroundColor }}
        aria-hidden='true'
      />

      {/* noise background */}
      {showMobileBackground && showNoise && (
        <div
          id='noise-background'
          className={`${noiseClasses} ${zIndexNoise}`}
          style={{ backgroundImage: `url(${noiseImages[noiseIndex]})`, opacity: noiseFadeOpacity }}
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
            transform: `scale(1.2)`,
            backgroundPosition: `center calc(50% + ${parallaxY}px)`,
            backgroundRepeat: 'no-repeat',
          }}
          aria-hidden='true'
        />
      )}
    </>
  )
}

export default ThemedBackground
