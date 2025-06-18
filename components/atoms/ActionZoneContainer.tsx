import { motion, type MotionStyle } from 'framer-motion'
import type { CSSProperties, ReactNode } from 'react'
import type { ActionZoneAnimationVariant } from '@organisms/ActionZone/configurations/types.ts'

/**
 * ActionZoneContainer
 * Atom for the fixed, blurred, rounded ActionZone nav bar container.
 * Applies default nav bar styles and merges with incoming style prop (incoming style always wins).
 * Forwards className, animation, and children to motion.div.
 */
type Props = {
  style?: CSSProperties
  className?: string
  animation?: ActionZoneAnimationVariant
  children: ReactNode
}

export const ActionZoneContainer = ({ style = {}, className = '', animation, children }: Props) => {
  // default nav bar styles
  const defaultStyle: CSSProperties = {
    backgroundColor: 'rgba(20,20,20,0.85)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    boxShadow: '0 8px 32px 0 rgba(0,0,0,0.25)',
    borderRadius: 40,
    width: '90%',
    margin: '0 auto',
    padding: '0 1rem',
    display: 'grid',
  }
  // merge defaults with incoming style (incoming style wins)
  const mergedStyle = { ...defaultStyle, ...style }

  return (
    <motion.div
      style={mergedStyle as MotionStyle}
      {...(animation && animation.initial && animation.animate ? animation : {})}
      // @ts-ignore - Framer Motion types are not compatible with Tailwind CSS classes
      className={className}
    >
      {children}
    </motion.div>
  )
}
