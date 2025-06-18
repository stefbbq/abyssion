import { ActionZoneRenderer } from './ActionZoneRenderer.tsx'
import type { ActionZoneConfigNode } from './configurations/types.ts'
import { AnimatePresence } from 'framer-motion'

/**
 * ActionZone component (refactored)
 * Uses the recursive ActionZoneRenderer system for fully config-driven rendering and animation.
 *
 * @example
 * <ActionZone isMenuOpen={...} setIsMenuOpen={...} routeKey={...} layoutType='collapsed' />
 */
type Props = {
  isMenuOpen: boolean
  setIsMenuOpen: (isOpen: boolean) => void
  node: ActionZoneConfigNode
  onAction?: (action: unknown) => void
  runtimeProps?: Record<string, unknown>
}

export default function ActionZone({
  isMenuOpen,
  setIsMenuOpen,
  node,
  onAction,
  runtimeProps = {},
}: Props) {
  return (
    <>
      overlay for expanded menu
      {isMenuOpen && (
        <div
          className='fixed inset-0 bg-black/50 z-40 md:hidden'
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* main ActionZone container, fully config-driven */}
      <AnimatePresence mode='wait'>
        <ActionZoneRenderer node={node} keyPath={[]} onAction={onAction} {...runtimeProps} />
      </AnimatePresence>
    </>
  )
}
