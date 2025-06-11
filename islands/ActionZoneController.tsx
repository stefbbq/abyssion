import { useEffect, useState } from 'preact/hooks'
import { useSignal } from '@preact/signals'
import { getTheme } from '@lib/theme/index.ts'
import { ActionZoneExpandedMenu } from '@molecules/ActionZoneExpandedMenu.tsx'
import { ActionZoneNav } from '@molecules/ActionZoneNav.tsx'
import navData from '@data/nav.json' with { type: 'json' }
import actionZoneData from '@data/nav-actionZone-animation.ts'
import ActionZone from '@organisms/ActionZone.tsx'
import type { MenuItem, NavButtonState } from '@data/types.ts'
import { matchRouteConfig } from '@lib/utils/matchRoute.ts'
import { ActionZoneFadeout } from '@atoms/ActionZoneFadeout.tsx'

type Props = {
  currentPath?: string
}

export default function ActionZoneController({ currentPath }: Props) {
  const [isMounted, setIsMounted] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const theme = getTheme()
  const currentRoute = useSignal(currentPath || '/')

  useEffect(() => {
    setIsMounted(true)

    const handleNavigate = () => {
      const newPath = globalThis.location.pathname
      currentRoute.value = newPath
    }

    document.addEventListener('DOMContentLoaded', handleNavigate)
    globalThis.addEventListener('popstate', handleNavigate)
    const originalPushState = history.pushState
    history.pushState = function (...args) {
      originalPushState.apply(this, args)
      handleNavigate()
    }

    return () => {
      document.removeEventListener('DOMContentLoaded', handleNavigate)
      globalThis.addEventListener('popstate', handleNavigate)
      history.pushState = originalPushState
    }
  }, [])

  const handleAction = (action: NavButtonState['action']) => {
    switch (action.type) {
      case 'back':
        globalThis.history.back()
        break
      case 'menu':
        setIsMenuOpen(!isMenuOpen)
        break
      case 'navigate':
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

  if (!isMounted) return null

  /**
   * getCollapsedButtons
   * Returns the correct button array for the current route and state, using the config and route-matching utility.
   * Uses 'collapsed-default' state for now.
   */
  const getCollapsedButtons = () => {
    const state = 'collapsedDefault'
    const config = matchRouteConfig(actionZoneData, state, currentRoute.value)
    if (!config || !Array.isArray(config.buttons)) return []

    // Patch in page title if needed
    const page = navData.mainNav.find((p: MenuItem) => p.path === currentRoute.value)
    return config.buttons.map((button: NavButtonState) => {
      if (button.role === 'page-title') {
        const label = button.content.label || page?.label || ''
        return { ...button, content: { ...button.content, label } }
      }

      return button
    })
  }

  // Determine the current ActionZone state
  const state = isMenuOpen ? 'expandedMenu' : 'collapsedDefault'
  const animationConfig = matchRouteConfig(actionZoneData, state, currentRoute.value)?.animation || {}
  const layoutConfig = matchRouteConfig(actionZoneData, state, currentRoute.value)?.layout || {}

  return (
    <>
      <div className='md:hidden'>
        <ActionZoneFadeout
          height={160}
          gradientStart={0}
          gradientEnd={90}
          color={theme.glass.background}
          bottom={0}
          zIndex={49}
        />
        <ActionZone
          {...{ isMenuOpen, setIsMenuOpen, animationConfig, layoutConfig }}
          routeKey={currentRoute.value}
          collapsedChildren={
            <ActionZoneNav
              onAction={handleAction}
              theme={theme}
              buttons={getCollapsedButtons()}
            />
          }
          expandedChildren={
            <ActionZoneExpandedMenu
              currentPath={currentRoute.value}
              menuItems={navData.mainNav}
              socialLinks={navData.socialLinks}
              onMenuClose={() => setIsMenuOpen(false)}
              onAnchorLink={handleAnchorLink}
              theme={theme}
            />
          }
        />
      </div>
    </>
  )
}
