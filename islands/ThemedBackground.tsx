import { useClientLocation } from '@lib/utils/clientLocation.ts'
import { useEffect, useRef, useState } from 'preact/hooks'
import { currentThemeMode, currentUITheme } from '@lib/theme/index.ts'

const noiseImages = [
  '/images/noiseB.png',
  '/images/noiseC.png',
  '/images/noiseD.png',
  '/images/noiseE.png',
  '/images/noiseF.png',
]

const getRandomInterval = () => 150 + Math.random() * 150 // 200-300ms

const getRandomIndex = (exclude: number, length: number) => {
  let idx
  do {
    idx = Math.floor(Math.random() * length)
  } while (idx === exclude && length > 1)
  return idx
}

// Accept intensity as a prop
const ThemedBackground = ({ intensity = 0 }: { intensity?: number }) => {
  const [currentPath] = useClientLocation()
  const isHomePage = currentPath === '/'
  const isLight = currentThemeMode.value === 'light'
  const theme = currentUITheme.value
  const [noiseIndex, setNoiseIndex] = useState(0)
  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
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
  }, [])

  // shared classes
  const baseClasses = 'fixed inset-0 pointer-events-none'
  const zIndexClass = 'z-10'
  const transitionClass = 'transition-opacity duration-400'

  // background
  const backgroundClasses = 'bg-[var(--colors-background)]'
  const backgroundOpacity = isLight ? theme.backgroundOpacity.light : theme.backgroundOpacity.dark

  const fadeOpacity = backgroundOpacity * (intensity * .9)

  // noise
  const noiseClasses = 'fixed inset-0 pointer-events-none bg-repeat bg-[length:150px_75px]'
  // fade in noise with intensity (max 0.05 for opacity-5)
  const noiseFadeOpacity = isHomePage ? 0 : 0.05 * intensity

  return (
    <>
      <div
        id='noise-background'
        className={`${noiseClasses} ${zIndexClass}`}
        style={{ backgroundImage: `url(${noiseImages[noiseIndex]})`, opacity: noiseFadeOpacity }}
        aria-hidden='true'
      />
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
