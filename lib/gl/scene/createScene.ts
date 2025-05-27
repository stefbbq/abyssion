import { getCurrentTheme } from '@libgl/theme.ts'

/**
 * Create and initialize the basic 3D scene
 */
export const createScene = (
  THREE: typeof import('three'),
): Promise<import('three').Scene> => {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(getCurrentTheme().background)
  return scene
}
