import * as Three from 'three'
import configScene from '@libgl/configScene.json' with { type: 'json' }
import type { ConfigScene } from '@libgl/configScene.types.ts'
import { lc, log } from '@lib/logger/index.ts'

/**
 * Creates and configures a WebGL renderer with responsive sizing and DOM integration.
 *
 * Sets up a Three.js WebGLRenderer with antialiasing and alpha blending enabled,
 * automatically handles viewport resizing, and integrates the canvas into the provided
 * DOM container with proper styling for full-screen coverage. Clears any existing
 * content from the container and applies CSS positioning to center the canvas.
 * Pixel ratio is capped based on configScene to prevent performance issues on high-DPI displays.
 */
export const createRenderer = (
  THREE: typeof Three,
  canvas: HTMLCanvasElement,
): Promise<Three.WebGLRenderer> => {
  const { rendererConfig } = configScene as ConfigScene

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: rendererConfig.antialias,
    alpha: rendererConfig.alpha,
  })

  renderer.setClearColor(0x000000, 1)

  // Debug: Check if WebGL context is available
  const gl = renderer.getContext()
  log(lc.GL, 'WebGL context:', gl)
  log(lc.GL, 'WebGL version:', gl.getParameter(gl.VERSION))
  log(lc.GL, 'WebGL vendor:', gl.getParameter(gl.VENDOR))
  log(lc.GL, 'WebGL renderer:', gl.getParameter(gl.RENDERER))

  // enable ACES Filmic tone mapping for exposure control
  renderer.toneMapping = THREE.ACESFilmicToneMapping

  // set overall exposure (scene brightness) from config
  renderer.toneMappingExposure = rendererConfig.exposure

  const updateSize = () => {
    // Use actual viewport dimensions, not the initial width/height parameters
    const w = globalThis.innerWidth
    const h = globalThis.innerHeight
    renderer.setSize(w, h)
    renderer.setPixelRatio(Math.min(
      globalThis.devicePixelRatio * rendererConfig.pixelRatioMultiplier,
      rendererConfig.pixelRatioMax,
    ))
    canvas.style.width = `${w}px`
    canvas.style.height = `${h}px`
  }

  updateSize()
  globalThis.addEventListener('resize', updateSize)

  // Set up the HTML canvas
  canvas.style.display = 'block'
  canvas.style.position = 'fixed'
  canvas.style.inset = '0'
  canvas.style.background = 'black'

  return renderer
}
