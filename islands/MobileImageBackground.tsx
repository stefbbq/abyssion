import { useParallax } from '@lib/ui/useParallax.ts'
import { useMobileBackground } from '@lib/ui/useMobileBackground.ts'

export default function MobileImageBackground({ enabledOverride }: { enabledOverride?: boolean }) {
  const { shouldEnable, index, images } = useMobileBackground(enabledOverride)
  const parallaxY = useParallax(shouldEnable, { driftSpeed: 0, scrollFactor: -0.01 })

  if (!shouldEnable) return null

  const totalY = parallaxY

  return (
    <div
      class='fixed inset-0 -z-20'
      style={{
        backgroundImage: `url(${images[index]})`,
        transform: `scale(1.2)`,
        backgroundPosition: `center calc(50% + ${totalY}px)`,
        backgroundRepeat: 'no-repeat',
      }}
      aria-hidden='true'
    />
  )
}
