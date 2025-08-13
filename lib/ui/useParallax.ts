import { useEffect, useRef, useState } from 'preact/hooks'

type Options = {
  driftSpeed?: number // pixels per second drift
  scrollFactor?: number // pixels moved per px of scroll
}

/**
 * provides slow time-based drift and scroll-based parallax offsets
 */
export const useParallax = (enabled: boolean, options: Options = {}) => {
  const { driftSpeed = 0, scrollFactor = -0.01 } = options
  const [driftY, setDriftY] = useState(0)
  const [scrollY, setScrollY] = useState(0)
  const rafRef = useRef<number | null>(null)
  const startRef = useRef<number | null>(null)

  useEffect(() => {
    if (!enabled || driftSpeed <= 0) return
    const animate = (t: number) => {
      if (startRef.current == null) startRef.current = t
      const dtSec = (t - startRef.current) / 1000
      const dy = (dtSec * driftSpeed) % 10
      setDriftY(dy)
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [enabled, driftSpeed])

  useEffect(() => {
    if (!enabled) return
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      requestAnimationFrame(() => {
        setScrollY(globalThis.scrollY * scrollFactor)
        ticking = false
      })
      ticking = true
    }
    globalThis.addEventListener('scroll', onScroll)
    setScrollY(globalThis.scrollY * scrollFactor)
    return () => globalThis.removeEventListener('scroll', onScroll)
  }, [enabled, scrollFactor])

  return Math.round(driftY + scrollY)
}
