import { motion } from 'framer-motion'
import { CSSProperties } from 'preact/compat'
import actionZoneAnimationConfig from '@organisms/actionZone.animation.ts'

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
  // filter out null/undefined values from style
  const filteredStyle = Object.fromEntries(Object.entries(style).filter(([_, v]) => v != null))
  return (
    <motion.button
      key={id}
      initial={actionZoneAnimationConfig.menuButtonVariants.initial}
      animate={actionZoneAnimationConfig.menuButtonVariants.animate}
      exit={actionZoneAnimationConfig.menuButtonVariants.exit}
      transition={undefined}
      // @ts-ignore - framer-motion types not fully compatible with Preact
      class='w-full h-12 flex items-center justify-center rounded-[24px] font-medium text-sm transition-colors'
      style={{
        backgroundColor: isActive ? '#fff' : 'transparent',
        color: isActive ? '#000' : '#fff',
        fontWeight: isActive ? 600 : 500,
        border: 'none',
        outline: 'none',
        ...filteredStyle,
      }}
      onClick={onClick}
      tabIndex={0}
    >
      {label}
    </motion.button>
  )
}
