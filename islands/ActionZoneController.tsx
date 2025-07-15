import { useEffect, useState } from 'preact/hooks'
import { useClientLocation } from '@lib/utils/clientLocation.ts'
import { currentUITheme } from '@lib/theme/index.ts'
import { ActionZoneExpandedMenu } from '@components/actionZone/ActionZoneExpandedMenu.tsx'
import { ActionZoneNav } from '@components/actionZone/ActionZoneNav.tsx'
import navData from '@data/nav.json' with { type: 'json' }
import actionZoneConfig from '@components/actionZone/config/index.ts'
import { ActionZone } from '@components/actionZone/ActionZone.tsx'
import type { MenuItem, NavButtonState } from '@data/types.ts'
import pages from '@data/pages.json' with { type: 'json' }

export default function ActionZoneController() {
  const [isMounted, setIsMounted] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentHash, setCurrentHash] = useState('')
  const theme = currentUITheme.value
  const [currentPath] = useClientLocation()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Track hash changes for active section detection
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentHash(globalThis.location.hash)
      const onHashChange = () => setCurrentHash(globalThis.location.hash)
      globalThis.addEventListener('hashchange', onHashChange)
      return () => globalThis.removeEventListener('hashchange', onHashChange)
    }
  }, [])

  const onAction = (action: NavButtonState['action']) => {
    if (action.type === 'navigate' && action.href && action.href.startsWith('#')) {
      const element = document.querySelector(action.href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
        setIsMenuOpen(false)

        // Update the hash without triggering a navigation
        if (globalThis.history && globalThis.history.pushState) {
          globalThis.history.pushState(null, '', action.href)
          // Trigger hash change event manually for our listener
          globalThis.dispatchEvent(new HashChangeEvent('hashchange'))
        }
        return
      }
    }
    switch (action.type) {
      case 'back':
        globalThis.history.back()
        break
      case 'menu':
        setIsMenuOpen(!isMenuOpen)
        break
      case 'navigate':
        // fallback: do nothing
        break
    }
  }

  const onAnchorLink = (path: string) => {
    if (path.startsWith('#')) {
      const element = document.querySelector(path)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
        setIsMenuOpen(false)
        return true
      }
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

    // Patch in page title if needed and mark active buttons
    const page = navData.mainNav.find((p: MenuItem) => p.path === currentPath)
    const buttons = config.buttons.map((button: NavButtonState) => {
      if (button.role === 'page-title') {
        const label = button.content.label || page?.label || ''
        return { ...button, content: { ...button.content, label } }
      }

      // Mark button as active if its href matches the current hash
      // For home section, consider it active if no hash or hash is #home
      const isActive = button.action?.href === currentHash ||
        (button.action?.href === '#home' && (!currentHash || currentHash === '#home'))
      return { ...button, isActive }
    })

    return { buttons, layout: config.layout }
  }

  const collapsedConfig = getCollapsedConfig()

  return (
    <>
      <ActionZone
        layoutConfig={collapsedConfig.layout}
        {...{ isMenuOpen, setIsMenuOpen }}
        collapsedChildren={
          <ActionZoneNav
            buttons={collapsedConfig.buttons}
            {...{ onAction, theme }}
          />
        }
        expandedChildren={
          <ActionZoneExpandedMenu
            menuItems={navData.mainNav}
            socialLinks={navData.socialLinks}
            onMenuClose={() => setIsMenuOpen(false)}
            {...{ onAnchorLink, theme }}
          />
        }
      />
    </>
  )
}
