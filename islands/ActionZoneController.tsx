import { useEffect, useRef, useState } from 'preact/hooks'
import { AnimatePresence } from 'framer-motion'
import { getTheme } from '@lib/theme/index.ts'
import navData from '@data/nav.json' with { type: 'json' }
import { actionZoneAnimationConfig } from '@organisms/ActionZone/configurations/index.ts'
import ActionZone from '@organisms/ActionZone/ActionZone.tsx'
import { ActionZoneFadeout } from '@organisms/ActionZone/ActionZoneFadeout.tsx'
import { resolveActionZoneConfigNode } from '@organisms/ActionZone/utils/resolveActionZoneConfigNode.ts'
import { getLayoutForRoute } from '@organisms/ActionZone/utils/getLayoutForRoute.ts'
import { clearFocus, focusContext, lc, log } from '@lib/logger/index.ts'

type LayoutState = 'collapsed' | 'collapsedPage' | 'expanded'

type Props = {
  currentPath?: string
}

// Enable focused logging for ActionZone when debug parameter is present
if (globalThis.location?.search.includes('debug=actionzone')) focusContext(lc.ACTION_ZONE)
else clearFocus()

export default function ActionZoneController({ currentPath }: Props) {
  const [isMounted, setIsMounted] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [layoutType, setLayoutType] = useState<LayoutState>(() => {
    const initialLayout = getLayoutForRoute(currentPath || '/', false) as LayoutState
    log(lc.ACTION_ZONE, 'Initial layout determined', { path: currentPath, layout: initialLayout })
    return initialLayout
  })
  const [previousLayoutState, setPreviousLayoutState] = useState<LayoutState | undefined>(undefined)
  const [currentRoute, setCurrentRoute] = useState(currentPath || '/')
  const [transitionCount, setTransitionCount] = useState(0)
  const [lastTransitionTime, setLastTransitionTime] = useState(0)

  // Use refs to avoid stale closures in event handlers
  const isMenuOpenRef = useRef(isMenuOpen)
  const layoutTypeRef = useRef(layoutType)

  // Update refs when state changes
  useEffect(() => {
    isMenuOpenRef.current = isMenuOpen
  }, [isMenuOpen])

  useEffect(() => {
    layoutTypeRef.current = layoutType
  }, [layoutType])

  const theme = getTheme()

  // Layout determination logic
  const determineLayout = (route: string, menuOpen: boolean): LayoutState => {
    const startTime = Date.now()

    let layout: LayoutState
    if (menuOpen) {
      layout = 'expanded'
    } else if (route === '/') {
      layout = 'collapsed'
    } else {
      layout = 'collapsedPage'
    }

    log.debug(lc.ACTION_ZONE, `Layout determination: ${Date.now() - startTime}ms`)
    log(lc.ACTION_ZONE, 'Layout determined', { route, menuOpen, layout })

    return layout
  }

  // Detect rapid transitions (potential performance issue)
  const detectRapidTransitions = (newLayoutType: LayoutState) => {
    const now = Date.now()
    const timeSinceLastTransition = now - lastTransitionTime

    if (timeSinceLastTransition < 100) {
      log.warn(lc.ACTION_ZONE, 'Edge case detected: Rapid transition', {
        timeSinceLastTransition,
        from: layoutType,
        to: newLayoutType,
        transitionCount: transitionCount + 1,
      })
    }

    setLastTransitionTime(now)
    setTransitionCount((prev) => prev + 1)
  }

  useEffect(() => {
    const startTime = Date.now()
    setIsMounted(true)

    const handleNavigate = () => {
      const navStartTime = Date.now()
      const newPath = globalThis.location.pathname
      const currentMenuOpen = isMenuOpenRef.current
      const currentLayoutType = layoutTypeRef.current

      // Always update the current route
      setCurrentRoute(newPath)

      // Check if we need to close menu on navigation
      if (currentMenuOpen && newPath !== '/') {
        log(lc.ACTION_ZONE, 'Closing menu after navigation')
        setIsMenuOpen(false)
        // Menu closing will trigger layout update via useEffect
      } else {
        const newLayoutType = determineLayout(newPath, currentMenuOpen)

        // If layout needs to change, start transition
        if (newLayoutType !== currentLayoutType || newPath !== currentRoute) {
          detectRapidTransitions(newLayoutType)

          log(lc.ACTION_ZONE, `Layout transition: ${currentLayoutType} → ${newLayoutType}`, {
            route: newPath,
            reason: 'Navigation event',
            timestamp: Date.now(),
          })

          setPreviousLayoutState(currentLayoutType)
          setLayoutType(newLayoutType)
        } else {
          log(lc.ACTION_ZONE, 'Navigation without layout change', {
            path: newPath,
            layout: newLayoutType,
          })
        }
      }

      log.debug(lc.ACTION_ZONE, `Navigation handling: ${Date.now() - navStartTime}ms`)
    }

    const handlePopState = () => {
      log(lc.ACTION_ZONE, 'Browser back/forward navigation')
      handleNavigate()
    }

    const handleDOMContentLoaded = () => {
      log(lc.ACTION_ZONE, 'DOM content loaded')
      handleNavigate()
    }

    // Fresh client navigation detection
    const handleFreshNavigation = () => {
      log(lc.ACTION_ZONE, 'Fresh navigation detected')
      // Small delay to ensure URL has updated
      setTimeout(() => {
        handleNavigate()
      }, 10)
    }

    // Watch for Fresh navigation events
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList' && mutation.target === document.body) {
          const currentPath = globalThis.location.pathname
          if (currentPath !== currentRoute) {
            log(lc.ACTION_ZONE, 'Route change detected via DOM mutation', {
              oldRoute: currentRoute,
              newRoute: currentPath,
            })
            handleFreshNavigation()
          }
        }
      }
    })

    observer.observe(document.body, { childList: true, subtree: true })

    document.addEventListener('DOMContentLoaded', handleDOMContentLoaded)
    globalThis.addEventListener('popstate', handlePopState)

    // Override pushState to detect programmatic navigation
    const originalPushState = history.pushState
    history.pushState = function (...args) {
      log(lc.ACTION_ZONE, 'Programmatic navigation (pushState)', { args })
      originalPushState.apply(this, args)
      handleNavigate()
    }

    log.debug(lc.ACTION_ZONE, `Controller initialization: ${Date.now() - startTime}ms`)

    return () => {
      document.removeEventListener('DOMContentLoaded', handleDOMContentLoaded)
      globalThis.removeEventListener('popstate', handlePopState)
      history.pushState = originalPushState
      observer.disconnect()
    }
  }, []) // Remove isMenuOpen dependency to prevent re-running on menu state changes

  // Update layout when menu state changes
  useEffect(() => {
    const menuStartTime = Date.now()
    const newLayoutType = determineLayout(currentRoute, isMenuOpen)

    log(lc.ACTION_ZONE, 'Menu state effect triggered', {
      currentRoute,
      isMenuOpen,
      layoutType,
      newLayoutType,
      shouldChange: newLayoutType !== layoutType,
    })

    if (newLayoutType !== layoutType) {
      detectRapidTransitions(newLayoutType)

      log(lc.ACTION_ZONE, `Layout transition: ${layoutType} → ${newLayoutType}`, {
        route: currentRoute,
        reason: `Menu ${isMenuOpen ? 'opened' : 'closed'}`,
        timestamp: Date.now(),
      })

      setPreviousLayoutState(layoutType)
      setLayoutType(newLayoutType)

      // Reset previous layout state after transition completes
      setTimeout(() => {
        log(lc.ACTION_ZONE, 'Clearing previous layout state')
        setPreviousLayoutState(undefined)
      }, 500)
    }

    log.debug(lc.ACTION_ZONE, `Menu state change: ${Date.now() - menuStartTime}ms`)
  }, [isMenuOpen, currentRoute, layoutType])

  const onAction = (action: any) => {
    const actionStartTime = Date.now()
    log(lc.ACTION_ZONE, 'Action triggered', { type: action.type, action })

    switch (action.type) {
      case 'back':
        log(lc.ACTION_ZONE, 'Back action - triggering browser back')
        globalThis.history.back()
        break
      case 'menu':
        const newMenuState = !isMenuOpen
        log(lc.ACTION_ZONE, `Menu toggle: ${isMenuOpen} → ${newMenuState}`)
        setIsMenuOpen(newMenuState)
        break
      case 'navigate':
        log(lc.ACTION_ZONE, 'Navigate action', action)
        if (action.href) {
          // Close menu if it's open when navigating
          if (isMenuOpen) {
            log(lc.ACTION_ZONE, 'Closing menu before navigation')
            setIsMenuOpen(false)
          }

          // Use pushState to navigate - this should trigger Fresh's client navigation
          log(lc.ACTION_ZONE, `Navigating to: ${action.href}`)
          globalThis.history.pushState({}, '', action.href)
          // Trigger a popstate event to notify the system of the navigation
          globalThis.dispatchEvent(new PopStateEvent('popstate', { state: {} }))
        }
        break
      default:
        log.warn(lc.ACTION_ZONE, 'Unknown action type', action)
    }

    log.debug(lc.ACTION_ZONE, `Action handling: ${Date.now() - actionStartTime}ms`)
  }

  if (!isMounted) {
    log(lc.ACTION_ZONE, 'Component not yet mounted')
    return null
  }

  // Get config for current layout
  const configStartTime = Date.now()
  const configRoot = actionZoneAnimationConfig[layoutType as keyof typeof actionZoneAnimationConfig]

  log.debug(lc.ACTION_ZONE, 'Config resolution', {
    layoutType,
    currentRoute,
    isMenuOpen,
    configKeys: configRoot ? Object.keys(configRoot) : null,
    hasWildcard: configRoot && '/*' in configRoot,
    hasRouteSpecific: configRoot && currentRoute in configRoot,
  })

  log(lc.ACTION_ZONE, 'Config root for layout', { layoutType, configRoot })

  const node = resolveActionZoneConfigNode(configRoot, currentRoute, [])

  log.debug(lc.ACTION_ZONE, 'Resolved node', {
    hasNode: !!node,
    nodeType: node?.type,
    nodeChildren: node?.children ? Object.keys(node.children) : null,
    nodeLayout: node?.layout,
  })

  log(lc.ACTION_ZONE, 'Resolved config node', { node, currentRoute, layoutType })
  log.debug(lc.ACTION_ZONE, `Config resolution: ${Date.now() - configStartTime}ms`)

  if (!node) {
    log.error(lc.ACTION_ZONE, 'No config node resolved', {
      layoutType,
      currentRoute,
      configRoot: !!configRoot,
    })
    return null
  }

  // Prepare runtime props (theme, nav, social, etc)
  const runtimeProps = {
    theme,
    menuItems: navData.mainNav,
    socialLinks: navData.socialLinks,
  }

  // Log render details
  log(lc.ACTION_ZONE, 'Rendering ActionZone', {
    layoutType,
    previousLayoutState,
    currentRoute,
    isMenuOpen,
    transitionCount,
    key: `${layoutType}-${currentRoute}-${isMenuOpen}`,
  })

  return (
    <nav id='action-zone' className='md:hidden relative z-20'>
      <ActionZoneFadeout height={160} gradientStart={0} gradientEnd={90} color={theme.glass.background} bottom={0} zIndex={49} />
      <AnimatePresence mode='wait'>
        <ActionZone
          key={`${layoutType}-${currentRoute}-${isMenuOpen}`}
          {...{
            isMenuOpen,
            setIsMenuOpen,
            node,
            onAction,
            runtimeProps,
            layoutType,
            previousLayoutState,
          }}
        />
      </AnimatePresence>
    </nav>
  )
}
