import * as Three from 'three'
import { getGLTheme } from '@libgl/theme/index.ts'

/**
 * Create and initialize the basic 3D scene
 */
export const createScene = (
  THREE: typeof Three,
): Promise<Three.Scene> => {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(getGLTheme().background)
  return scene
}
