type CleanupDependencies = {
  animationCleanup: () => void
  responsiveCleanup: () => void
  controlsSystem: any
  videoBackground?: any
  logoLayer: any
  scene: any
  planes: any[]
  shapeLayer: any
  shadowLayer?: any
  uiLayer: any
  controls: any
  renderer: any
  composer: any
}

/**
 * Creates a cleanup function that properly disposes of all GL resources
 */
export const createCleanupFunction = (dependencies: CleanupDependencies) => {
  const {
    animationCleanup,
    responsiveCleanup,
    controlsSystem,
    videoBackground,
    logoLayer,
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
    // Stop animation
    animationCleanup()

    // Remove event listeners
    responsiveCleanup()

    // Clean up controls system
    controlsSystem.cleanup()

    // Clean up video background
    if (videoBackground) {
      videoBackground.dispose()
    }

    // Clean up planes
    logoLayer.dispose(scene, planes)

    // Remove shape layer
    scene.remove(shapeLayer)
    shapeLayer.traverse((object: any) => {
      if ('geometry' in object) object.geometry.dispose()
      if ('material' in object) {
        if (Array.isArray(object.material)) {
          object.material.forEach((material: any) => material.dispose())
        } else {
          object.material.dispose()
        }
      }
    })

    // Clean up shadow layer
    if (shadowLayer) {
      shadowLayer.dispose()
    }

    // Clean up UI overlay
    uiLayer.scene.traverse((object: any) => {
      if ('geometry' in object) object.geometry.dispose()
      if ('material' in object) {
        if (Array.isArray(object.material)) {
          object.material.forEach((material: any) => material.dispose())
        } else {
          object.material.dispose()
        }
      }
    })

    // Clean up orbit controls
    controls.dispose()

    // Dispose renderer and composer
    renderer.dispose()
    composer.dispose()
  }
}
