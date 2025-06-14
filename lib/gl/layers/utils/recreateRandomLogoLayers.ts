import * as Three from 'three'
import { getAllLogoLayers } from './getAllLogoLayers.ts'
import { createPlanesFromLayers } from './createPlanesFromLayers.ts'

/**
 * Regenerate random logo layers and update scene
 */
export const recreateRandomLogoLayers = (
  THREE: typeof Three,
  scene: Three.Scene,
  currentPlanes: Three.Mesh[],
  planeGeometry: Three.PlaneGeometry,
  outlineTexture: Three.Texture,
  stencilTexture: Three.Texture,
) => {
  // Clean up all current meshes
  currentPlanes.forEach((plane) => {
    scene.remove(plane)
    if (plane.material instanceof THREE.Material) plane.material.dispose()
    plane.geometry.dispose()
  })

  // Get fresh layer configuration
  const allLayers = getAllLogoLayers()

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
