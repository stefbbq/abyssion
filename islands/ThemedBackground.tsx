import { useClientLocation } from '@lib/utils/clientLocation.ts'
import { useEffect, useRef, useState } from 'preact/hooks'

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

  // Define class variables
  const baseClasses = 'fixed inset-0 pointer-events-none transition-opacity duration-400 bg-[var(--colors-background-primary)]'
  const opacityClass = isHomePage ? 'opacity-0' : 'opacity-50'
  const zIndexClass = 'z-10' // or 'z-0', adjust as needed

  // Compose final className
  const className = `${baseClasses} ${opacityClass} ${zIndexClass}`

  return (
    <div className={className} aria-hidden='true'>
      {/* Noise overlay */}
      <div
        className='absolute inset-0 pointer-events-none z-20 opacity-5 bg-repeat bg-[length:150px_75px]'
        style={{ backgroundImage: `url(${noiseImages[noiseIndex]})` }}
        aria-hidden='true'
      />
    </div>
  )
}

export default ThemedBackground
