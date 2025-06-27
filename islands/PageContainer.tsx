import { useEffect } from 'preact/hooks'
import { getTheme } from '@lib/theme/index.ts'
import { hexStringToRGB } from '@lib/theme/utils/hexStringToRGB.ts'
import { rgbToCSS } from '@lib/theme/utils/rgbToCSS.ts'
import { initializeLoggerClient } from '@lib/logger/utils/initializeLoggerClient.ts'
import { isDebugModeEnabled } from '@lib/debug/index.ts'
import { resetContexts } from '@lib/logger/index.ts'
import { getSceneOrchestrator } from '@lib/gl/index.ts'
import { useClientLocation } from '@lib/utils/clientLocation.ts'

/**
 * PageContainer wraps page content and manages the background color with a fade transition
 * depending on whether the current route is the homepage. It listens for route changes
 * and updates the background accordingly. Place all page content as children.
 * Also initializes logger and GL scene orchestrator on the client.
 */
const PageContainer = ({ children }: { children: preact.ComponentChildren }) => {
  const theme = getTheme()
  const subpageBgColor = rgbToCSS(hexStringToRGB(theme.colors.background.primary), 0.8)
  const [currentPath] = useClientLocation()
  const isHomePage = currentPath === '/'
  const bgColor = isHomePage ? 'transparent' : subpageBgColor

  useEffect(() => {
    // Initialize logger client
    initializeLoggerClient()
    if (isDebugModeEnabled()) resetContexts()

    // update GL orchestrator on route change
    const sceneOrchestrator = getSceneOrchestrator()
    if (sceneOrchestrator) {
      const pageName = isHomePage ? 'logo-page' : 'content-page'
      sceneOrchestrator.switchToPage(pageName)
    } else console.warn('Scene orchestrator not found. GL system may not be initialized yet.')
  }, [isHomePage])

  return (
    <main class='min-h-screen relative z-10 transition-colors duration-300 ease-in-out' style={{ backgroundColor: bgColor }}>
      {children}
    </main>
  )
}

export default PageContainer
