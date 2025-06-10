import * as Three from 'three'
import type { UIOverlay, VideoBackgroundManager } from '@libgl/types.ts'
import type { EffectComposer, OrbitControls, WebGLRenderer } from 'three'
import type { LogoController } from '@libgl/layers/LogoLayer.ts'

type CleanupDependencies = {
  animationCleanup: () => void
  responsiveCleanup: () => void
  controlsSystem: OrbitControls | null
  videoBackground?: VideoBackgroundManager
  logoController: LogoController
  scene: Three.Scene
  logoPlanes: Three.Mesh[]
  shapeLayer: Three.Mesh
  shadowLayer?: Three.Mesh
  uiLayer: UIOverlay
  controls: OrbitControls | null
  renderer: WebGLRenderer
  composer: EffectComposer
}

/**
 * Creates a cleanup function that properly disposes of all GL resources
 * Includes defensive null checks for Fresh Partials navigation
 */
export const createCleanupFunction = (dependencies: CleanupDependencies) => {
  const {
    animationCleanup,
    responsiveCleanup,
    controlsSystem,
    videoBackground,
    logoController,
    scene,
    logoPlanes,
    shapeLayer,
    shadowLayer,
    uiLayer,
    controls,
    renderer,
    composer,
  } = dependencies

  return () => {
    try {
      if (animationCleanup) animationCleanup()
      if (responsiveCleanup) responsiveCleanup()
      if (controlsSystem && typeof controlsSystem.cleanup === 'function') controlsSystem.cleanup()
      if (videoBackground && typeof videoBackground.dispose === 'function') videoBackground.dispose()
      if (logoController && scene && logoPlanes && typeof logoController.dispose === 'function') logoController.dispose(scene, logoPlanes)
      if (scene && shapeLayer) {
        scene.remove(shapeLayer)
        if (shapeLayer.traverse) {
          shapeLayer.traverse((object: any) => {
            if (object && 'geometry' in object && object.geometry) object.geometry.dispose()
            if (object && 'material' in object && object.material) {
              if (Array.isArray(object.material)) {
                object.material.forEach((material: any) => {
                  if (material && typeof material.dispose === 'function') material.dispose()
                })
              } else if (typeof object.material.dispose === 'function') object.material.dispose()
            }
          })
        }
      }
      if (shadowLayer && typeof shadowLayer.dispose === 'function') shadowLayer.dispose()
      if (uiLayer && uiLayer.scene) {
        uiLayer.scene.traverse((object: any) => {
          if (object && 'geometry' in object && object.geometry) object.geometry.dispose()
          if (object && 'material' in object && object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach((material: any) => {
                if (material && typeof material.dispose === 'function') material.dispose()
              })
            } else if (typeof object.material.dispose === 'function') object.material.dispose()
          }
        })
      }
      if (controls && typeof controls.dispose === 'function') controls.dispose()
      if (renderer && typeof renderer.dispose === 'function') renderer.dispose()
      if (composer && typeof composer.dispose === 'function') composer.dispose()
    } catch (error) {
      console.warn('GL cleanup error:', error)
    }
  }
}
