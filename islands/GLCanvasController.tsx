import { useEffect } from 'preact/hooks'
import { useClientLocation } from '@lib/utils/clientLocation.ts'
import { isGLDisabled } from '@lib/debug/index.ts'
import { isGLInitialized } from '@lib/gl/state.ts'
import { getSceneOrchestrator } from '@lib/gl/index.ts'
import { lc, log } from '@lib/logger/index.ts'
import { GLCanvas } from '@components/GLCanvas.tsx'

/**
 * GLCanvasController island
 * Handles GL enable/disable and scene orchestrator switching
 */
const GLCanvasController = () => {
  const [pathname] = useClientLocation()

  useEffect(() => {
    // Early return if GL is disabled
    console.log('isGLDisabled', isGLDisabled())
    if (isGLDisabled()) return
    if (!pathname) return

    const sceneOrchestrator = getSceneOrchestrator()
    if (sceneOrchestrator) sceneOrchestrator.switchToPage(pathname === '/' ? 'logo-page' : 'content-page')
    else log(lc.GL, 'Scene orchestrator not found despite GL being initialized.')
  }, [pathname, isGLInitialized.value])

  if (isGLDisabled()) return null

  return <GLCanvas />
}

export default GLCanvasController
