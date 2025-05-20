import { RENDERER_CONFIG } from './config.ts'

/**
 * Create and initialize the renderer
 */
export const createRenderer = (
  THREE: typeof import('three'),
  width: number,
  height: number,
  container: HTMLDivElement,
): Promise<import('three').WebGLRenderer> => {
  const renderer = new THREE.WebGLRenderer({
    antialias: RENDERER_CONFIG.antialias,
    alpha: RENDERER_CONFIG.alpha,
  })

  const updateSize = () => {
    const w = Math.max(width, container.clientWidth || globalThis.innerWidth)
    const h = Math.max(height, container.clientHeight || globalThis.innerHeight)
    renderer.setSize(w, h)
    renderer.setPixelRatio(Math.min(
      globalThis.devicePixelRatio * RENDERER_CONFIG.pixelRatioMultiplier,
      RENDERER_CONFIG.pixelRatioMax,
    ))
  }
  updateSize()
  globalThis.addEventListener('resize', updateSize)
  while (container.firstChild) container.removeChild(container.firstChild)
  container.style.width = '100%'
  container.style.height = '100%'
  container.style.overflow = 'hidden'
  container.style.position = 'relative'

  const canvas = renderer.domElement
  canvas.style.display = 'block'
  canvas.style.position = 'absolute'
  canvas.style.top = '0'
  canvas.style.left = '0'
  container.appendChild(canvas)

  return renderer
}
