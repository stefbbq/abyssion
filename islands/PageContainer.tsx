import { useEffect } from 'preact/hooks'
import { initializeLoggerClient } from '@lib/logger/utils/initializeLoggerClient.ts'
import { isDebugModeEnabled } from '@lib/debug/index.ts'
import { resetContexts } from '@lib/logger/index.ts'
import { getSceneOrchestrator } from '@lib/gl/index.ts'
import { useClientLocation } from '@lib/utils/clientLocation.ts'
import { isGLInitialized } from '@lib/gl/state.ts'
import { lc, log } from '@lib/logger/index.ts'

/**
 * PageContainer wraps page content and manages the background color with a fade transition
 * depending on whether the current route is the homepage. It listens for route changes
 * and updates the background accordingly. Place all page content as children.
 * Also initializes logger and GL scene orchestrator on the client.
 */
const PageContainer = ({ children }: { children: preact.ComponentChildren }) => {
  const [currentPath] = useClientLocation()
  const isHomePage = currentPath === '/'

  // initialize logger and reset log contexts
  useEffect(() => {
    initializeLoggerClient()
    if (isDebugModeEnabled()) resetContexts()
  }, [])

  // initialize GL scene orchestrator (decide if we're rendering the logo or not)
  useEffect(() => {
    if (!isGLInitialized.value) return

    const sceneOrchestrator = getSceneOrchestrator()
    if (sceneOrchestrator) sceneOrchestrator.switchToPage(isHomePage ? 'logo-page' : 'content-page')
    else log(lc.GL, 'Scene orchestrator not found despite GL being initialized.')
  }, [isHomePage, isGLInitialized.value])

  return (
    <main class='pb-8 max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 pt-8 sm:pt-5 relative z-10 space-y-8'>
      {children}
    </main>
  )
}

export default PageContainer
