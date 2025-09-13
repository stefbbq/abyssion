import { useEffect, useMemo, useState } from 'preact/hooks'

const defaultNoiseImages = [
  '/media/images/noiseB.png',
  '/media/images/noiseC.png',
  '/media/images/noiseD.png',
  '/media/images/noiseE.png',
  '/media/images/noiseF.png',
]

export type UseNoiseBackgroundOptions = {
  images?: string[]
  cycleMs?: number
}

/**
 * provides background noise image cycling and preloading
 */
export const useNoiseBackground = (enabled: boolean, options: UseNoiseBackgroundOptions = {}) => {
  const { images = defaultNoiseImages, cycleMs = 5000 } = options
  const [index, setIndex] = useState(0)

  const safeImages = useMemo(() => images.length > 0 ? images : defaultNoiseImages, [images])

  useEffect(() => {
    if (!enabled) return
    safeImages.forEach((src) => {
      const img = new Image()
      img.src = src
    })
  }, [enabled, safeImages])

  useEffect(() => {
    if (!enabled) return
    let last = -1
    const id = setInterval(() => {
      setIndex((prev) => {
        last = prev
        if (safeImages.length <= 1) return 0
        let next = Math.floor(Math.random() * safeImages.length)
        while (next === last) next = Math.floor(Math.random() * safeImages.length)
        return next
      })
    }, cycleMs)
    return () => clearInterval(id)
  }, [enabled, safeImages.length, cycleMs])

  return { index, images: safeImages }
}
