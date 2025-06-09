import { FunctionalComponent } from 'preact'

/**
 * ActionZoneFadeout
 * Renders a fixed-position, pointer-events-none fadeout overlay above the ActionZone.
 * Configurable for height, gradient start/end, color, bottom offset, and zIndex.
 */
type Props = {
  height?: number // height in px
  gradientStart?: number // percent (0-100)
  gradientEnd?: number // percent (0-100)
  color?: string // CSS color
  bottom?: number // px offset from bottom
  zIndex?: number
}

export const ActionZoneFadeout: FunctionalComponent<Props> = ({
  height = 48,
  gradientStart = 0,
  gradientEnd = 90,
  color = '#111',
  bottom = 80,
  zIndex = 49,
}) => (
  <div
    style={{
      position: 'fixed',
      left: 0,
      right: 0,
      bottom: bottom + 'px',
      height: height + 'px',
      pointerEvents: 'none',
      zIndex,
      background: `
        linear-gradient(to bottom, rgba(0,0,0,0) ${gradientStart}%, ${color} ${gradientEnd}%),
        url('/noise.png')
      `,
      backgroundSize: `100% 100%, 200px 200px`,
      backgroundRepeat: `no-repeat, repeat`,
    }}
  />
)
