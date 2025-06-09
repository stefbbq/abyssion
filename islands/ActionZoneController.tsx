import { useEffect, useState } from 'preact/hooks'
import { useSignal } from '@preact/signals'
import { getTheme } from '@lib/theme/index.ts'
import { ActionZoneExpandedMenu } from '@molecules/ActionZoneExpandedMenu.tsx'
import { ActionZoneNav } from '@molecules/ActionZoneNav.tsx'
import navData from '@data/nav.json' with { type: 'json' }
import actionZoneData from '@data/nav-actionZone-animation.json' with { type: 'json' }
import ActionZone from '@organisms/ActionZone.tsx'
import type { MenuItem, NavButtonState } from '@data/types.ts'

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

  const isHomepage = currentRoute.value === '/'

  const getCollapsedButtons = () => {
    if (isHomepage) return actionZoneData.home as NavButtonState[]

    const routeKey = currentRoute.value.replace('/', '')
    const page = navData.mainNav.find((p: MenuItem) => p.path === currentRoute.value)
    const buttonsConfig = (actionZoneData as Record<string, NavButtonState[]>)[routeKey] || actionZoneData.page

    const pageButtons = buttonsConfig.map((button: NavButtonState) => {
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
  )
}
