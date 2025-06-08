import * as Three from 'three'

/**
 * Disposes all logo layer meshes and materials from the scene
 *
 * @param scene - The THREE.js scene containing the logo layers
 * @param planes - Array of plane meshes representing the logo layers
 *
 * @remarks
 * This function properly cleans up all THREE.js resources to prevent memory leaks.
 * It disposes geometries and materials before removing the planes from the scene.
 */
export const disposeLogoLayers = (scene: Three.Scene, planes: Three.Mesh[]) => {
  planes.forEach((plane) => {
    plane.geometry.dispose()
    if (plane.material instanceof Object) plane.material.dispose()
    scene.remove(plane)
  })
}
