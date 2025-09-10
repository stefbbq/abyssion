type Props = {
  /** image source */
  src: string
  /** image alt text */
  alt: string
  /** explicit container height (number treated as px, or any CSS length) */
  height?: number | string
  /** vertical focal point as a percentage from top (0-100), default 50 */
  yPosition?: number
}

/**
 * full-bleed image inside a `Shell`
 * allows setting a vertical focal point
 * applies -m-8 to the container to offset the padding of the `Shell`
 *
 * @example
 *   <ShellImage yPosition={26} src='/images/band_live.webp' alt='Abyssion live' />
 *   <ShellImage height='280px' yPosition={26} src='/images/band_live.webp' alt='Abyssion live' />
 */
export const ShellImage = ({ src, alt, height, yPosition }: Props) => {
  const containerStyle: Record<string, string | number> = {}
  containerStyle.height = height || '100%'
  const positionY = typeof yPosition === 'number' ? yPosition : 50

  return (
    <div class='relative -mx-8 overflow-hidden' style={containerStyle}>
      <img
        src={src}
        alt={alt}
        class='absolute inset-0 w-full h-full object-cover'
        style={{ objectPosition: `50% ${positionY}%` }}
      />
    </div>
  )
}
