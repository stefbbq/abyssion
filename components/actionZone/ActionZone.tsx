import { useRef } from 'preact/hooks'
import { ComponentChildren } from 'preact'

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
 * Delegates specific responsibilities to specialized organisms.
 * Features theme-aware surface styling and border radius - always visible like header.
 */
export const ActionZone = ({
  isMenuOpen,
  setIsMenuOpen,
  collapsedChildren,
  expandedChildren,
  layoutConfig = {},
}: Props) => {
  const navRef = useRef<HTMLElement>(null)
  const showExpandedContent = isMenuOpen
  const height = typeof layoutConfig.height === 'function' ? layoutConfig.height() : undefined
  const borderRadius = typeof layoutConfig.borderRadius === 'function' ? layoutConfig.borderRadius() : undefined

  return (
    <>
      {/* overlay for expanded menu */}
      {showExpandedContent && (
        <div
          className='fixed inset-0 bg-black/50 z-40 md:hidden'
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* bottom navigation container */}
      <nav
        ref={navRef}
        className='fixed bottom-4 left-4 right-4 z-50 py-2 rounded-theme-full md:hidden overflow-hidden surface-header shadow-[0_8px_32px_0_rgba(0,0,0,0.25)]'
        style={{
          height,
          borderRadius,
        }}
      >
        <div className='max-w-sm mx-auto'>
          {showExpandedContent ? expandedChildren : collapsedChildren}
        </div>
      </nav>
    </>
  )
}
