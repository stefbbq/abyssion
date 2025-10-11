import { useEffect, useState } from 'preact/hooks'
import { ComponentChildren } from 'preact'

import { Shell } from '@components/Shell.tsx'
import uiConfig from '@data/ui-config.json' with { type: 'json' }

type Props = {
  isMenuOpen: boolean
  setIsMenuOpen: (isOpen: boolean) => void
  collapsedChildren: ComponentChildren
  expandedChildren: ComponentChildren
  layoutConfig?: Record<string, unknown>
}

/**
 * ActionZone component
 * Main navigation coordinator that orchestrates collapsed and expanded states.
 * Follows Header's structure with conditional background and Shell container.
 * Features fade animations between collapsed and expanded states.
 * Features theme-aware surface styling and border radius - always visible like header.
 */
export const ActionZone = ({
  isMenuOpen,
  setIsMenuOpen,
  collapsedChildren,
  expandedChildren,
  layoutConfig = {},
}: Props) => {
  const [showCollapsed, setShowCollapsed] = useState(true)
  const [showExpanded, setShowExpanded] = useState(false)
  const [containerExpanded, setContainerExpanded] = useState(false)
  const collapsedHeight = typeof layoutConfig.height === 'function' ? layoutConfig.height() : uiConfig.actionZone.collapsedHeightPx
  const borderRadius = typeof layoutConfig.borderRadius === 'function' ? layoutConfig.borderRadius() : undefined

  // sequential animation: fade out first, expand container, then fade in
  useEffect(() => {
    if (isMenuOpen) {
      setShowCollapsed(false)
      setTimeout(() => setContainerExpanded(true), uiConfig.actionZone.expandDelayMs)
      setTimeout(() => setShowExpanded(true), uiConfig.actionZone.fadeInMs)
    } else {
      setShowExpanded(false)
      setTimeout(() => setContainerExpanded(false), uiConfig.actionZone.collapseDelayMs)
      setTimeout(() => setShowCollapsed(true), uiConfig.actionZone.fadeOutMs)
    }
  }, [isMenuOpen])

  // shell container classes with height transition
  const shellClasses =
    'fixed bottom-4 left-3 right-3 z-50 md:hidden mx-auto flex items-center justify-center transition-all duration-300 overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.25)] p-2'

  return (
    <>
      {/* overlay for expanded menu */}
      {isMenuOpen && (
        <div
          className='fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300'
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* bottom navigation wrapper */}
      <Shell
        as='nav'
        className={shellClasses}
        style={{
          maxHeight: containerExpanded ? `${uiConfig.actionZone.expandedMaxHeightPx}px` : `${collapsedHeight}px`,
          borderRadius,
        }}
      >
        {/* collapsed state */}
        <div className={`absolute inset-0 transition-opacity duration-300 ${!showCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          {collapsedChildren}
        </div>

        {/* expanded state */}
        <div className={`transition-opacity duration-300 ${showExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          {expandedChildren}
        </div>
      </Shell>
    </>
  )
}
