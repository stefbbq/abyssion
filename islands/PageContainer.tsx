import { useEffect } from 'preact/hooks'
import { initializeClientLogger } from '@lib/logger/utils/initializeClientLogger.ts'

/**
 * PageContainer wraps page content and manages the background color with a fade transition
 * depending on whether the current route is the homepage. It listens for route changes
 * and updates the background accordingly. Place all page content as children.
 * Also initializes logger and GL scene orchestrator on the client.
 * Features theme-aware filter effects for the main content area.
 */
const PageContainer = ({ children }: { children: preact.ComponentChildren }) => {
  // initialize logger and reset log contexts
  useEffect(() => {
    initializeClientLogger()
  }, [])

  return (
    <main class='pb-8 max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 pt-8 sm:pt-5 relative z-10 space-y-6'>
      {children}
    </main>
  )
}

export default PageContainer
