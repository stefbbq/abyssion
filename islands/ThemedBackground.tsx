import { useClientLocation } from '@lib/utils/clientLocation.ts'
import { useEffect, useRef, useState } from 'preact/hooks'
import { currentThemeMode } from '@lib/theme/index.ts'

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

  const baseClasses = 'fixed inset-0 pointer-events-none'

  const backgroundClasses = 'bg-[var(--colors-background-primary)]'
  let backgroundOpacity = 'opacity-0'
  if (!isHomePage && !isLight) backgroundOpacity = 'opacity-40'
  if (!isHomePage && isLight) backgroundOpacity = 'opacity-60'

  const noiseClasses = 'fixed inset-0 pointer-events-none bg-repeat bg-[length:150px_75px]'
  const noiseOpacity = isHomePage ? 'opacity-0' : 'opacity-5'

  const zIndexClass = 'z-10'
  const transitionClass = 'transition-opacity duration-400'

  return (
    <>
      <div
        className={`${noiseClasses} ${noiseOpacity} ${zIndexClass}`}
        style={{ backgroundImage: `url(${noiseImages[noiseIndex]})` }}
        aria-hidden='true'
      />
      <div
        className={`${baseClasses} ${backgroundClasses} ${backgroundOpacity} ${zIndexClass} ${transitionClass}`}
        aria-hidden='true'
      />
    </>
  )
}

export default ThemedBackground
