import { useParallax } from '@lib/ui/useParallax.ts'
import { useMobileBackground } from '@lib/ui/useMobileBackground.ts'
import configVideoCycle from '@lib/gl/configVideoCycle.json' with { type: 'json' }

export default function MobileImageBackground({ enabledOverride }: { enabledOverride?: boolean }) {
  const { shouldEnable, index, images, zoomFactor } = useMobileBackground(enabledOverride)
  const parallaxY = useParallax(shouldEnable, { driftSpeed: 0, scrollFactor: -0.01 })

  if (!shouldEnable) return null

  const totalY = parallaxY

  return (
    <div
      class='fixed inset-0 -z-20'
      style={{
        backgroundImage: `url(${images[index]})`,
        backgroundSize: `auto ${120 * zoomFactor}vh`,
        backgroundPosition: `center calc(50% + ${totalY}px)`,
        backgroundRepeat: 'no-repeat',
        opacity: configVideoCycle.appearance.opacity,
      }}
      aria-hidden='true'
    />
  )
}
