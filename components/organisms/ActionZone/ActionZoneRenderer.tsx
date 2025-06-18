import { motion } from 'framer-motion'
import type { ActionZoneConfigNode } from './configurations/types.ts'
import { componentMap } from './componentMap.ts'
import { ActionZoneGrid } from '@molecules/ActionZoneGrid.tsx'

/**
 * Props for ActionZoneRenderer
 */
type ActionZoneRendererProps = {
  node: ActionZoneConfigNode
  keyPath?: string[]
  onAction?: (action: any) => void
  runtimeProps?: Record<string, unknown>
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
  { node, keyPath = [], onAction, runtimeProps = {} }: ActionZoneRendererProps,
) => {
  if (!node) return null

  const Component = (componentMap as Record<string, any>)[node.type] || motion.div

  // on grid
  if (node.layout && typeof node.layout === 'object' && node.layout.grid && node.layout.slots) {
    return (
      <ActionZoneGrid
        node={node}
        keyPath={keyPath}
        onAction={onAction}
        runtimeProps={runtimeProps}
      />
    )
  }

  // on button
  if (node.type === 'button') {
    return (
      <Component
        key={keyPath.join('-') || node.type}
        state={node.props}
        onAction={onAction}
      />
    )
  }

  // on container
  return (
    <Component
      key={keyPath.join('-') || node.type}
      {...(node.animation || {})}
      {...(node.props || {})}
      {...(node.type === 'button' ? { onAction } : {})}
    >
      {node.layout && Array.isArray(node.layout.slots) &&
        node.layout.slots.map((childKey: string) => {
          const child = node.children?.[childKey]
          if (!child) return null
          return (
            <ActionZoneRenderer
              key={childKey}
              node={child}
              keyPath={[...keyPath, childKey]}
              onAction={onAction}
              runtimeProps={runtimeProps}
            />
          )
        })}
    </Component>
  )
}
