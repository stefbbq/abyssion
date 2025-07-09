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

const ThemedBackground = () => {
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
  const backgroundOpacity = isHomePage ? 0 : (isLight ? theme.backgroundOpacity.light : theme.backgroundOpacity.dark)

  // noise
  const noiseClasses = 'fixed inset-0 pointer-events-none bg-repeat bg-[length:150px_75px]'
  const noiseOpacity = isHomePage ? 'opacity-0' : 'opacity-5'

  return (
    <>
      <div
        id='noise-background'
        className={`${noiseClasses} ${noiseOpacity} ${zIndexClass}`}
        style={{ backgroundImage: `url(${noiseImages[noiseIndex]})` }}
        aria-hidden='true'
      />
      <div
        id='tint-background'
        className={`${baseClasses} ${backgroundClasses} ${zIndexClass} ${transitionClass}`}
        style={{ opacity: backgroundOpacity }}
        aria-hidden='true'
      />
    </>
  )
}

export default ThemedBackground
