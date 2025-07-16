import { useEffect, useRef, useState } from 'preact/hooks'
import { ActionZoneExpanded } from '@components/actionZone/ActionZoneExpanded.tsx'
import navData from '@data/nav.json' with { type: 'json' }
import { ActionZone } from '@components/actionZone/ActionZone.tsx'
import { ActionZoneCollapsed } from '@components/actionZone/ActionZoneCollapsed.tsx'
import { createActionZoneConfig } from '@components/actionZone/config/index.ts'
import type { NavButtonState } from '@data/types.ts'

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

      // Track current section via intersection observer (for auto-updating active states)
      const sectionIds = ['home', 'bio', 'shows', 'contact']
      const sections = sectionIds
        .map((id) => document.getElementById(id))
        .filter((el): el is HTMLElement => Boolean(el))

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

                // If section is taller than viewport, just check if it's intersecting
                if (elementHeight > viewportHeight * 1.2) return true

                // For shorter sections, use intersection ratio
                return entry.intersectionRatio > 0.5
              })
              .sort((a, b) => {
                // Prioritize sections that are tall and currently intersecting
                const aElement = a.target as HTMLElement
                const bElement = b.target as HTMLElement
                const aHeight = aElement.offsetHeight
                const bHeight = bElement.offsetHeight
                const viewportHeight = globalThis.innerHeight

                const aIsTall = aHeight > viewportHeight * 1.2
                const bIsTall = bHeight > viewportHeight * 1.2

                if (aIsTall && !bIsTall) return -1
                if (!aIsTall && bIsTall) return 1

                return b.intersectionRatio - a.intersectionRatio
              })

            if (visible.length > 0) {
              const topSection = visible[0].target as HTMLElement
              const newHash = `#${topSection.id}`
              setCurrentHash(newHash)
            }
          },
          { threshold: [0.1, 0.3, 0.5, 0.7, 0.9] },
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
        // Set scrolling flag to pause intersection observer
        isScrollingRef.current = true
        setCurrentHash(hash) // Immediately update to target hash

        // Match SinglePageScrollManager's scroll offset logic exactly
        const getScrollOffset = () => {
          const isMobile = globalThis.innerWidth < 768 // md breakpoint
          return isMobile ? 20 : 75 // Smaller offset for mobile, larger for desktop
        }

        const offsetTop = element.offsetTop - getScrollOffset()

        globalThis.scrollTo({ top: offsetTop, behavior: 'smooth' })
        setIsMenuOpen(false)

        // Clear scrolling flag after animation completes
        setTimeout(() => isScrollingRef.current = false, 1000)

        // Update the hash without triggering a navigation
        if (globalThis.history && globalThis.history.pushState) {
          globalThis.history.pushState(null, '', hash)
          // Trigger hash change event manually for our listener
          globalThis.dispatchEvent(new HashChangeEvent('hashchange'))
        }
        return
      }
    }
    // Handle remaining action types
    if (action.type === 'menu') {
      setIsMenuOpen(!isMenuOpen)
    }
  }

  const onAnchorLink = (path: string) => {
    if (path.startsWith('#')) {
      const sectionId = path.replace('#', '')
      const element = document.getElementById(sectionId)

      if (element) {
        // Set scrolling flag to pause intersection observer
        isScrollingRef.current = true
        setCurrentHash(path) // Immediately update to target hash

        // Match SinglePageScrollManager's scroll offset logic exactly
        const getScrollOffset = () => {
          const isMobile = globalThis.innerWidth < 768 // md breakpoint
          return isMobile ? 20 : 75 // Smaller offset for mobile, larger for desktop
        }

        const offsetTop = element.offsetTop - getScrollOffset()

        globalThis.scrollTo({ top: offsetTop, behavior: 'smooth' })
        setIsMenuOpen(false)

        // Clear scrolling flag after animation completes
        setTimeout(() => isScrollingRef.current = false, 1000)

        return true
      }
    }
    return false
  }

  if (!isMounted) return null

  // Separate configs for collapsed and expanded states
  const actionZoneConfig = createActionZoneConfig()

  const getConfigWithActiveState = (config: any) => {
    if (!Array.isArray(config.buttons)) return { buttons: [], layout: {} }

    // Mark active buttons based on current hash
    const buttons = config.buttons.map((button: NavButtonState) => {
      // Mark button as active if its href matches the current hash
      // For home section, consider it active if no hash or hash is #home
      const isActive = button.action?.href === currentHash ||
        (button.action?.href === '#home' && (!currentHash || currentHash === '#home'))

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
