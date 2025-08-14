import * as Three from 'three'
import type { BokehParams } from '@lib/gl/configPostProcessing.types.ts'

export const createBokehPass = async (
  _THREE: typeof Three,
  scene: Three.Scene,
  camera: Three.Camera,
  width: number,
  height: number,
  bokeh?: BokehParams,
) => {
  if (!bokeh) return null

  const { BokehPass } = await import('three/examples/jsm/postprocessing/BokehPass.js')
  return new BokehPass(scene, camera, {
    focus: bokeh.focus,
    aperture: bokeh.aperture,
    maxblur: bokeh.maxblur,
    width,
    height,
  })
}
