import { useEffect, useRef, useState } from 'preact/hooks'

import { isGLDisabled } from '@lib/debug/index.ts'
import { updateScrollState } from '@lib/gl/animation/state/scrollState.ts'
import { setCurrentPath as _setCurrentPath, setScrollY, setViewportSize } from '@lib/gl/state.ts'
import { GLCanvas } from '@components/GLCanvas.tsx'
import { backgroundIntensity as backgroundIntensitySignal, backgroundIntensityOverride } from '@lib/ui/state.ts'
import { initializeClientLogger } from '@lib/logger/utils/initializeClientLogger.ts'
import ThemedBackground from '@islands/ThemedBackground.tsx'
import { getScrollOffset, getSectionIDs } from '@lib/ui/index.ts'

/**
 * PageManager
 * Handles scroll/hash sync, smooth scrolling, GL scene switching, and parallax effect.
 */
type PageManagerProps = { disableGL?: boolean; enabledPaths?: string[]; disabledPaths?: string[] }

export default function PageManager({ disableGL, enabledPaths, disabledPaths }: PageManagerProps) {
  const resolveDisableForPath = (path: string): boolean => {
    if (typeof disableGL === 'boolean') return disableGL
    if (Array.isArray(enabledPaths)) return !enabledPaths.includes(path)
    if (Array.isArray(disabledPaths)) return disabledPaths.includes(path)
    return isGLDisabled()
  }

  const initialPath = typeof window !== 'undefined' ? globalThis.location.pathname : '/'
  const [showGL, setShowGL] = useState(() => !resolveDisableForPath(initialPath))
  const [_currentPath, setCurrentPath] = useState<string>(() => initialPath)
  const ticking = useRef(false)

  // switch orchestrator based on path
  const switchOrchestratorForPath = (path: string) => {
    _setCurrentPath(path)
  }

  // initialize client logger
  useEffect(() => {
    initializeClientLogger(undefined, 'debug')
  }, [])

  // initialize GL scene and scroll management
  useEffect(() => {
    // helper to force recalculation for listeners that depend on scroll/resize
    const triggerRecalc = () => {
      try {
        globalThis.dispatchEvent(new Event('resize'))
        globalThis.dispatchEvent(new Event('scroll'))
      } catch {
        // noop
      }
    }
    // bail if not in a browser
    if (typeof globalThis.window === 'undefined') return

    // compute GL enablement per current path and do not early-return so non-GL features still work
    const glDisabledForPath = resolveDisableForPath(globalThis.location.pathname)
    setShowGL(!glDisabledForPath)

    // helper to manage an intersection observer that only runs on home
    let observer: IntersectionObserver | null = null
    const setupObserverIfHome = () => {
      // always disconnect previous instance first
      if (observer) {
        observer.disconnect()
        observer = null
      }

      // only set up on home route
      if (globalThis.location.pathname !== '/') return

      // compute sections (may be empty depending on content)
      const sections = getSectionIDs()
        .map((id) => document.getElementById(id))
        .filter((el): el is HTMLElement => Boolean(el))

      if (!sections.length) return

      observer = new globalThis.IntersectionObserver(
        (entries) => {
          if (!ticking.current) {
            globalThis.requestAnimationFrame(() => {
              const visible = entries
                .filter((entry) => entry.isIntersecting && entry.intersectionRatio > 0.5)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
              if (visible.length > 0) {
                // only sync hash on home route
                if (globalThis.location.pathname === '/') {
                  const topSection = visible[0].target as HTMLElement
                  const newHash = `#${topSection.id}`
                  if (globalThis.location.hash !== newHash) {
                    history.replaceState(null, '', newHash)
                  }
                }
              }
              ticking.current = false
            })

            ticking.current = true
          }
        },
        {
          threshold: [0.5],
        },
      )

      sections.forEach((section) => observer?.observe(section))
    }

    // observe navigation changes to update current path (for content-page behavior)
    const onPopState = () => {
      const path = globalThis.location.pathname
      setCurrentPath(path)
      switchOrchestratorForPath(path)
      // update GL enablement on route change
      setShowGL(!resolveDisableForPath(path))
      // update intersection observer according to route
      setupObserverIfHome()
      // ensure backgrounds recalc immediately
      triggerRecalc()
    }
    const onClickPath = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const anchor = target.closest ? (target.closest('a') as HTMLAnchorElement | null) : null
      if (!anchor) return

      try {
        const url = new URL(anchor.href, globalThis.location.href)
        if (url.origin !== globalThis.location.origin) return

        const samePath = url.pathname === globalThis.location.pathname

        // same-page hash navigation like '/#section'
        if (samePath && url.hash) {
          const id = url.hash.replace('#', '')
          if (getSectionIDs().includes(id)) {
            e.preventDefault()
            const el = document.getElementById(id)
            if (el) {
              const offsetTop = el.offsetTop - getScrollOffset()
              globalThis.scrollTo({ top: offsetTop, behavior: 'smooth' })
              history.replaceState(null, '', `#${id}`)
            }
            return
          }
        }

        // clicking home while already on home: smooth scroll to top
        if (samePath && url.pathname === '/') {
          e.preventDefault()
          globalThis.scrollTo({ top: 0, behavior: 'smooth' })
          history.replaceState(null, '', '/')
          return
        }

        // default internal nav: update path signal and orchestrator
        setCurrentPath(url.pathname)
        switchOrchestratorForPath(url.pathname)
        // update GL enablement on route change (pre-popstate)
        setShowGL(!resolveDisableForPath(url.pathname))
        // re-evaluate observer on navigation
        setupObserverIfHome()
        // ensure backgrounds recalc immediately
        triggerRecalc()
      } catch {
        // ignore invalid URLs
      }
    }
    globalThis.addEventListener('popstate', onPopState)
    document.addEventListener('click', onClickPath, { capture: true })

    // initialize observer state for current route
    setupObserverIfHome()

    // smooth scroll on hashchange (browser navigation)
    const handleHashChange = () => {
      const hash = globalThis.location.hash

      if (hash && getSectionIDs().includes(hash.replace('#', ''))) {
        const el = document.getElementById(hash.replace('#', ''))

        if (el) {
          const offsetTop = el.offsetTop - getScrollOffset()
          globalThis.scrollTo({ top: offsetTop, behavior: 'smooth' })
        }
      }
    }

    // intercept anchor clicks for smooth scroll
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const anchor = target.closest ? target.closest('a') as HTMLAnchorElement | null : null
      if (anchor && anchor.getAttribute('href')?.startsWith('#')) {
        const hash = anchor.getAttribute('href')!
        if (getSectionIDs().includes(hash.replace('#', ''))) {
          e.preventDefault()
          const el = document.getElementById(hash.replace('#', ''))
          if (el) {
            const offsetTop = el.offsetTop - getScrollOffset()
            globalThis.scrollTo({ top: offsetTop, behavior: 'smooth' })
          }
          history.replaceState(null, '', hash)
        }
      }
    }

    // scroll telemetry
    const handleScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(() => {
          const scrollY = globalThis.scrollY
          // update GL state only if GL is enabled for this path
          if (!resolveDisableForPath(globalThis.location.pathname)) {
            setScrollY(scrollY)
            updateScrollState(scrollY)
          }

          ticking.current = false
        })

        ticking.current = true
      }
    }

    // resize telemetry
    const handleResize = () => {
      if (!resolveDisableForPath(globalThis.location.pathname)) {
        setViewportSize(globalThis.innerWidth, globalThis.innerHeight)
      }
    }

    globalThis.addEventListener('scroll', handleScroll)
    globalThis.addEventListener('resize', handleResize)
    globalThis.addEventListener('hashchange', handleHashChange)
    document.addEventListener('click', handleClick, { capture: true })

    // initial telemetry on mount
    const scrollY = globalThis.scrollY
    if (!resolveDisableForPath(globalThis.location.pathname)) {
      _setCurrentPath(globalThis.location.pathname)
      setViewportSize(globalThis.innerWidth, globalThis.innerHeight)
      setScrollY(scrollY)
      updateScrollState(scrollY)
    }

    // kick a recalc for any non-GL listeners, even when GL is disabled
    triggerRecalc()

    return () => {
      if (observer) observer.disconnect()

      // no glitch teardown needed
      globalThis.removeEventListener('hashchange', handleHashChange)
      globalThis.removeEventListener('popstate', onPopState)
      document.removeEventListener('click', onClickPath, { capture: true } as unknown as EventListenerOptions)
      document.removeEventListener('click', handleClick, { capture: true } as unknown as EventListenerOptions)
      globalThis.removeEventListener('scroll', handleScroll)
      globalThis.removeEventListener('resize', handleResize)
    }
  }, [])

  // render backgrounds and GLCanvas if not disabled, fixed position
  return (
    <>
      <ThemedBackground
        intensity={backgroundIntensityOverride.value !== null ? backgroundIntensityOverride.value : backgroundIntensitySignal.value}
        showNoise
      />
      {showGL && <GLCanvas />}
    </>
  )
}
