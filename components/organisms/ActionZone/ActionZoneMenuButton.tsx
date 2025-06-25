import { motion, MotionProps, MotionStyle } from 'framer-motion'
import { CSSProperties } from 'preact/compat'
import { filterNullishValues } from '@lib/utils/filterNullishValues.ts'

type Props = {
  id: string
  label: string
  isActive?: boolean
  onClick: () => void
  style?: CSSProperties
  animation?: MotionProps
}

/**
 * ActionZoneMenuButton
 * Dedicated button for expanded menu items (no border, no outline, fade-in)
 */
export const ActionZoneMenuButton = ({ id, label, isActive = false, onClick, style = {}, animation, ...rest }: Props) => {
  const defaultStyle = {
    height: '48px',
    borderRadius: 24,
    backgroundColor: isActive ? '#fff' : 'transparent',
    color: isActive ? '#000' : '#fff',
    fontWeight: isActive ? 600 : 500,
    border: 'none',
    outline: 'none',
    fontSize: '15px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...style,
  }

  // merge style defaults with incoming style
  const mergedStyle = { ...defaultStyle, ...style }

  // filter out null/undefined values from mergedStyle
  const filteredStyle = filterNullishValues(mergedStyle) as MotionStyle

  return (
    <motion.button
      key={id}
      // @ts-ignore - Framer Motion types are not compatible with Tailwind CSS classes
      className='w-full flex items-center justify-center rounded-[24px] font-medium text-sm transition-colors'
      style={filteredStyle}
      tabIndex={0}
      onClick={(event: MouseEvent) => {
        event.preventDefault()
        event.stopPropagation()
        console.log('[ActionZoneMenuButton] Menu button clicked, prevented propagation:', { id, label })
        onClick()
      }}
      {...{ animation, ...rest }}
    >
      {label}
    </motion.button>
  )
}
