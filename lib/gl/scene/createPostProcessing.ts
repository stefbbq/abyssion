import type { BloomParams } from '../types.ts'
import { DEFAULT_BLOOM_PARAMS, POST_PROCESSING_CONFIG } from './config.ts'
import {
  ditheringFragmentShader,
  ditheringVertexShader,
  finalPassFragmentShader,
  finalPassVertexShader,
  sharpeningFragmentShader,
  sharpeningVertexShader,
} from '../shaders/index.ts'

/**
 * Create post-processing effects
 */
export const createPostProcessing = async (
  THREE: typeof import('three'),
  scene: import('three').Scene,
  camera: import('three').Camera,
  renderer: import('three').WebGLRenderer,
  width: number,
  height: number,
  bloomParams: BloomParams = DEFAULT_BLOOM_PARAMS,
) => {
  const { EffectComposer } = await import('three/examples/jsm/postprocessing/EffectComposer.js')
  const { RenderPass } = await import('three/examples/jsm/postprocessing/RenderPass.js')
  const { UnrealBloomPass } = await import('three/examples/jsm/postprocessing/UnrealBloomPass.js')
  const { ShaderPass } = await import('three/examples/jsm/postprocessing/ShaderPass.js')
  const { FilmPass } = await import('three/examples/jsm/postprocessing/FilmPass.js')

  const composer = new EffectComposer(renderer)
  const renderPass = new RenderPass(scene, camera)
  composer.addPass(renderPass)

  /**
   * BokehPass (Depth of Field)
   * Applies a depth-of-field effect, blurring objects outside the focal plane for a more photographic, cinematic look.
   * Useful for drawing attention to the subject and adding realism by simulating camera lens focus.
   */
  const { BokehPass } = await import('three/examples/jsm/postprocessing/BokehPass.js')
  const bokehPass = new BokehPass(scene, camera, {
    focus: 4.0, // Focus distance (adjust as needed)
    aperture: 0.025, // Smaller = more blur
    maxblur: 1,
    width,
    height,
  })
  composer.addPass(bokehPass)

  /**
   * FilmPass
   * Adds film grain and scanlines to the rendered image, simulating the look of analog film and adding subtle movement and texture.
   * This enhances depth perception and reduces the digital "cleanliness" of the render.
   */
  const { film } = POST_PROCESSING_CONFIG
  const filmPass = new FilmPass(
    film.noiseIntensity,
    film.scanlineIntensity,
    film.scanlineCount,
    film.grayscale,
  )
  composer.addPass(filmPass)

  /**
   * UnrealBloomPass (Bloom)
   * Creates a glowing effect around bright areas of the image, simulating how real cameras and eyes perceive intense light.
   * This makes highlights pop and gives the scene a more atmospheric, dreamy quality.
   */
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(width, height),
    bloomParams.bloomStrength * 3, // Increase bloom strength multiplier
    bloomParams.bloomRadius,
    bloomParams.bloomThreshold * 0.3, // Lower threshold for more effect
  )
  composer.addPass(bloomPass)
  bloomPass.threshold = 0 // Make bloom visible even on dark colors

  /**
   * SharpeningPass
   * Enhances fine details and edges in the image, counteracting any softness introduced by previous effects (like bloom or bokeh).
   * Helps keep the final result crisp and visually striking.
   */
  const sharpeningPass = new ShaderPass({
    uniforms: {
      tDiffuse: { value: null },
      sharpStrength: { value: POST_PROCESSING_CONFIG.sharpening.strength },
      resolution: { value: new THREE.Vector2(width, height) },
    },
    vertexShader: sharpeningVertexShader,
    fragmentShader: sharpeningFragmentShader,
  })
  if (POST_PROCESSING_CONFIG.sharpening.enabled) {
    composer.addPass(sharpeningPass)
  }

  /**
   * FinalPass
   * Applies final color grading and chromatic aberration (subtle color fringing on edges) to give the render a unique visual signature.
   * This is the last "creative" pass before output.
   */
  const finalPass = new ShaderPass({
    uniforms: {
      tDiffuse: { value: null },
      time: { value: 0 },
      chromaStrength: { value: POST_PROCESSING_CONFIG.finalPass.chromaStrength },
    },
    vertexShader: finalPassVertexShader,
    fragmentShader: finalPassFragmentShader,
  })
  composer.addPass(finalPass)

  /**
   * DitheringPass
   * Adds subtle noise to the image to break up color banding, especially in gradients and after heavy post-processing.
   * This ensures smooth transitions and a more natural look by simulating the effect of analog film grain.
   * This pass is rendered to screen as the absolute last step.
   */
  const ditheringPass = new ShaderPass({
    uniforms: {
      tDiffuse: { value: null },
      time: { value: 0 },
      ditherStrength: { value: POST_PROCESSING_CONFIG.finalPass.ditherStrength },
      ditherFrequency: { value: POST_PROCESSING_CONFIG.finalPass.ditherFrequency },
      ditherAnimation: { value: POST_PROCESSING_CONFIG.finalPass.ditherAnimation },
    },
    vertexShader: ditheringVertexShader,
    fragmentShader: ditheringFragmentShader,
  })
  ditheringPass.renderToScreen = true
  composer.addPass(ditheringPass)

  return { composer, bokehPass, bloomPass, finalPass, ditheringPass, sharpeningPass }
}
