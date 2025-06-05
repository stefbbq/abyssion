import { useEffect, useRef, useState } from 'preact/hooks'
import { useSignal } from '@preact/signals'
import { getUITheme } from '../lib/theme/index.ts'
import { CollapsedNav, ExpandedMenu } from '../molecules/index.ts'
import { getButtonStates, NAV_CONFIG } from '../utils/index.ts'

export interface BottomNavProps {
  currentPath?: string
}

/**
 * BottomNav organism
 * Main navigation coordinator that orchestrates collapsed and expanded states
 * Delegates specific responsibilities to specialized organisms
 */
export default function BottomNav({ currentPath }: BottomNavProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragY, setDragY] = useState(0)
  const [startY, setStartY] = useState(0)
  const navRef = useRef<HTMLElement>(null)
  const theme = getUITheme()

  // track current path reactively
  const currentRoute = useSignal(currentPath || '/')

  // update route when Fresh Partials navigation occurs
  useEffect(() => {
    const handleNavigate = () => {
      const newPath = window.location.pathname
      console.log(`🚀 Navigation detected: ${currentRoute.value} -> ${newPath}`)
      currentRoute.value = newPath
    }

    // listen for Fresh Partials navigation events
    document.addEventListener('DOMContentLoaded', handleNavigate)
    window.addEventListener('popstate', handleNavigate)

    // also listen for pushstate/replacestate which Fresh Partials might use
    const originalPushState = history.pushState
    const originalReplaceState = history.replaceState

    history.pushState = function (...args) {
      originalPushState.apply(history, args)
      handleNavigate()
    }

    history.replaceState = function (...args) {
      originalReplaceState.apply(history, args)
      handleNavigate()
    }

    // watch for Fresh Partials navigation by observing URL changes
    const checkForNavigation = () => {
      if (currentRoute.value !== window.location.pathname) {
        handleNavigate()
      }
    }

    // poll for URL changes as backup for Fresh Partials
    const pollInterval = setInterval(checkForNavigation, 100)

    return () => {
      document.removeEventListener('DOMContentLoaded', handleNavigate)
      window.removeEventListener('popstate', handleNavigate)
      history.pushState = originalPushState
      history.replaceState = originalReplaceState
      clearInterval(pollInterval)
    }
  }, [])

  // calculate button states based on current route
  const buttonStates = getButtonStates(currentRoute.value)

  // drag gesture handlers
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
    const EXPANDED_HEIGHT = 400
    const COLLAPSED_HEIGHT = 80

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

    const DRAG_THRESHOLD = 80
    if (isMenuOpen && dragY > DRAG_THRESHOLD) {
      setIsMenuOpen(false)
    } else if (!isMenuOpen && dragY < -DRAG_THRESHOLD) {
      setIsMenuOpen(true)
    }

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

  // action handlers
  const handleAction = (action: any) => {
    switch (action.type) {
      case 'back':
        window.history.back()
        break
      case 'menu':
        setIsMenuOpen(!isMenuOpen)
        break
      case 'navigate':
        // handled by BaseButton href in NavButton
        break
    }
  }

  const handleAnchorLink = (path: string) => {
    if (path.startsWith('#')) {
      const element = document.querySelector(path)
      element?.scrollIntoView({ behavior: 'smooth' })
      setIsMenuOpen(false)
      return true
    }
    return false
  }

  // layout calculations
  const EXPANDED_HEIGHT = 400
  const COLLAPSED_HEIGHT = 80

  const getCurrentHeight = () => {
    if (isDragging) {
      if (isMenuOpen) {
        return EXPANDED_HEIGHT - dragY
      } else {
        return COLLAPSED_HEIGHT + Math.abs(dragY)
      }
    }
    return isMenuOpen ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT
  }

  const showExpandedContent = isMenuOpen || (isDragging && Math.abs(dragY) > 30)

  return (
    <>
      {/* overlay for expanded menu */}
      {showExpandedContent && (
        <div
          class='fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300'
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* bottom navigation container */}
      <nav
        ref={navRef}
        class={`fixed bottom-4 left-4 right-4 z-50 md:hidden overflow-hidden transition-all duration-300 ease-out`}
        style={{
          height: `${getCurrentHeight()}px`,
          backgroundColor: theme.colors.background.secondary || '#2a2a2a',
          borderRadius: showExpandedContent ? '24px' : '40px',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
        onTouchStart={handleTouchStart}
        f-client-nav
      >
        {/* drag handle for expanded menu */}
        {showExpandedContent && (
          <div class='flex justify-center pt-3 pb-2'>
            <div
              class='w-12 h-1 rounded-full'
              style={{ backgroundColor: theme.colors.text.tertiary }}
            />
          </div>
        )}

        <div class='max-w-md mx-auto h-full'>
          {showExpandedContent
            ? (
              <ExpandedMenu
                currentPath={currentRoute.value}
                menuItems={NAV_CONFIG.expandedMenu.items}
                socialLinks={NAV_CONFIG.socialLinks}
                onMenuClose={() => setIsMenuOpen(false)}
                onAnchorLink={handleAnchorLink}
                theme={theme}
              />
            )
            : (
              <CollapsedNav
                buttonStates={buttonStates}
                onAction={handleAction}
                theme={theme}
              />
            )}
        </div>
      </nav>
    </>
  )
}
