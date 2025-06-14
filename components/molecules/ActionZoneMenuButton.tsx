import { motion } from 'framer-motion'
import { CSSProperties } from 'preact/compat'

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
  return (
    <motion.button
      key={id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className='w-full h-12 flex items-center justify-center rounded-[24px] font-medium text-sm transition-colors'
      style={{
        backgroundColor: isActive ? '#fff' : 'transparent',
        color: isActive ? '#000' : '#fff',
        fontWeight: isActive ? 600 : 500,
        border: 'none',
        outline: 'none',
        ...style,
      }}
      onClick={onClick}
      tabIndex={0}
    >
      {label}
    </motion.button>
  )
}
