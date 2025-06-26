import { useEffect, useState } from 'preact/hooks'
import { useSignal } from '@preact/signals'
import { getTheme } from '@lib/theme/index.ts'
import { ActionZoneExpandedMenu } from '@molecules/ActionZoneExpandedMenu.tsx'
import { ActionZoneNav } from '@molecules/ActionZoneNav.tsx'
import navData from '@data/nav.json' with { type: 'json' }
import actionZoneConfig from '@organisms/actionZone.animation.ts'
import ActionZone from '@organisms/ActionZone.tsx'
import type { MenuItem, NavButtonState } from '@data/types.ts'
import pages from '@data/pages.json' with { type: 'json' }

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
      setIsMenuOpen(false)
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

  // Get the layout type for the current route from pages.json
  const routeConfig = Object.prototype.hasOwnProperty.call(pages, currentRoute.value)
    ? (pages as Record<string, { layout?: string }>)[currentRoute.value]
    : {}
  const layoutType = routeConfig.layout || 'collapsed'

  // Map layoutType to the correct state key in actionZoneConfig
  // collapsed -> collapsedDefault, collapsedPage -> collapsedDefault (with route key), etc.
  const getStateKey = () => {
    if (isMenuOpen) return 'expandedMenu'
    if (layoutType === 'collapsedPage') return 'collapsedPage'
    return 'collapsed'
  }

  // For collapsedPage, use the route as the key to get the right button set
  const getCollapsedConfig = () => {
    const state = getStateKey()
    // fallback: just use actionZoneConfig[state] directly
    const config = actionZoneConfig[state] || { buttons: [], layout: {} }
    if (!Array.isArray(config.buttons)) return { buttons: [], layout: {} }

    // Patch in page title if needed
    const page = navData.mainNav.find((p: MenuItem) => p.path === currentRoute.value)
    const buttons = config.buttons.map((button: NavButtonState) => {
      if (button.role === 'page-title') {
        const label = button.content.label || page?.label || ''
        return { ...button, content: { ...button.content, label } }
      }
      return button
    })
    return { buttons, layout: config.layout }
  }

  const collapsedConfig = getCollapsedConfig()

  return (
    <>
      <div className='md:hidden'>
        <ActionZone
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          layoutConfig={collapsedConfig.layout}
          collapsedChildren={
            <ActionZoneNav
              onAction={handleAction}
              theme={theme}
              buttons={collapsedConfig.buttons}
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
