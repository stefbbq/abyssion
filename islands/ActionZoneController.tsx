import { useEffect, useRef, useState } from 'preact/hooks'
import { ActionZoneExpanded } from '@components/actionZone/ActionZoneExpanded.tsx'
import navData from '@data/nav.json' with { type: 'json' }
import uiConfig from '@data/ui-config.json' with { type: 'json' }
import { ActionZone } from '@components/actionZone/ActionZone.tsx'
import { ActionZoneCollapsed } from '@components/actionZone/ActionZoneCollapsed.tsx'
import { createActionZoneConfig } from '@components/actionZone/config/index.ts'
import { getSectionIDs, smoothScrollToSection } from '@lib/ui/index.ts'
import type { NavButtonState } from '@data/types.ts'
import type { ActionZoneLayout } from '@components/actionZone/types.ts'

export default function ActionZoneController() {
  const [isMounted, setIsMounted] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentHash, setCurrentHash] = useState('')
  const isScrollingRef = useRef(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Track current section using intersection observer (passive, no scroll control)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentHash(globalThis.location.hash)

      // Track hash changes from manual navigation
      const onHashChange = () => setCurrentHash(globalThis.location.hash)
      globalThis.addEventListener('hashchange', onHashChange)

      // track current section via intersection observer
      const sections = getSectionIDs().map((id) => document.getElementById(id)).filter((el): el is HTMLElement => Boolean(el))

      if (sections.length > 0) {
        const observer = new globalThis.IntersectionObserver(
          (entries) => {
            // Skip updates during programmatic scrolling
            if (isScrollingRef.current) return

            // For tall sections, just check if they're intersecting at all
            // For shorter sections, use intersection ratio
            const visible = entries
              .filter((entry) => {
                if (!entry.isIntersecting) return false

                const element = entry.target as HTMLElement
                const elementHeight = element.offsetHeight
                const viewportHeight = globalThis.innerHeight

                // if section is taller than viewport, just check if it's intersecting
                if (elementHeight > viewportHeight * uiConfig.intersection.tallSectionMultiplier) return true

                // for shorter sections, use intersection ratio
                return entry.intersectionRatio > uiConfig.intersection.minRatioForShortSections
              })
              .sort((a, b) => {
                // Prioritize sections that are tall and currently intersecting
                const aElement = a.target as HTMLElement
                const bElement = b.target as HTMLElement
                const aHeight = aElement.offsetHeight
                const bHeight = bElement.offsetHeight
                const viewportHeight = globalThis.innerHeight

                const aIsTall = aHeight > viewportHeight * uiConfig.intersection.tallSectionMultiplier
                const bIsTall = bHeight > viewportHeight * uiConfig.intersection.tallSectionMultiplier

                if (aIsTall && !bIsTall) return -1
                if (!aIsTall && bIsTall) return 1

                return b.intersectionRatio - a.intersectionRatio
              })

            if (visible.length > 0) {
              const topSection = visible[0].target as HTMLElement
              const newHash = topSection.id === 'home' ? '' : `#${topSection.id}`
              setCurrentHash(newHash)
            }
          },
          { threshold: uiConfig.intersection.thresholds },
        )

        sections.forEach((section) => observer.observe(section))

        return () => {
          globalThis.removeEventListener('hashchange', onHashChange)
          observer.disconnect()
        }
      }

      return () => globalThis.removeEventListener('hashchange', onHashChange)
    }
  }, [])

  const onAction = (action: NavButtonState['action']) => {
    if (action.type === 'navigate' && action.href && action.href.startsWith('#')) {
      const hash = action.href
      const sectionId = hash.replace('#', '')
      const element = document.getElementById(sectionId)

      if (element) {
        isScrollingRef.current = true
        const targetHash = sectionId === 'home' ? '' : hash
        setCurrentHash(targetHash)
        smoothScrollToSection(sectionId)
        setIsMenuOpen(false)
        setTimeout(() => isScrollingRef.current = false, uiConfig.scroll.smoothScrollDurationMs)

        if (globalThis.history && globalThis.history.pushState) {
          globalThis.history.pushState(null, '', sectionId === 'home' ? '/' : hash)
          globalThis.dispatchEvent(new HashChangeEvent('hashchange'))
        }
        return
      }
    }
    if (action.type === 'menu') setIsMenuOpen(!isMenuOpen)
  }

  const onAnchorLink = (path: string) => {
    if (path.startsWith('#')) {
      const sectionId = path.replace('#', '')
      const element = document.getElementById(sectionId)

      if (element) {
        isScrollingRef.current = true
        const targetHash = sectionId === 'home' ? '' : path
        setCurrentHash(targetHash)
        smoothScrollToSection(sectionId)
        setIsMenuOpen(false)
        setTimeout(() => isScrollingRef.current = false, uiConfig.scroll.smoothScrollDurationMs)
        return true
      }
    }
    return false
  }

  if (!isMounted) return null

  // Separate configs for collapsed and expanded states
  const actionZoneConfig = createActionZoneConfig()

  const getConfigWithActiveState = (config: ActionZoneLayout) => {
    if (!Array.isArray(config.buttons)) return { buttons: [], layout: {} }

    // Mark active buttons based on current hash
    const buttons = config.buttons.map((button: NavButtonState) => {
      // mark button as active if its href matches the current hash
      // for home section, consider it active if no hash or if at top of page
      const isActive = button.action?.href === currentHash ||
        (button.action?.href === '#home' && currentHash === '')

      return { ...button, isActive }
    })

    return { buttons, layout: config.layout }
  }

  const collapsedConfig = getConfigWithActiveState(actionZoneConfig.collapsed)
  const expandedConfig = getConfigWithActiveState(actionZoneConfig.expandedMenu)

  return (
    <>
      <ActionZone
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={(open) => setIsMenuOpen(open)}
        collapsedChildren={
          <ActionZoneCollapsed
            buttons={collapsedConfig.buttons}
            onAction={onAction}
          />
        }
        expandedChildren={
          <ActionZoneExpanded
            menuItems={navData.mainNav}
            socialLinks={navData.socialLinks}
            onMenuClose={() => setIsMenuOpen(false)}
            {...{ onAnchorLink, onAction, currentHash }}
            buttons={expandedConfig.buttons}
          />
        }
        layoutConfig={collapsedConfig.layout}
      />
    </>
  )
}
