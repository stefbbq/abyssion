import * as THREE from 'three'
import { VIDEO_CYCLE_CONFIG } from '../config.ts'

/**
 * Create a video plane for rendering videos
 * @param THREE THREE.js object
 * @param scene THREE.js scene
 * @returns Video plane object with mesh, material, and geometry
 */
export const createVideoPlane = (THREE: typeof import('three'), scene: THREE.Scene) => {
  const geometry = new THREE.PlaneGeometry(16, 9)
  const material = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0, // Start invisible
    side: THREE.FrontSide,
  })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.z = VIDEO_CYCLE_CONFIG.position.z

  // Add to scene but start invisible
  scene.add(mesh)

  return { mesh, material, geometry }
}
