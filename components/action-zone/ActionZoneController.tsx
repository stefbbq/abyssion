import { useEffect, useState } from 'preact/hooks'
import { useSignal } from '@preact/signals'
import { getUITheme } from '@lib/theme/index.ts'
import { ExpandedMenu } from './ExpandedMenu.tsx'
import navData from '@data/navigation.json' with { type: 'json' }
import actionZoneData from '@data/actionZone.json' with { type: 'json' }
import ActionZone from './ActionZone.tsx'
import { CollapsedNav } from './CollapsedNav.tsx'
import type { NavButtonState } from '@utils/navigation/types.ts'

export interface ActionZoneControllerProps {
  currentPath?: string
}

export default function ActionZoneController({ currentPath }: ActionZoneControllerProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const theme = getUITheme()
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
      globalThis.removeEventListener('popstate', handleNavigate)
      history.pushState = originalPushState
    }
  }, [])

  const handleAction = (action: any) => {
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

  const isHomepage = currentRoute.value === '/'
  const page = navData.mainNav.find((p: any) => p.path === currentRoute.value)

  const getCollapsedButtons = () => {
    if (isHomepage) {
      return actionZoneData.home as NavButtonState[]
    }
    const routeKey = currentRoute.value.replace('/', '')
    const page = navData.mainNav.find((p: any) => p.path === currentRoute.value)

    // Find a specific button configuration for the route, or fall back to the generic 'page' config
    const buttonsConfig = (actionZoneData as any)[routeKey] || actionZoneData.page

    const pageButtons = buttonsConfig.map((button: any) => {
      if (button.role === 'page-title') {
        const label = button.content.label || page?.label || ''
        return { ...button, content: { label } }
      }
      return button
    })
    return pageButtons as NavButtonState[]
  }

  return (
    <ActionZone
      isMenuOpen={isMenuOpen}
      setIsMenuOpen={setIsMenuOpen}
      routeKey={currentRoute.value}
      collapsedChildren={
        <CollapsedNav
          onAction={handleAction}
          theme={theme}
          buttons={getCollapsedButtons()}
        />
      }
      expandedChildren={
        <ExpandedMenu
          currentPath={currentRoute.value}
          menuItems={navData.expandedMenu}
          socialLinks={navData.socialLinks}
          onMenuClose={() => setIsMenuOpen(false)}
          onAnchorLink={handleAnchorLink}
          theme={theme}
        />
      }
    />
  )
}
