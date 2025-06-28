import { useRef } from 'preact/hooks'
import { getTheme } from '@lib/theme/index.ts'
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
 *
 * Main navigation coordinator that orchestrates collapsed and expanded states
 * Delegates specific responsibilities to specialized organisms
 */
export default function ActionZone({
  isMenuOpen,
  setIsMenuOpen,
  collapsedChildren,
  expandedChildren,
  layoutConfig = {},
}: Props) {
  const navRef = useRef<HTMLElement>(null)
  const theme = getTheme()
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
        className={`md:hidden fixed bottom-4 left-4 right-4 z-50 py-3 rounded-[40px] md:hidden overflow-hidden`}
        style={{
          height,
          borderRadius,
          backgroundColor: theme.glass.background,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px 0 rgba(0,0,0,0.25)',
        }}
      >
        <div className='max-w-md mx-auto'>
          {showExpandedContent ? expandedChildren : collapsedChildren}
        </div>
      </nav>
    </>
  )
}
