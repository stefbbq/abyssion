import { useClientLocation } from '@lib/utils/clientLocation.ts'
import { useEffect, useRef, useState } from 'preact/hooks'
import { currentUITheme } from '@lib/theme/index.ts'

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
  const [currentPath] = useClientLocation()
  const isHomePage = currentPath === '/'
  const theme = currentUITheme.value
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
  const zIndexClass = '-z-10'
  const transitionClass = 'transition-opacity duration-400'
  // subtle gradient with a slightly darker bottom; fallback to base background var
  const backgroundClasses = 'bg-gradient-to-b from-[var(--colors-background)] to-[color-mix(in_srgb,var(--colors-background)_85%,#000_15%)]'
  const backgroundOpacity = theme.backgroundOpacity
  const fadeOpacity = backgroundOpacity * intensity // 0-1
  const noiseClasses = 'fixed inset-0 pointer-events-none bg-repeat bg-[length:150px_75px]' // noise background
  const noiseFadeOpacity = isHomePage ? 0 : Math.min(0.06, 0.06 * intensity)

  return (
    <>
      {showNoise && (
        <div
          id='noise-background'
          className={`${noiseClasses} ${zIndexClass}`}
          style={{ backgroundImage: `url(${noiseImages[noiseIndex]})`, opacity: noiseFadeOpacity }}
          aria-hidden='true'
        />
      )}
      <div
        id='tint-background'
        className={`${baseClasses} ${backgroundClasses} ${zIndexClass} ${transitionClass}`}
        style={{ opacity: fadeOpacity }}
        aria-hidden='true'
      />
    </>
  )
}

export default ThemedBackground
