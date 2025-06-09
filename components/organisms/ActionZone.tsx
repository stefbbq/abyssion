import { useEffect, useRef, useState } from 'preact/hooks'
import { getTheme } from '@lib/theme/index.ts'
import { ComponentChildren } from 'preact'
import { AnimatePresence, motion } from 'framer-motion'

const EXPANDED_HEIGHT = 400
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
  const [isDragging, setIsDragging] = useState(false)
  const [dragY, setDragY] = useState(0)
  const [startY, setStartY] = useState(0)
  const navRef = useRef<HTMLElement>(null)
  const theme = getTheme()

  const handleTouchStart = (e: TouchEvent) => {
    const target = e.target as HTMLElement
    if (target.closest('button') || target.closest('a')) return

    e.preventDefault()
    setIsDragging(true)
    setStartY(e.touches[0].clientY)
    setDragY(0)
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return
    e.preventDefault()

    const currentY = e.touches[0].clientY
    const deltaY = currentY - startY

    if (isMenuOpen) {
      const newDragY = Math.max(0, Math.min(EXPANDED_HEIGHT - COLLAPSED_HEIGHT, deltaY))
      setDragY(newDragY)
    } else {
      const newDragY = Math.min(0, Math.max(-(EXPANDED_HEIGHT - COLLAPSED_HEIGHT), deltaY))
      setDragY(newDragY)
    }
  }

  const handleTouchEnd = (e: TouchEvent) => {
    if (!isDragging) return
    e.preventDefault()

    if (isMenuOpen && dragY > DRAG_THRESHOLD) setIsMenuOpen(false)
    else if (!isMenuOpen && dragY < -DRAG_THRESHOLD) setIsMenuOpen(true)

    setIsDragging(false)
    setDragY(0)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('touchmove', handleTouchMove, { passive: false })
      document.addEventListener('touchend', handleTouchEnd, { passive: false })

      return () => {
        document.removeEventListener('touchmove', handleTouchMove)
        document.removeEventListener('touchend', handleTouchEnd)
      }
    }
  }, [isDragging, isMenuOpen, startY, dragY])

  const getCurrentHeight = () => {
    if (isDragging) {
      if (isMenuOpen) return EXPANDED_HEIGHT - dragY
      else return COLLAPSED_HEIGHT + Math.abs(dragY)
    }

    return isMenuOpen ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT
  }

  const showExpandedContent = isMenuOpen || (isDragging && Math.abs(dragY) > 30)

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
        style={{
          height: `${getCurrentHeight()}px`,
          backgroundColor: theme.glass.background,
          borderRadius: showExpandedContent ? '24px' : '40px',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
        onTouchStart={handleTouchStart}
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
            className='max-w-md mx-auto h-full'
          >
            {showExpandedContent ? expandedChildren : collapsedChildren}
          </motion.div>
        </AnimatePresence>
      </motion.nav>
    </>
  )
}
