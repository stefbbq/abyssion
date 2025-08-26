import { useEffect, useMemo, useState } from 'preact/hooks'

import { isMobileDevice } from '@lib/utils/isMobileDevice.ts'
import { isSlowConnection } from '@lib/utils/isSlowConnection.ts'
import { useViewportAspect } from './useViewportAspect.ts'

const defaultImages = [
  '/media/videos/videoCycle_mobileBG_1.webp',
  '/media/videos/videoCycle_mobileBG_2.webp',
  '/media/videos/videoCycle_mobileBG_3.webp',
  '/media/videos/videoCycle_mobileBG_4.webp',
  '/media/videos/videoCycle_mobileBG_5.webp',
  '/media/videos/videoCycle_mobileBG_6.webp',
  '/media/videos/videoCycle_mobileBG_7.webp',
]

type Options = {
  images?: string[]
  cycleMs?: number
}

/**
 * provides background image index cycling and zoom factor for narrow screens
 */
export const useMobileBackground = (enabledOverride?: boolean, options: Options = {}) => {
  const { images = defaultImages, cycleMs = 5000 } = options
  const shouldEnable = useMemo(() => enabledOverride ?? (isMobileDevice() || isSlowConnection()), [enabledOverride])
  const [index, setIndex] = useState(0)
  const aspect = useViewportAspect()
  const zoomFactor = aspect < 0.75 ? 1.05 : 1

  useEffect(() => {
    if (!shouldEnable) return
    images.forEach((src) => {
      const img = new Image()
      img.src = src
    })
  }, [shouldEnable, images])

  useEffect(() => {
    if (!shouldEnable) return
    const id = setInterval(() => setIndex((i) => (i + 1) % images.length), cycleMs)
    return () => clearInterval(id)
  }, [shouldEnable, images.length, cycleMs])

  return { shouldEnable, index, images, zoomFactor }
}
