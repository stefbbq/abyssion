import { motion } from 'framer-motion'
import type { ActionZoneConfigNode, LayoutState } from './configurations/types.ts'
import { componentMap } from './componentMap.ts'
import { ActionZoneContainer } from './ActionZoneContainer.tsx'
import type { CSSProperties } from 'react'
import { actionZoneLayoutTransitions } from './configurations/index.ts'

type Props = {
  node: ActionZoneConfigNode
  keyPath?: string[]
  onAction?: (action: any) => void
  runtimeProps?: Record<string, unknown>
  layoutState?: LayoutState // Current layout state
  previousLayoutState?: LayoutState // Previous layout state for transitions
  onExitComplete?: () => void
}

/**
 * Recursively renders an ActionZone config node.
 * Uses a static componentMap to select the component by type string.
 * Falls back to motion.div if no match.
 *
 * @example
 * <ActionZoneRenderer node={configNode} keyPath={[]} />
 */
export const ActionZoneRenderer = (
  {
    node, //
    keyPath = [],
    onAction,
    runtimeProps = {},
    layoutState,
    previousLayoutState,
    onExitComplete,
  }: Props,
) => {
  const Component = (componentMap as Record<string, any>)[node.type] || motion.div

  if (!node) return null

  // Get layout transition-specific animation if transitioning
  let animation = node.animation
  if (previousLayoutState && layoutState && previousLayoutState !== layoutState && keyPath.length > 0) {
    const transitionKey = `${previousLayoutState}->${layoutState}` as keyof typeof actionZoneLayoutTransitions
    const layoutTransition = actionZoneLayoutTransitions[transitionKey]
    const childKey = keyPath[keyPath.length - 1] // Get the current element's key

    if (layoutTransition?.children && childKey in layoutTransition.children) {
      animation = layoutTransition.children[childKey as keyof typeof layoutTransition.children]
      console.log(`[ActionZoneRenderer] Using child transition for ${childKey}:`, animation)
    }
  }

  // Handle container (grid/slot logic)
  if (node.type === 'container') {
    return (
      <ActionZoneContainer
        style={{
          ...node.style,
          position: 'fixed',
          bottom: '1rem',
          left: '1rem',
          right: '1rem',
          zIndex: 50,
          paddingTop: '0.75rem',
          paddingBottom: '0.75rem',
          // Don't override height if it exists in node.style
        } as CSSProperties}
        layout={node.layout}
        childrenMap={node.children}
        animation={animation}
        keyPath={keyPath}
        onAction={onAction}
        runtimeProps={runtimeProps}
        layoutState={layoutState}
        previousLayoutState={previousLayoutState}
        onExitComplete={onExitComplete}
      />
    )
  }

  // Handle button
  if (node.type === 'button') {
    const buttonId = node.props?.key || node.props?.role || 'button'
    console.log('[ActionZoneRenderer] Rendering button:', {
      buttonId,
      nodeProps: node.props,
      keyPath,
      animation,
    })

    const buttonProps = {
      key: `${[...keyPath, 'button', buttonId].join('-')}`,
      state: node.props,
      ...animation,
      onAction,
      layoutId: node.props?.layoutId as string | undefined,
    }

    console.log('[ActionZoneRenderer] Button props:', buttonProps)
    return <Component {...buttonProps} />
  }

  // Handle menuButton (needs special props like button)
  if (node.type === 'menuButton') {
    const buttonId = node.props?.id || node.props?.label || 'menuButton'
    console.log('[ActionZoneRenderer] Rendering menuButton:', {
      buttonId,
      nodeProps: node.props,
      keyPath,
      animation,
    })

    // Create onClick handler for menu button
    const handleMenuButtonClick = (event: Event) => {
      event.preventDefault()
      event.stopPropagation()
      console.log('[ActionZoneRenderer] MenuButton clicked:', buttonId)

      if (onAction && buttonId) {
        onAction({
          type: 'navigate',
          href: `/${buttonId}`,
          id: buttonId,
        })
      }
    }

    const menuButtonProps = {
      key: `${[...keyPath, 'menuButton', buttonId].join('-')}`,
      id: buttonId,
      label: node.props?.label || buttonId,
      isActive: node.props?.isActive || false,
      onClick: handleMenuButtonClick,
      ...animation,
      layoutId: node.props?.layoutId as string | undefined,
    }

    console.log('[ActionZoneRenderer] MenuButton props:', menuButtonProps)
    return <Component {...menuButtonProps} />
  }

  // Handle other components (socialLinks, etc.)
  return (
    <Component
      key={keyPath.join('-') || node.type}
      {...(animation || {})}
      {...(node.props || {})}
      {...(node.type === 'button' ? { onAction } : {})}
    >
      {node.layout && Array.isArray(node.layout.slots) && node.layout.slots.map((childKey: string) => {
        const child = node.children?.[childKey]
        if (!child) return null

        console.log('[ActionZoneRenderer] rendering child', { childKey, keyPath: [...keyPath, childKey], child })
        return (
          <ActionZoneRenderer
            key={childKey}
            node={child}
            keyPath={[...keyPath, childKey]}
            {...{ onAction, runtimeProps, layoutState, previousLayoutState }}
          />
        )
      })}
    </Component>
  )
}
