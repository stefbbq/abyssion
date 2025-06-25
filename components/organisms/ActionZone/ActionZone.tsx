import { ActionZoneRenderer } from './ActionZoneRenderer.tsx'
import type { ActionZoneConfigNode, LayoutState } from './configurations/types.ts'

/**
 * ActionZone
 * Uses the recursive ActionZoneRenderer system for fully config-driven rendering and animation.
 * Now uses layout-based transitions instead of route-based transitions.
 *
 * @example
 * <ActionZone isMenuOpen={...} setIsMenuOpen={...} layoutState='collapsed' />
 */
type Props = {
  isMenuOpen: boolean
  setIsMenuOpen: (isOpen: boolean) => void
  node: ActionZoneConfigNode
  onAction?: (action: unknown) => void
  runtimeProps?: Record<string, unknown>
  layoutType: LayoutState
  previousLayoutState?: LayoutState
  onExitComplete?: () => void
}

export default function ActionZone({
  isMenuOpen,
  setIsMenuOpen,
  node,
  onAction,
  runtimeProps = {},
  layoutType,
  previousLayoutState,
  onExitComplete,
}: Props) {
  return (
    <>
      {/* overlay for expanded menu */}
      {isMenuOpen && (
        <div
          className='fixed inset-0 bg-black/50 z-40 md:hidden'
          onClick={() => {
            console.log('[ActionZone] Overlay clicked - closing menu')
            setIsMenuOpen(false)
          }}
        />
      )}

      {/* main ActionZone container, fully config-driven */}
      <ActionZoneRenderer
        keyPath={[layoutType]}
        layoutState={layoutType}
        previousLayoutState={previousLayoutState}
        {...{ onAction, runtimeProps, node, onExitComplete }}
      />
    </>
  )
}
