import * as THREE from 'three'
import { VIDEO_BACKGROUND_CONFIG } from './config.ts'
import { getResponsiveDimensions } from './utils/getResponsiveDimensions.ts'
import { createVideoCycle } from '../textures/VideoCycle/index.ts'
import type { VideoBackgroundManager } from '../types.ts'

/**
 * Create video background planes and set up video cycling
 * This handles all the scene-related setup, then passes the planes to VideoCycle for texture management
 */
export const createVideoBackground = async (
  THREE: typeof import('three'),
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
): Promise<VideoBackgroundManager | undefined> => {
  if (!VIDEO_BACKGROUND_CONFIG.enabled) return undefined

  // Get responsive dimensions including video plane sizing
  const { videoPlaneWidth, videoPlaneHeight } = getResponsiveDimensions()

  // Create two video planes - one for active display, one for buffering
  const createPlane = () => {
    const geometry = new THREE.PlaneGeometry(videoPlaneWidth, videoPlaneHeight)
    const material = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
      side: THREE.FrontSide,
    })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.z = VIDEO_BACKGROUND_CONFIG.position.z
    scene.add(mesh)

    return { mesh, material, geometry }
  }

  const frontBuffer = createPlane()
  const backBuffer = createPlane()

  // Handle resize to update plane scales
  const handleResize = () => {
    const { cameraZ, fov } = getResponsiveDimensions()

    // Calculate the scale needed for the video planes
    const distance = Math.abs(cameraZ - VIDEO_BACKGROUND_CONFIG.position.z)
    const fovRad = (fov * Math.PI) / 180
    const visibleHeight = 2 * Math.tan(fovRad / 2) * distance

    // Scale to cover visible height with overflow
    const scale = (visibleHeight * 1.1) / videoPlaneHeight
    const configScale = VIDEO_BACKGROUND_CONFIG.position.scale || 1
    const finalScale = scale * configScale

    // Apply scale to both planes
    frontBuffer.mesh.scale.set(finalScale, finalScale, 1)
    backBuffer.mesh.scale.set(finalScale, finalScale, 1)
  }

  // Initial scale setup
  handleResize()

  // Add resize listener
  globalThis.addEventListener('resize', handleResize)

  // Now pass the planes to VideoCycle for texture management
  const videoCycle = await createVideoCycle(THREE, frontBuffer, backBuffer, camera)

  // Return manager with dispose that includes our cleanup
  return {
    update: videoCycle.update,
    dispose: () => {
      globalThis.removeEventListener('resize', handleResize)

      // Remove planes from scene
      scene.remove(frontBuffer.mesh)
      scene.remove(backBuffer.mesh)

      // Dispose geometries and materials
      frontBuffer.geometry.dispose()
      frontBuffer.material.dispose()
      backBuffer.geometry.dispose()
      backBuffer.material.dispose()

      // Dispose video cycle
      videoCycle.dispose()
    },
    mesh: frontBuffer.mesh, // For compatibility
  }
}
