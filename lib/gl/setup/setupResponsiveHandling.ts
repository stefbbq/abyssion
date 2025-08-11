import * as Three from 'three'
import { IOS_MAX_DPR } from '@libgl/constants.ts'
import { getResponsiveCameraZ } from '../scene/utils/getResponsiveCameraZ.ts'
import { debugMobileResponsiveness } from '../scene/utils/debugMobileResponsiveness.ts'
import type { UIOverlay } from '@libgl/types.ts'
import type { VideoBackgroundManager } from '@libgl/textures/VideoCycle/types.ts'
import type { RendererConfig } from '@libgl/configScene.types.ts'

type ResponsiveConfig = {
  camera: Three.Camera
  composer: Three.EffectComposer
  uiLayer: UIOverlay
  videoBackground?: VideoBackgroundManager
  rendererConfig: RendererConfig
}

/**
 * Creates a responsive resize handler that updates camera, composer, and UI elements
 *
 * @param {ResponsiveConfig} config - The configuration for the responsive handling
 * @returns {Function} - A function to remove the event listener
 */
export const setupResponsiveHandling = (config: ResponsiveConfig) => {
  const { camera, composer, uiLayer, videoBackground, rendererConfig } = config

  /**
   * Handle the resize event
   * Update the camera, composer, and UI elements
   * Update the video background
   * Debug the new responsive settings
   *
   * @returns {Function} - A function to remove the event listener
   */
  const handleResize = () => {
    const w = globalThis.innerWidth
    const h = globalThis.innerHeight
    const aspect = w / h

    camera.aspect = aspect
    camera.position.z = getResponsiveCameraZ(aspect)
    camera.updateProjectionMatrix()
    uiLayer.resize(globalThis.innerWidth, globalThis.innerHeight)
    composer.setSize(globalThis.innerWidth, globalThis.innerHeight)
    const dpr = globalThis.devicePixelRatio || 1
    const isIOS = /iPad|iPhone|iPod/.test(globalThis.navigator?.userAgent || '')
    const maxDpr = isIOS ? Math.min(rendererConfig.pixelRatioMax, IOS_MAX_DPR) : rendererConfig.pixelRatioMax
    composer.setPixelRatio(Math.min(dpr * rendererConfig.pixelRatioMultiplier, maxDpr))
    if (videoBackground?.handleResize) videoBackground.handleResize()

    debugMobileResponsiveness()
  }

  globalThis.addEventListener('resize', handleResize)

  return () => {
    globalThis.removeEventListener('resize', handleResize)
  }
}
