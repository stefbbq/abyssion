import * as Three from 'three'
import configScene from '@libgl/configScene.json' with { type: 'json' }
import type { ConfigScene } from '@libgl/configScene.types.ts'

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
  container: HTMLDivElement,
): Promise<Three.WebGLRenderer> => {
  const { rendererConfig } = configScene as ConfigScene

  const renderer = new THREE.WebGLRenderer({
    antialias: rendererConfig.antialias,
    alpha: rendererConfig.alpha,
  })

  // enable ACES Filmic tone mapping for exposure control
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  // set overall exposure (scene brightness) from config
  renderer.toneMappingExposure = rendererConfig.exposure

  const updateSize = () => {
    // Use actual viewport dimensions, not the initial width/height parameters
    const w = container.clientWidth || globalThis.innerWidth
    const h = container.clientHeight || globalThis.innerHeight
    renderer.setSize(w, h)
    renderer.setPixelRatio(Math.min(
      globalThis.devicePixelRatio * rendererConfig.pixelRatioMultiplier,
      rendererConfig.pixelRatioMax,
    ))
  }

  updateSize()
  globalThis.addEventListener('resize', updateSize)

  // Set up the GL container
  while (container.firstChild) container.removeChild(container.firstChild)
  container.style.width = '100%'
  container.style.height = '100%'
  container.style.overflow = 'hidden'
  container.style.position = 'relative'

  // Set up the HTML canvas
  const canvas = renderer.domElement
  canvas.style.display = 'block'
  canvas.style.position = 'absolute'
  canvas.style.top = '50%'
  canvas.style.left = '50%'
  canvas.style.transform = 'translate(-50%, -50%)'
  canvas.style.width = '100%'
  canvas.style.height = '100%'
  container.appendChild(canvas)

  return renderer
}
