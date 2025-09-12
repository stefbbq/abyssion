import { useEffect, useRef, useState } from 'preact/hooks'

import { currentUITheme } from '@lib/theme/index.ts'
import { currentBaseTheme } from '@lib/theme/state.ts'
import { createShades } from '@lib/theme/colorUtils/createShades.ts'
import { hexToCSS } from '@lib/theme/colorUtils/hexToCSS.ts'
import { isMobileDevice } from '@lib/utils/isMobileDevice.ts'
import { useMobileBackground } from '@lib/ui/useMobileBackground.ts'
import { useParallax } from '@lib/ui/useParallax.ts'

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
  // array of noise images to choose from
  const noiseImages = [
    '/media/images/noiseB.png',
    '/media/images/noiseC.png',
    '/media/images/noiseD.png',
    '/media/images/noiseE.png',
    '/media/images/noiseF.png',
  ]

  // random interval for noise cycling
  const getRandomInterval = () => 150 + Math.random() * 150 // 200-300ms

  // random index for noise cycling
  const getRandomIndex = (exclude: number, length: number) => {
    let idx = Math.floor(Math.random() * length)
    if (length <= 1) return 0
    while (idx === exclude) idx = Math.floor(Math.random() * length)
    return idx
  }

  const theme = currentUITheme.value
  const baseTheme = currentBaseTheme.value
  const [noiseIndex, setNoiseIndex] = useState(0)
  const timeoutRef = useRef<number | null>(null)
  const [maskStyle, setMaskStyle] = useState<Record<string, string>>({})

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
  const isMobile = isMobileDevice()

  // on mobile: start at 0.15, rise to 0.30 as themed bg fully fades in
  const mobileNoiseOpacity = 0.03 + 0.01 * Math.min(1, Math.max(0, intensity))
  const defaultNoiseOpacity = Math.min(0.06, 0.06 * intensity)
  const noiseFadeOpacity = isMobile ? mobileNoiseOpacity : defaultNoiseOpacity

  // mobile image background (behind tint/noise), only when enabled
  const { shouldEnable: showMobileBackground, index, images } = useMobileBackground()
  const parallaxY = useParallax(showMobileBackground, { driftSpeed: 0, scrollFactor: -0.01 })

  // noise cycling effect
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

  // dynamic top/bottom gradient mask that follows scroll position
  // disabled on mobile devices
  useEffect(() => {
    if (!isMobile) return

    const updateMask = () => {
      // get the scroll position
      const scrollY = Math.max(0, globalThis.scrollY || 0)

      // get the document element and its height and progress through it
      const docEl = globalThis.document?.documentElement
      const scrollHeight = docEl?.scrollHeight || 0
      const clientHeight = docEl?.clientHeight || globalThis.innerHeight || 0
      const maxScroll = Math.max(1, scrollHeight - clientHeight)
      const progress = Math.min(1, Math.max(0, scrollY / maxScroll))
      const fromBottom = Math.abs(progress * maxScroll - maxScroll)

      // top: when at top, start=50px and fade to 120px; as you scroll to 50px, move start to 0
      const topStart = Math.max(0, 35 - scrollY)
      const bottomStart = Math.max(0, 65 - fromBottom)

      const mask = `linear-gradient(
        to bottom,
        rgba(0,0,0,0) ${topStart}px,
        rgba(0,0,0,1) 150px,
        rgba(0,0,0,1) calc(100% - 150px),
        rgba(0,0,0,0) calc(100% - ${bottomStart}px)
      )`

      setMaskStyle({
        WebkitMaskImage: mask,
        maskImage: mask,
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskSize: '100% 100%',
        maskSize: '100% 100%',
      })
    }

    updateMask()
    globalThis.addEventListener('scroll', updateMask, { passive: true })
    globalThis.addEventListener('resize', updateMask)

    return () => {
      globalThis.removeEventListener('scroll', updateMask)
      globalThis.removeEventListener('resize', updateMask)
    }
  }, [!isMobile])

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
