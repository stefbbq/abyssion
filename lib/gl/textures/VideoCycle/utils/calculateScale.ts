import * as THREE from 'three'
import { VIDEO_CYCLE_CONFIG } from '../config.ts'

/**
 * Calculate and apply scale to a video plane based on aspect ratio
 * @param bufferObj Buffer object with mesh
 * @param cameraZ Z position of the camera
 */
export const calculateScale = (bufferObj: { mesh: THREE.Mesh }, cameraZ: number = 5) => {
  const { mesh } = bufferObj
  const fov = 60
  const aspect = globalThis.innerWidth / globalThis.innerHeight
  const z = VIDEO_CYCLE_CONFIG.position.z
  const planeZ = z
  const distance = Math.abs(cameraZ - planeZ)
  const fovRad = (fov * Math.PI) / 180
  const visibleHeight = 2 * Math.tan(fovRad / 2) * distance
  const visibleWidth = visibleHeight * aspect

  let scale
  if (visibleWidth / visibleHeight > 16 / 9) {
    // Fit height
    scale = visibleHeight / 9
  } else {
    // Fit width
    scale = visibleWidth / 16
  }
  const configScale = VIDEO_CYCLE_CONFIG.position.scale || 1
  mesh.scale.set(scale * configScale, scale * configScale, 1)
}
