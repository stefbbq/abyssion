import { useEffect, useState } from 'preact/hooks'

/**
 * returns the current viewport aspect ratio (width / height)
 */
export const useViewportAspect = (): number => {
  const [aspect, setAspect] = useState<number>(() => {
    if (typeof globalThis.window === 'undefined') return 1
    const { innerWidth, innerHeight } = globalThis
    return innerWidth / Math.max(1, innerHeight)
  })

  useEffect(() => {
    if (typeof globalThis.window === 'undefined') return
    const onResize = () => setAspect(globalThis.innerWidth / Math.max(1, globalThis.innerHeight))
    globalThis.addEventListener('resize', onResize)
    return () => globalThis.removeEventListener('resize', onResize)
  }, [])

  return aspect
}
