import { useEffect, useState } from 'preact/hooks'

export type UseScrollMaskOptions = {
  topFadeStartPx?: number
  bottomFadeStartPx?: number
  solidBandPx?: number
}

/**
 * computes a top/bottom gradient mask style that follows the scroll position
 */
export const useScrollMask = (enabled: boolean, options: UseScrollMaskOptions = {}) => {
  const { topFadeStartPx = 35, bottomFadeStartPx = 65, solidBandPx = 150 } = options
  const [style, setStyle] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!enabled) return

    const updateMask = () => {
      const scrollY = Math.max(0, globalThis.scrollY || 0)
      const docEl = globalThis.document?.documentElement
      const scrollHeight = docEl?.scrollHeight || 0
      const clientHeight = docEl?.clientHeight || globalThis.innerHeight || 0
      const maxScroll = Math.max(1, scrollHeight - clientHeight)
      const progress = Math.min(1, Math.max(0, scrollY / maxScroll))
      const fromBottom = Math.abs(progress * maxScroll - maxScroll)

      const topStart = Math.max(0, topFadeStartPx - scrollY)
      const bottomStart = Math.max(0, bottomFadeStartPx - fromBottom)

      const mask = `linear-gradient(
        to bottom,
        rgba(0,0,0,0) ${topStart}px,
        rgba(0,0,0,1) ${solidBandPx}px,
        rgba(0,0,0,1) calc(100% - ${solidBandPx}px),
        rgba(0,0,0,0) calc(100% - ${bottomStart}px)
      )`

      setStyle({
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
  }, [enabled, topFadeStartPx, bottomFadeStartPx, solidBandPx])

  return style
}
