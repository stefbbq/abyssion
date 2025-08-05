import { createContentPageOrchestrator, createHomePageOrchestrator, createSceneOrchestrator } from '../animation/index.ts'
import { createLoadingStateOrchestrator } from '../animation/orchestrators/loadingState/createLoadingStateOrchestrator.ts'
import { lc, log } from '../../logger/index.ts'
import type { RendererState } from '../types.ts'
import type { VideoBackgroundManager } from '../textures/VideoCycle/types.ts'

export const setupOrchestrators = (glState: RendererState) => {
  const orchestratorRegistry = {
    'loading-state': () =>
      createLoadingStateOrchestrator(
        () => {
          log(lc.GL, 'Loading orchestrator triggered transition to home page')
          glState.sceneOrchestrator?.switchToPage('home-page')
        },
        () => ({
          videoBackground: glState.videoBackground as VideoBackgroundManager,
          isReadyToStream: glState.isReady,
        }),
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
  sceneOrchestrator.registerOrchestrator('loading-state')

  return sceneOrchestrator
}
