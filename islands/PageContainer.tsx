import { useEffect, useState } from 'preact/hooks'
import { getTheme } from '@lib/theme/index.ts'
import { hexStringToRGB } from '@lib/theme/utils/hexStringToRGB.ts'
import { rgbToCSS } from '@lib/theme/utils/rgbToCSS.ts'
import { initializeLoggerClient } from '@lib/logger/utils/initializeLoggerClient.ts'
import { isDebugModeEnabled } from '@lib/debug/index.ts'
import { resetContexts } from '@lib/logger/index.ts'
import { getSceneOrchestrator } from '@lib/gl/index.ts'

/**
 * PageContainer wraps page content and manages the background color with a fade transition
 * depending on whether the current route is the homepage. It listens for route changes
 * and updates the background accordingly. Place all page content as children.
 * Also initializes logger and GL scene orchestrator on the client.
 */
const PageContainer = ({ children }: { children: preact.ComponentChildren }) => {
  const theme = getTheme()
  const subpageBgColor = rgbToCSS(hexStringToRGB(theme.colors.background.primary), 0.8)
  const [isHomePage, setIsHomePage] = useState(false)
  const [bgColor, setBgColor] = useState('transparent')

  useEffect(() => {
    // Initialize logger client
    initializeLoggerClient()
    if (isDebugModeEnabled()) resetContexts()

    // handle route change
    const handleRouteChange = () => {
      const home = globalThis.location.pathname === '/'
      setIsHomePage(home)
      setBgColor(home ? 'transparent' : subpageBgColor)

      const sceneOrchestrator = getSceneOrchestrator()
      if (sceneOrchestrator) {
        const pageName = home ? 'logo-page' : 'content-page'
        sceneOrchestrator.switchToPage(pageName)
      } else console.warn('Scene orchestrator not found. GL system may not be initialized yet.')
    }

    // Monkey-patch history API to catch SPA navigation
    const originalPushState = history.pushState
    history.pushState = function (...args) {
      originalPushState.apply(this, args)
      handleRouteChange()
    }
    const originalReplaceState = history.replaceState
    history.replaceState = function (...args) {
      originalReplaceState.apply(this, args)
      handleRouteChange()
    }
    globalThis.addEventListener('popstate', handleRouteChange)

    // initial setup
    handleRouteChange()
    return () => {
      history.pushState = originalPushState
      history.replaceState = originalReplaceState
      globalThis.removeEventListener('popstate', handleRouteChange)
    }
  }, [subpageBgColor])

  return (
    <main class='min-h-screen relative z-10 transition-colors duration-300 ease-in-out' style={{ backgroundColor: bgColor }}>
      {children}
    </main>
  )
}

export default PageContainer
