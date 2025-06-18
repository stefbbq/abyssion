import { ActionZoneContainer } from '@atoms/ActionZoneContainer.tsx'
import type { ActionZoneConfigNode, ActionZoneGridLayout } from '@organisms/ActionZone/configurations/types.ts'
import { ActionZoneRenderer } from '@organisms/ActionZone/ActionZoneRenderer.tsx'

type Props = {
  node: ActionZoneConfigNode
  keyPath: string[]
  onAction?: (action: any) => void
  runtimeProps?: Record<string, unknown>
}

export const ActionZoneGrid = ({ node, keyPath, onAction, runtimeProps = {} }: Props) => {
  const layout = node.layout as ActionZoneGridLayout
  const { slots, gridTemplateRows, gridTemplateColumns, gap, justifyContent, alignItems } = layout
  const theme = runtimeProps.theme
  const styleOverrides = {
    backgroundColor: node.style?.backgroundColor ?? theme?.glass?.background,
    borderRadius: node.style?.borderRadius as number | string | undefined,
    height: node.style?.height as number | string | undefined,
    gridTemplateRows,
    gridTemplateColumns,
    gap,
    justifyContent,
    alignItems,
    ...node.style,
  } as React.CSSProperties

  return (
    <ActionZoneContainer
      key={keyPath.join('-') || node.type}
      style={styleOverrides}
      {...(node.animation ? { animation: node.animation } : {})}
      className='fixed bottom-4 left-4 right-4 z-50 py-3 md:hidden overflow-hidden'
    >
      {slots.map((slotKey: string) => {
        const childNode = node.children?.[slotKey]
        if (!childNode) return null
        return (
          <ActionZoneRenderer
            key={slotKey}
            node={childNode}
            keyPath={[...keyPath, slotKey]}
            onAction={onAction}
            runtimeProps={runtimeProps}
          />
        )
      })}
    </ActionZoneContainer>
  )
}

export default ActionZoneGrid
