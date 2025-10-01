type Props = {
  /** image source */
  src: string
  /** image alt text */
  alt: string
  /** known image intrinsic width */
  width?: number
  /** known image intrinsic height */
  /** explicit container height (number treated as px, or any CSS length) */
  height?: number | string
  /** responsive sources */
  srcSet?: string
  /** sizes descriptor for responsive images */
  sizes?: string
  /** vertical focal point as a percentage from top (0-100), default 50 */
  yPosition?: number
  /** placement of the image within the container, default 'bottom' */
  placement?: 'top' | 'bottom'
  /** loading behavior for the image; default 'lazy' */
  loading?: 'lazy' | 'eager'
  /** fetch priority hint for the image */
  fetchpriority?: 'high' | 'low' | 'auto'
  /** image decoding hint; default 'async' */
  decoding?: 'async' | 'sync' | 'auto'
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
export const ShellImage = (
  { src, alt, width, height, srcSet, sizes, yPosition, placement, loading = 'lazy', fetchpriority = 'auto', decoding = 'async' }: Props,
) => {
  const containerStyle: Record<string, string | number> = {}

  containerStyle.height = height || '100%'

  const positionY = typeof yPosition === 'number' ? yPosition : 50
  const classNames = `relative -mx-8 overflow-hidden ${placement === 'top' ? '!-mt-8' : ''}`
  const extraAttrs: Record<string, string> = { fetchpriority }

  return (
    <div class={classNames} style={containerStyle}>
      <img
        {...{ src, alt, loading, decoding, width, srcset: srcSet, sizes, ...extraAttrs }}
        class='absolute inset-0 w-full h-full object-cover'
        style={{ objectPosition: `50% ${positionY}%` }}
      />
    </div>
  )
}
