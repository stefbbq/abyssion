import { useEffect, useRef, useState } from 'preact/hooks'
import { getTheme } from '@lib/theme/index.ts'
import { ComponentChildren } from 'preact'
import { AnimatePresence, motion } from 'framer-motion'

const COLLAPSED_HEIGHT = 80
const DRAG_THRESHOLD = 80

export interface ActionZoneProps {
  isMenuOpen: boolean
  setIsMenuOpen: (isOpen: boolean) => void
  collapsedChildren: ComponentChildren
  expandedChildren: ComponentChildren
  routeKey: string
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
  routeKey,
}: ActionZoneProps) {
  const navRef = useRef<HTMLElement>(null)
  const theme = getTheme()

  const showExpandedContent = isMenuOpen

  return (
    <>
      {/* overlay for expanded menu */}
      {showExpandedContent && (
        <div
          className='fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300'
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* bottom navigation container */}
      <motion.nav
        layout
        ref={navRef}
        // @ts-ignore - framer-motion types not fully compatible with Preact
        className={`fixed bottom-4 left-4 right-4 z-50 md:hidden overflow-hidden transition-all duration-300 ease-out`}
        animate={{
          height: isMenuOpen ? 'auto' : COLLAPSED_HEIGHT,
          borderRadius: isMenuOpen ? '24px' : '40px',
        }}
        initial={false}
        transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
        style={{
          backgroundColor: theme.glass.background,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        {/* drag handle for expanded menu */}
        {showExpandedContent && (
          <div className='flex justify-center pt-3 pb-2'>
            <div
              className='w-12 h-1 rounded-full'
              style={{ backgroundColor: theme.colors.text.tertiary }}
            />
          </div>
        )}

        <AnimatePresence mode='popLayout'>
          <motion.div
            key={isMenuOpen ? 'expanded' : routeKey}
            // @ts-ignore - framer-motion types not fully compatible with Preact
            className='max-w-md mx-auto'
          >
            {showExpandedContent ? expandedChildren : collapsedChildren}
          </motion.div>
        </AnimatePresence>
      </motion.nav>
    </>
  )
}
