import * as Three from 'three'
import videoCycleConfig from '@lib/configVideoCycle.json' with { type: 'json' }
import { getBaselineDimensions } from './utils/getBaselineDimensions.ts'
import { calculateFarPlaneSize } from './utils/calculateFarPlaneSize.ts'
import { createVideoCycle } from '@libgl/textures/VideoCycle/index.ts'
import type { VideoBackgroundManager } from '@libgl/types.ts'

/**
 * Creates a dual-buffer video background system with seamless cycling and responsive scaling.
 *
 * Sets up two video planes (front and back buffers) for smooth video transitions without
 * interruption. Handles responsive scaling to ensure video coverage across all viewport sizes
 * with 10% overflow to prevent edge artifacts. Integrates with the VideoCycle system for
 * automatic video loading, cycling, and texture management. Returns a manager that provides
 * update and disposal methods for the complete video background lifecycle.
 * Returns undefined if video backgrounds are disabled in configuration.
 */
export const createVideoBackground = async (
  THREE: typeof Three,
  scene: Three.Scene,
): Promise<VideoBackgroundManager | undefined> => {
  if (!videoCycleConfig.enabled) return undefined

  // Get baseline dimensions including video plane sizing
  const { videoPlaneWidth, videoPlaneHeight } = getBaselineDimensions()

  // Create two video planes - one for active display, one for buffering
  const createPlane = () => {
    const geometry = new THREE.PlaneGeometry(videoPlaneWidth, videoPlaneHeight)
    const material = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
      side: THREE.FrontSide,
    })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.z = videoCycleConfig.position.z
    scene.add(mesh)

    return { mesh, material, geometry }
  }

  const frontBuffer = createPlane()
  const backBuffer = createPlane()

  // Handle resize to update plane scales
  const handleResize = () => {
    const { cameraZ, fov } = getBaselineDimensions()

    // Calculate the size needed to cover the current viewport
    const requiredSize = calculateFarPlaneSize(fov, cameraZ, videoCycleConfig.position.z)

    // Calculate scale factors based on current plane size vs required size
    const scaleX = (requiredSize.width * 1.1) / videoPlaneWidth // 10% overflow
    const scaleY = (requiredSize.height * 1.1) / videoPlaneHeight // 10% overflow

    // Use the larger scale to ensure full coverage
    const scale = Math.max(scaleX, scaleY)
    const configScale = videoCycleConfig.position.scale || 1
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
  const videoCycle = createVideoCycle(frontBuffer, backBuffer)

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
    mesh: frontBuffer.mesh,
  }
}
