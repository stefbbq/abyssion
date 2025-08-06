import { createContentPageOrchestrator, createHomePageOrchestrator, createSceneOrchestrator } from '../animation/index.ts'
import { createLoadingStateOrchestrator } from '../animation/orchestrators/loadingState/createLoadingStateOrchestrator.ts'
import { lc, log } from '../../logger/index.ts'
import type { RendererState } from '../types.ts'
import type { VideoBackgroundManager } from '../textures/VideoCycle/types.ts'

export const setupOrchestrators = (glState: RendererState) => {
  log(lc.GL_ANIMATION, 'Setting up orchestrators')

  const orchestratorRegistry = {
    'loading-state': () =>
      createLoadingStateOrchestrator(
        () => {
          log(lc.GL, 'Loading orchestrator triggered transition to home page')
          glState.sceneOrchestrator?.switchToPage('home-page')
        },
        () => {
          const isReady = Boolean(glState.isReady)
          const hasComposer = Boolean(glState.composer)
          const hasLogoController = Boolean(glState.logoController)
          const isReadyToStream = isReady && hasComposer && hasLogoController

          // Log detailed state every 2 seconds
          const now = Date.now()
          if (now % 2000 < 50) {
            log.debug(lc.GL_ANIMATION, 'Scene readiness check:', {
              isReady,
              hasComposer,
              hasLogoController,
              isReadyToStream,
            })
          }

          return {
            videoBackground: glState.videoBackground as VideoBackgroundManager,
            isReadyToStream,
          }
        },
      ),
    'home-page': () => {
      const currentLogoController = glState.logoController
      if (!currentLogoController) {
        log.error(lc.GL, 'logoController not available for home page orchestrator')
        throw new Error('logoController not available')
      }
      return createHomePageOrchestrator(currentLogoController)
    },
    'content-page': createContentPageOrchestrator,
  }

  const sceneOrchestrator = createSceneOrchestrator(glState, orchestratorRegistry)
  log(lc.GL_ANIMATION, 'Scene orchestrator created, registering loading-state')
  sceneOrchestrator.registerOrchestrator('loading-state')
  log(lc.GL_ANIMATION, 'Orchestrator setup complete')

  return sceneOrchestrator
}
