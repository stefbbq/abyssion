import { useRef } from 'preact/hooks'
import { getTheme } from '@lib/theme/index.ts'
import { ComponentChildren } from 'preact'
import { AnimatePresence, motion } from 'framer-motion'
import { animationStyleFunctions } from '@lib/utils/actionZoneAnimationStyles.ts'

type Props = {
  isMenuOpen: boolean
  setIsMenuOpen: (isOpen: boolean) => void
  collapsedChildren: ComponentChildren
  expandedChildren: ComponentChildren
  routeKey: string
  /**
   * animationConfig: settings for framer-motion transition, from config
   */
  animationConfig?: Record<string, any>
  layoutConfig?: Record<string, any>
}

function resolveConfigValue(value: any) {
  if (typeof value === 'string' && value.endsWith('()')) {
    const fnName = value.replace('()', '')
    return (animationStyleFunctions as Record<string, (...args: any[]) => any>)[fnName]?.()
  }
  return value
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
  animationConfig = {},
  layoutConfig = {},
}: Props) {
  const navRef = useRef<HTMLElement>(null)
  const theme = getTheme()
  const showExpandedContent = isMenuOpen
  const height = resolveConfigValue(layoutConfig.height)
  const borderRadius = resolveConfigValue(layoutConfig.borderRadius)

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
      <motion.nav
        layout
        ref={navRef}
        // @ts-ignore - framer-motion types not fully compatible with Preact
        className={`fixed bottom-4 left-4 right-4 z-50 py-3 rounded-[40px] md:hidden overflow-hidden`}
        animate={{
          height,
          borderRadius,
        }}
        initial={false}
        transition={animationConfig}
        style={{
          backgroundColor: theme.glass.background,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px 0 rgba(0,0,0,0.25)',
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
