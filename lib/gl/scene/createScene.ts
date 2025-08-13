import * as Three from 'three'
import { currentGLTheme } from '@lib/theme/index.ts'
import { isMobileDevice } from './utils/isMobileDevice.ts'

/**
 * Create and initialize the basic 3D scene
 */
export const createScene = (
  THREE: typeof Three,
): Promise<Three.Scene> => {
  const scene = new THREE.Scene()
  if (!isMobileDevice()) {
    const bg = currentGLTheme.value.baseLayerColor
    scene.background = new THREE.Color(bg.r, bg.g, bg.b)
  } else {
    // make scene transparent on mobile so UI background/gradient shows through
    scene.background = null
  }
  return scene
}
