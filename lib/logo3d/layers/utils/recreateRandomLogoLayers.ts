import { getAllLogoLayers } from './getAllLogoLayers.ts'
import { createPlanesFromLayers } from './createPlanesFromLayers.ts'
import { LogoLayer } from '../LogoLayer.ts'

/**
 * Regenerate random logo layers and update scene
 */
export const recreateRandomLogoLayers = (
  THREE: any,
  scene: any,
  currentPlanes: any[],
  currentLayers: LogoLayer[],
  planeGeometry: any,
  outlineTexture: any,
  stencilTexture: any,
) => {
  // Clean up all current meshes
  currentPlanes.forEach((plane, i) => {
    scene.remove(plane)
    if (plane.material instanceof THREE.Material) {
      plane.material.dispose()
    }
    plane.geometry.dispose()
  })

  // Get fresh layer configuration
  const allLayers = getAllLogoLayers(THREE)

  // Create all planes from scratch
  const allPlanes = createPlanesFromLayers(
    THREE,
    allLayers,
    planeGeometry,
    outlineTexture,
    stencilTexture,
    scene,
  )

  return {
    planes: allPlanes,
    layers: allLayers,
  }
}
