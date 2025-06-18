import { motion, MotionStyle } from 'framer-motion'
import { CSSProperties } from 'preact/compat'
import { filterNullishValues } from '@lib/utils/filterNullishValues.ts'

type Props = {
  id: string
  label: string
  isActive?: boolean
  onClick: () => void
  style?: CSSProperties
}

/**
 * ActionZoneMenuButton
 * Dedicated button for expanded menu items (no border, no outline, fade-in)
 */
export const ActionZoneMenuButton = ({ id, label, isActive = false, onClick, style = {} }: Props) => {
  // merge style defaults with incoming style
  const mergedStyle = {
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

  // filter out null/undefined values from mergedStyle
  const filteredStyle = filterNullishValues(mergedStyle) as MotionStyle

  return (
    <motion.button
      key={id}
      // @ts-ignore - Framer Motion types are not compatible with Tailwind CSS classes
      className='w-full flex items-center justify-center rounded-[24px] font-medium text-sm transition-colors'
      style={filteredStyle}
      onClick={onClick}
      tabIndex={0}
    >
      {label}
    </motion.button>
  )
}
