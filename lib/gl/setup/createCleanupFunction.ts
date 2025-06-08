import * as Three from 'three'
import type { UIOverlay, VideoBackgroundManager } from '@libgl/types.ts'
import type { EffectComposer, OrbitControls, WebGLRenderer } from 'three'

type CleanupDependencies = {
  animationCleanup: () => void
  responsiveCleanup: () => void
  controlsSystem: OrbitControls | null
  videoBackground?: VideoBackgroundManager
  logoController: unknown
  scene: Three.Scene
  planes: Three.Mesh[]
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
    planes,
    shapeLayer,
    shadowLayer,
    uiLayer,
    controls,
    renderer,
    composer,
  } = dependencies

  return () => {
    try {
      // Stop animation
      if (animationCleanup) {
        animationCleanup()
      }

      // Remove event listeners
      if (responsiveCleanup) {
        responsiveCleanup()
      }

      // Clean up controls system
      if (controlsSystem && typeof controlsSystem.cleanup === 'function') {
        controlsSystem.cleanup()
      }

      // Clean up video background
      if (videoBackground && typeof videoBackground.dispose === 'function') {
        videoBackground.dispose()
      }

      // Clean up planes
      if (logoController && scene && planes && typeof logoController.dispose === 'function') {
        logoController.dispose(scene, planes)
      }

      // Remove shape layer
      if (scene && shapeLayer) {
        scene.remove(shapeLayer)
        if (shapeLayer.traverse) {
          shapeLayer.traverse((object: any) => {
            if (object && 'geometry' in object && object.geometry) {
              object.geometry.dispose()
            }
            if (object && 'material' in object && object.material) {
              if (Array.isArray(object.material)) {
                object.material.forEach((material: any) => {
                  if (material && typeof material.dispose === 'function') {
                    material.dispose()
                  }
                })
              } else if (typeof object.material.dispose === 'function') {
                object.material.dispose()
              }
            }
          })
        }
      }

      // Clean up shadow layer
      if (shadowLayer && typeof shadowLayer.dispose === 'function') {
        shadowLayer.dispose()
      }

      // Clean up UI overlay
      if (uiLayer && uiLayer.scene) {
        uiLayer.scene.traverse((object: any) => {
          if (object && 'geometry' in object && object.geometry) {
            object.geometry.dispose()
          }
          if (object && 'material' in object && object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach((material: any) => {
                if (material && typeof material.dispose === 'function') {
                  material.dispose()
                }
              })
            } else if (typeof object.material.dispose === 'function') {
              object.material.dispose()
            }
          }
        })
      }

      // Clean up orbit controls
      if (controls && typeof controls.dispose === 'function') {
        controls.dispose()
      }

      // Dispose renderer and composer
      if (renderer && typeof renderer.dispose === 'function') {
        renderer.dispose()
      }
      if (composer && typeof composer.dispose === 'function') {
        composer.dispose()
      }
    } catch (error) {
      // Log cleanup errors but don't throw to prevent cascading failures
      console.warn('GL cleanup error:', error)
    }
  }
}
