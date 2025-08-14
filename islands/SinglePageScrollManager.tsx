import { useEffect, useRef, useState } from 'preact/hooks'

import { isGLDisabled } from '@lib/debug/index.ts'
import { getGLState, isGLInitialized, updateScrollCorruption, updateScrollMetrics } from '@lib/gl/index.ts'
import { updateScrollState } from '@lib/gl/animation/state/scrollState.ts'
import { GLCanvas } from '@components/GLCanvas.tsx'
import { initializeClientLogger } from '@lib/logger/utils/initializeClientLogger.ts'
import ThemedBackground from '@islands/ThemedBackground.tsx'
import { getScrollCorruptionProgress } from '@lib/gl/scene/utils/getScrollCorruptionProgress.ts'
import configPostProcessing from '@lib/gl/configPostProcessing.json' with { type: 'json' }

const sectionIds = ['home', 'shows', 'bio', 'contact']

/**
 * SinglePageScrollManager
 * Handles scroll/hash sync, smooth scrolling, GL scene switching, and parallax effect.
 */
export default function SinglePageScrollManager() {
  const [showGL, setShowGL] = useState(() => !isGLDisabled())
  const [backgroundIntensity, setBackgroundIntensity] = useState(0)
  const ticking = useRef(false)

  useEffect(() => {
    initializeClientLogger(undefined, 'debug')
  }, [])

  useEffect(() => {
    if (typeof globalThis.window === 'undefined') return
    if (isGLDisabled()) {
      setShowGL(false)
      return
    } else setShowGL(true)

    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el))

    // If no sections, don't do anything
    if (!sections.length) return

    // IntersectionObserver to update hash and switch GL scene
    const observer = new globalThis.IntersectionObserver(
      (entries) => {
        if (!ticking.current) {
          globalThis.requestAnimationFrame(() => {
            const visible = entries
              .filter((entry) => entry.isIntersecting && entry.intersectionRatio > 0.5)
              .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
            if (visible.length > 0) {
              const topSection = visible[0].target as HTMLElement
              const newHash = `#${topSection.id}`
              if (globalThis.location.hash !== newHash) {
                history.replaceState(null, '', newHash)
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
    sections.forEach((section) => observer.observe(section))

    const getScrollOffset = () => globalThis.innerWidth < 768 ? 20 : 75

    // smooth scroll on hashchange (browser navigation)
    const handleHashChange = () => {
      const hash = globalThis.location.hash

      if (hash && sectionIds.includes(hash.replace('#', ''))) {
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
        if (sectionIds.includes(hash.replace('#', ''))) {
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

    // scroll corruption tracking
    const handleScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(() => {
          const scrollY = globalThis.scrollY

          // Update shared scroll state
          updateScrollState(scrollY)

          // Update GL camera and effects on all devices; corruption gated in updater for mobile
          if (isGLInitialized.value) {
            const glState = getGLState()
            if (glState) updateScrollCorruption(scrollY, glState)
          }

          // Calculate background fade intensity using shared utility
          const crtConfig = configPostProcessing.crtScrollCorruption ?? {}
          const { intensity } = getScrollCorruptionProgress(scrollY, crtConfig)
          setBackgroundIntensity(intensity)

          ticking.current = false
        })

        ticking.current = true
      }
    }

    // update scroll metrics when layout changes
    const handleResize = () => {
      if (isGLInitialized.value) {
        const glState = getGLState()
        if (glState) updateScrollMetrics(0, glState)
      }
    }

    globalThis.addEventListener('scroll', handleScroll)
    globalThis.addEventListener('resize', handleResize)
    globalThis.addEventListener('hashchange', handleHashChange)
    document.addEventListener('click', handleClick)

    // Initial background intensity update and camera sync to current scroll
    const scrollY = globalThis.scrollY
    updateScrollState(scrollY)
    const crtConfig = configPostProcessing.crtScrollCorruption ?? {}
    const { intensity } = getScrollCorruptionProgress(scrollY, crtConfig)
    setBackgroundIntensity(intensity)
    if (isGLInitialized.value) {
      const glState = getGLState()
      if (glState) updateScrollCorruption(scrollY, glState)
    }

    return () => {
      observer.disconnect()
      globalThis.removeEventListener('hashchange', handleHashChange)
      document.removeEventListener('click', handleClick)
      globalThis.removeEventListener('scroll', handleScroll)
      globalThis.removeEventListener('resize', handleResize)
    }
  }, [])

  // render backgrounds and GLCanvas if not disabled, fixed position
  return (
    <>
      <ThemedBackground intensity={backgroundIntensity} showNoise />
      {showGL ? <GLCanvas /> : null}
    </>
  )
}
