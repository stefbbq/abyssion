import { useEffect } from 'preact/hooks'
import { initializeLoggerClient } from '@lib/logger/utils/initializeLoggerClient.ts'
import { isDebugModeEnabled } from '@lib/debug/index.ts'
import { resetContexts } from '@lib/logger/index.ts'
import { getSceneOrchestrator } from '@lib/gl/index.ts'

export default function ClientInitializer() {
  useEffect(() => {
    // Initialize logger client
    initializeLoggerClient()
    if (isDebugModeEnabled()) resetContexts()

    const handleRouteChange = () => {
      console.log('handleRouteChange')
      const sceneOrchestrator = getSceneOrchestrator()
      if (!sceneOrchestrator) {
        console.warn('Scene orchestrator not found. GL system may not be initialized yet.')
        return
      }

      const path = globalThis.location.pathname
      const pageName = path === '/' ? 'logo-page' : 'empty-page'
      sceneOrchestrator.switchToPage(pageName)
    }

    // Monkey-patch history API to ensure handleRouteChange is called on SPA navigation
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

    // Listen for popstate for browser back/forward buttons
    globalThis.addEventListener('popstate', handleRouteChange)

    // Initial call to set state for the first page load
    handleRouteChange()

    // Cleanup on component unmount
    return () => {
      history.pushState = originalPushState
      history.replaceState = originalReplaceState
      globalThis.removeEventListener('popstate', handleRouteChange)
    }
  }, [])

  return null // This component doesn't render anything
}
