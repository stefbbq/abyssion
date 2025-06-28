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

  useEffect(() => {
    initializeLoggerClient()
    if (isDebugModeEnabled()) resetContexts()
  }, [])

  useEffect(() => {
    if (!isGLInitialized.value) return

    const sceneOrchestrator = getSceneOrchestrator()
    if (sceneOrchestrator) sceneOrchestrator.switchToPage(isHomePage ? 'logo-page' : 'content-page')
    else log(lc.GL, 'Scene orchestrator not found despite GL being initialized.')
  }, [isHomePage, isGLInitialized.value])

  return (
    <main class='min-h-screen relative z-10'>
      {children}
    </main>
  )
}

export default PageContainer
