import type { Color } from 'three'
import { getCurrentTheme } from '@libgl/theme.ts'

/**
 * Create and initialize the basic 3D scene
 */
export const createScene = async (
  THREE: typeof import('three'),
  width: number,
  height: number,
): Promise<import('three').Scene> => {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(getCurrentTheme().background)
  return scene
}
