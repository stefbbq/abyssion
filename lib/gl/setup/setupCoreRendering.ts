import type { InitOptions } from '../types.ts'
import { createScene } from '../scene/createScene.ts'
import { createCamera } from '../scene/createCamera.ts'
import { createRenderer } from '../scene/createRenderer.ts'
import { getResponsiveCameraZ } from '../scene/utils/getResponsiveCameraZ.ts'

type CoreRenderingResult = {
  scene: any
  camera: any
  renderer: any
}

/**
 * Sets up the core Three.js rendering components (scene, camera, renderer)
 * with initial responsive positioning
 */
export const setupCoreRendering = async (
  THREE: typeof import('three'),
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
