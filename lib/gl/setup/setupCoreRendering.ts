import * as Three from 'three'
import type { InitOptions } from '@libgl/types.ts'
import { createScene } from '@libgl/scene/createScene.ts'
import { createCamera } from '@libgl/scene/createCamera.ts'
import { createRenderer } from '@libgl/scene/createRenderer.ts'
import { getResponsiveCameraZ } from '@libgl/scene/utils/getResponsiveCameraZ.ts'

type CoreRenderingResult = {
  scene: Three.Scene
  camera: Three.Camera
  renderer: Three.WebGLRenderer
}

/**
 * Sets up the core Three.js rendering components (scene, camera, renderer)
 * with initial responsive positioning
 */
export const setupCoreRendering = async (
  THREE: typeof Three,
  options: InitOptions,
): Promise<CoreRenderingResult> => {
  const { container } = options

  // Set up the core rendering elements
  const scene = await createScene(THREE)
  const camera = await createCamera(THREE)
  const renderer = await createRenderer(THREE, container)

  // Apply initial responsive camera positioning
  const initialW = container.clientWidth || globalThis.innerWidth
  const initialH = container.clientHeight || globalThis.innerHeight
  const initialAspect = initialW / initialH

  camera.position.z = getResponsiveCameraZ(initialAspect)
  camera.aspect = initialAspect
  camera.updateProjectionMatrix()

  return { scene, camera, renderer }
}
