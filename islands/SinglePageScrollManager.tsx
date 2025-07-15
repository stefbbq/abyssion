import { useEffect, useRef, useState } from 'preact/hooks'
import { isGLDisabled } from '@lib/debug/index.ts'
import { isGLInitialized } from '@lib/gl/state.ts'
import { getGLState, updateScrollCorruption, updateScrollMetrics } from '@lib/gl/index.ts'
import { GLCanvas } from '@components/GLCanvas.tsx'
import { initializeClientLogger } from '@lib/logger/utils/initializeClientLogger.ts'
import { lc } from '@lib/logger/index.ts'
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
    initializeClientLogger(lc.GL, 'debug')
  }, [])

  useEffect(() => {
    if (typeof globalThis.window === 'undefined') return
    if (isGLDisabled()) {
      setShowGL(false)
      return
    } else {
      setShowGL(true)
    }
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el))
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
              // GL scene switching logic
              // if (isGLInitialized.value) {
              // const orchestrator = getSceneOrchestrator()
              // if (orchestrator) {
              //   // If home is mostly visible, use home-page; otherwise, use content-page
              //   if (topSection.id === 'home') {
              //     if (lastScene.current !== 'home-page') {
              //       orchestrator.switchToPage('home-page')
              //       lastScene.current = 'home-page'
              //     }
              //   } else {
              //     if (lastScene.current !== 'content-page') {
              //       orchestrator.switchToPage('content-page')
              //       lastScene.current = 'content-page'
              //     }
              //   }
              // }
              // }
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

    // Helper function to get scroll offset based on device
    const getScrollOffset = () => {
      const isMobile = globalThis.innerWidth < 768 // md breakpoint
      return isMobile ? 20 : 75 // Smaller offset for mobile, larger for desktop
    }

    // Smooth scroll on hashchange (browser navigation)
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
    globalThis.addEventListener('hashchange', handleHashChange)

    // Intercept anchor clicks for smooth scroll
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
        const hash = target.getAttribute('href')!
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
    document.addEventListener('click', handleClick)

    // Scroll corruption tracking
    const handleScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(() => {
          const scrollY = globalThis.scrollY

          // Update scroll corruption effect if GL is initialized
          if (isGLInitialized.value) {
            const glState = getGLState()
            if (glState) {
              updateScrollCorruption(scrollY, glState)
            }
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
    globalThis.addEventListener('scroll', handleScroll)

    // Update scroll metrics when layout changes
    const handleResize = () => {
      updateScrollMetrics(0)
    }
    globalThis.addEventListener('resize', handleResize)

    // Initial background intensity update
    const scrollY = globalThis.scrollY
    const crtConfig = configPostProcessing.crtScrollCorruption ?? {}
    const { intensity } = getScrollCorruptionProgress(scrollY, crtConfig)
    setBackgroundIntensity(intensity)

    return () => {
      observer.disconnect()
      globalThis.removeEventListener('hashchange', handleHashChange)
      document.removeEventListener('click', handleClick)
      globalThis.removeEventListener('scroll', handleScroll)
      globalThis.removeEventListener('resize', handleResize)
    }
  }, [])

  // Render ThemedBackground and GLCanvas if not disabled, fixed position
  return (
    <>
      <ThemedBackground intensity={backgroundIntensity} showNoise={false} />
      {showGL ? <GLCanvas /> : null}
    </>
  )
}
