import { useEffect, useRef, useState } from 'preact/hooks'
import { currentUITheme } from '@lib/theme/index.ts'
import { currentBaseTheme } from '@lib/theme/state.ts'
import { createShades } from '@lib/theme/colorUtils/createShades.ts'
import { hexToCSS } from '@lib/theme/colorUtils/hexToCSS.ts'
import { hexStringToCSSRGB } from '@lib/theme/colorUtils/hexStringToCSSRGB.ts'
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
  const previousBodyStylesRef = useRef<Record<string, string> | null>(null)
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

  // set body background on ios so it paints behind safari toolbars
  useEffect(() => {
    const isIOS = () => typeof globalThis.navigator !== 'undefined' && /iPad|iPhone|iPod/i.test(globalThis.navigator.userAgent)
    if (!isIOS()) return

    const body = globalThis.document?.body
    if (!body) return

    if (!previousBodyStylesRef.current) {
      previousBodyStylesRef.current = {
        backgroundImage: body.style.backgroundImage,
        backgroundRepeat: body.style.backgroundRepeat,
        backgroundSize: body.style.backgroundSize,
        backgroundPosition: body.style.backgroundPosition,
        backgroundAttachment: body.style.backgroundAttachment,
      }
    }

    const rgb = hexStringToCSSRGB(computedBackgroundColor)
    const tintLayer = `linear-gradient(rgba(${rgb}, ${fadeOpacity}), rgba(${rgb}, ${fadeOpacity}))`

    const layers: string[] = [tintLayer]
    const repeats: string[] = ['no-repeat']
    const sizes: string[] = ['auto']
    const positions: string[] = ['0 0']

    if (showMobileBackground) {
      layers.push(`url(${images[index]})`)
      repeats.push('no-repeat')
      sizes.push('cover')
      positions.push('center center')
    }

    if (showMobileBackground && showNoise) {
      layers.push(`url(${noiseImages[noiseIndex]})`)
      repeats.push('repeat')
      sizes.push('150px 75px')
      positions.push('0 0')
    }

    body.style.backgroundImage = layers.join(', ')
    body.style.backgroundRepeat = repeats.join(', ')
    body.style.backgroundSize = sizes.join(', ')
    body.style.backgroundPosition = positions.join(', ')
    body.style.backgroundAttachment = 'scroll'

    return () => {
      if (!previousBodyStylesRef.current) return
      body.style.backgroundImage = previousBodyStylesRef.current.backgroundImage
      body.style.backgroundRepeat = previousBodyStylesRef.current.backgroundRepeat
      body.style.backgroundSize = previousBodyStylesRef.current.backgroundSize
      body.style.backgroundPosition = previousBodyStylesRef.current.backgroundPosition
      body.style.backgroundAttachment = previousBodyStylesRef.current.backgroundAttachment
      previousBodyStylesRef.current = null
    }
  }, [computedBackgroundColor, fadeOpacity, showMobileBackground, images, index, parallaxY, showNoise, noiseIndex])

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
            transform: `scale(1.1)`,
            backgroundPosition: `center calc(50% + ${parallaxY}px)`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
          }}
          aria-hidden='true'
        />
      )}
    </>
  )
}

export default ThemedBackground
