import { useEffect, useState } from 'preact/hooks'
import { useClientLocation } from '@lib/utils/clientLocation.ts'
import { getTheme } from '@lib/theme/index.ts'
import { ActionZoneExpandedMenu } from '@molecules/ActionZoneExpandedMenu.tsx'
import { ActionZoneNav } from '@molecules/ActionZoneNav.tsx'
import navData from '@data/nav.json' with { type: 'json' }
import actionZoneConfig from '@organisms/actionZone.animation.ts'
import ActionZone from '@organisms/ActionZone.tsx'
import type { MenuItem, NavButtonState } from '@data/types.ts'
import pages from '@data/pages.json' with { type: 'json' }

export default function ActionZoneController() {
  const [isMounted, setIsMounted] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const theme = getTheme()
  const [currentPath] = useClientLocation()

  useEffect(() => {
    setIsMounted(true)
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
  const routeConfig = Object.prototype.hasOwnProperty.call(pages, currentPath)
    ? (pages as Record<string, { layout?: string }>)[currentPath]
    : {}
  const layoutType = routeConfig.layout || 'collapsed'

  // Map layoutType to the correct state key in actionZoneConfig
  const getStateKey = () => {
    if (isMenuOpen) return 'expandedMenu'
    if (layoutType === 'collapsedPage') return 'collapsedPage'
    return 'collapsed'
  }

  // For collapsedPage, use the route as the key to get the right button set
  const getCollapsedConfig = () => {
    const state = getStateKey()
    const config = actionZoneConfig[state] || { buttons: [], layout: {} }
    if (!Array.isArray(config.buttons)) return { buttons: [], layout: {} }

    // Patch in page title if needed
    const page = navData.mainNav.find((p: MenuItem) => p.path === currentPath)
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
              currentPath={currentPath}
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
