import * as Three from 'three'

/**
 * Disposes all logo layer meshes and materials from the scene
 *
 * @param scene - The THREE.js scene containing the logo layers
 * @param planes - Array of plane meshes representing the logo layers
 *
 * @remarks
 * This function properly cleans up all THREE.js resources to prevent memory leaks.
 * It disposes the unique material for each plane before removing it from the scene.
 * It does NOT dispose of the geometry, as it is shared across multiple layers and scenes.
 */
export const disposeLogoLayers = (scene: Three.Scene, planes: Three.Mesh[]) => {
  planes.forEach((plane) => {
    // Only dispose the material, not the shared geometry
    if (plane.material instanceof Three.Material) {
      plane.material.dispose()
    }
    scene.remove(plane)
  })
}
