import * as Three from 'three'
import { getResponsiveCameraZ } from '../scene/utils/getResponsiveCameraZ.ts'
import { debugMobileResponsiveness } from '../scene/utils/mobileDebugHelper.ts'
import type { UIOverlay, VideoBackgroundManager } from '@libgl/types.ts'
import type { RendererConfig } from '@libgl/configScene.types.ts'

type ResponsiveConfig = {
  container: HTMLDivElement
  camera: Three.Camera
  composer: Three.EffectComposer
  uiLayer: UIOverlay
  videoBackground?: VideoBackgroundManager
  rendererConfig: RendererConfig
}

/**
 * Creates a responsive resize handler that updates camera, composer, and UI elements
 */
export const setupResponsiveHandling = (config: ResponsiveConfig) => {
  const { container, camera, composer, uiLayer, videoBackground, rendererConfig } = config

  const handleResize = () => {
    // Use the same dimensions the renderer is using
    const w = container.clientWidth || globalThis.innerWidth
    const h = container.clientHeight || globalThis.innerHeight
    const aspect = w / h

    // Update camera aspect ratio to match renderer dimensions
    camera.aspect = aspect

    // Apply responsive camera Z positioning
    camera.position.z = getResponsiveCameraZ(aspect)
    camera.updateProjectionMatrix()

    // Update overlay camera and dimensions
    uiLayer.resize(globalThis.innerWidth, globalThis.innerHeight)

    // Composer needs to be resized as well
    composer.setSize(globalThis.innerWidth, globalThis.innerHeight)

    // Set the same high pixel ratio for the composer
    composer.setPixelRatio(Math.min(
      globalThis.devicePixelRatio * rendererConfig.pixelRatioMultiplier,
      rendererConfig.pixelRatioMax,
    ))

    // Update video background scaling with new camera position
    if (videoBackground?.handleResize) videoBackground.handleResize()

    // Debug the new responsive settings
    debugMobileResponsiveness()
  }

  // Attach the event listener
  globalThis.addEventListener('resize', handleResize)

  // Return cleanup function
  return () => {
    globalThis.removeEventListener('resize', handleResize)
  }
}
