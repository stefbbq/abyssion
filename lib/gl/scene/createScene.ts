import * as Three from 'three'
import { currentGLTheme } from '@lib/theme/index.ts'

/**
 * Create and initialize the basic 3D scene
 */
export const createScene = (
  THREE: typeof Three,
): Promise<Three.Scene> => {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(currentGLTheme.value.palette.background)
  return scene
}
