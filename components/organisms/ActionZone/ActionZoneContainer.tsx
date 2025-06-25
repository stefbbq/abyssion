import { AnimatePresence, motion, type MotionStyle } from 'framer-motion'
import type { CSSProperties, ReactNode } from 'react'
import type {
  ActionZoneAnimationVariant,
  ActionZoneConfigNode,
  ActionZoneGridLayout,
  LayoutState,
} from '@organisms/ActionZone/configurations/types.ts'
import { ActionZoneRenderer } from '@organisms/ActionZone/ActionZoneRenderer.tsx'
import { actionZoneLayoutTransitions } from '@organisms/ActionZone/configurations/index.ts'
import { collapsedBorderRadius, collapsedHeight, expandedBorderRadius, expandedHeight } from '@organisms/ActionZone/constants.ts'

/**
 * ActionZoneContainer
 * Container for the ActionZone with layout morphing support.
 * Uses Framer Motion's layout prop and layoutId for smooth transitions between layout states.
 */
type Props = {
  style?: CSSProperties
  className?: string
  animation?: ActionZoneAnimationVariant
  layout?: ActionZoneGridLayout
  childrenMap?: Record<string, ActionZoneConfigNode>
  keyPath?: string[]
  onAction?: (action: any) => void
  runtimeProps?: Record<string, unknown>
  layoutState?: LayoutState // Current layout state
  previousLayoutState?: LayoutState // Previous layout state for transitions
  onExitComplete?: () => void
  children?: ReactNode
}

export const ActionZoneContainer = ({
  style = {},
  className = '',
  animation,
  layout,
  childrenMap,
  keyPath = [],
  onAction,
  runtimeProps = {},
  layoutState,
  previousLayoutState,
  onExitComplete,
  children,
}: Props) => {
  // Compute grid styles if layout is provided
  let gridStyles: CSSProperties = {}
  if (layout) {
    gridStyles = {
      display: 'grid',
      gridTemplateRows: layout.gridTemplateRows,
      gridTemplateColumns: layout.gridTemplateColumns,
      gap: layout.gap,
      justifyContent: layout.justifyContent,
      alignItems: layout.alignItems,
    }
  }

  // Get theme from runtimeProps
  const theme = runtimeProps?.theme as any

  // Get layout transition animation if transitioning
  let layoutTransitionAnimation = animation
  if (previousLayoutState && layoutState && previousLayoutState !== layoutState) {
    const transitionKey = `${previousLayoutState}->${layoutState}` as keyof typeof actionZoneLayoutTransitions
    const layoutTransition = actionZoneLayoutTransitions[transitionKey]
    if (layoutTransition?.container) {
      layoutTransitionAnimation = layoutTransition.container
      console.log(`[ActionZoneContainer] Using layout transition: ${transitionKey}`, layoutTransition.container)
    }
  }

  // Check if we have any animation that controls height (more reliable than state comparison)
  const hasHeightAnimation = layoutTransitionAnimation?.animate &&
    'height' in (layoutTransitionAnimation.animate as any)

  console.log(`[ActionZoneContainer] Animation detection:`, {
    hasAnimation: !!layoutTransitionAnimation,
    hasHeightAnimation,
    animateProps: layoutTransitionAnimation?.animate,
    layoutState,
    previousLayoutState,
  })

  // Determine height based on layout state
  const containerHeight = layoutState === 'expanded' ? expandedHeight : collapsedHeight
  const containerBorderRadius = layoutState === 'expanded' ? expandedBorderRadius : collapsedBorderRadius

  // Default nav bar styles
  const defaultStyle: CSSProperties = {
    backgroundColor: theme?.glass?.background || 'rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(14px)',
    WebkitBackdropFilter: 'blur(14px)',
    boxShadow: '0 8px 32px 0 rgba(0,0,0,0.25)',
    borderRadius: containerBorderRadius,
    width: '90%',
    margin: '0 auto',
    padding: '0 1rem',
    height: containerHeight, // Always set height based on state
  }

  // Merge defaults with incoming style (incoming style wins)
  const mergedStyle = { ...defaultStyle, ...gridStyles, ...style }

  console.log(`[ActionZoneContainer] Style debug:`, {
    layoutState,
    previousLayoutState,
    hasHeightAnimation,
    defaultStyleHeight: defaultStyle.height,
    animationAnimate: layoutTransitionAnimation?.animate,
    mergedStyleHeight: mergedStyle.height,
  })

  return (
    <motion.div
      layout // Enable automatic layout animations
      layoutId='action-zone-container'
      key={`${keyPath.join('-')}-container`}
      style={mergedStyle as MotionStyle}
      initial={layoutTransitionAnimation?.initial}
      animate={layoutTransitionAnimation?.animate}
      exit={layoutTransitionAnimation?.exit}
      transition={layoutTransitionAnimation?.transition}
      onAnimationComplete={onExitComplete}
    >
      <AnimatePresence mode='wait' key={`${keyPath.join('-')}-animatePresence`}>
        {layout && childrenMap
          ? layout.slots.map((slotKey: string) => {
            const node = childrenMap[slotKey]

            console.log(`[ActionZoneContainer] Rendering slot:`, {
              slotKey,
              hasNode: !!node,
              nodeType: node?.type,
              layoutState,
            })

            if (!node) return null
            return (
              <ActionZoneRenderer
                key={`${[...(keyPath || []), 'container', slotKey].join('-')}`}
                keyPath={[...(keyPath || []), 'container', slotKey]}
                {...{ node, onAction, runtimeProps, layoutState, previousLayoutState }}
              />
            )
          })
          : children}
      </AnimatePresence>
    </motion.div>
  )
}
