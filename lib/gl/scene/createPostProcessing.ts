import * as Three from 'three'
import {
  ditheringFragmentShader,
  finalPassFragmentShader,
  pixelationFragmentShader,
  pixelBleedFragmentShader,
  sharpeningFragmentShader,
} from '@lib/gl/shaders/index.ts'
import passthroughVertexShader from '@lib/gl/shaders/glsl/passthrough.vert.ts'
import type { PostProcessingConfig } from '@libgl/configScene.types.ts'
import { currentGLTheme } from '@lib/theme/index.ts'

/**
 * Creates a comprehensive post-processing pipeline with cinematic effects.
 *
 * Sets up an EffectComposer with a complete chain of visual effects. Each effect is configured based on
 * the provided postProcessingConfig and can be individually enabled/disabled.
 * The pipeline transforms the raw 3D render into a polished, cinematic final image
 * with analog film characteristics and professional color grading.
 */
export const createPostProcessing = async (
  THREE: typeof Three,
  scene: Three.Scene,
  camera: Three.Camera,
  renderer: Three.WebGLRenderer,
  width: number,
  height: number,
  postProcessingConfig: PostProcessingConfig,
) => {
  const [
    { EffectComposer },
    { RenderPass },
    { UnrealBloomPass },
    { ShaderPass },
    { FilmPass },
    { BokehPass },
  ] = await Promise.all([
    import('three/examples/jsm/postprocessing/EffectComposer.js'),
    import('three/examples/jsm/postprocessing/RenderPass.js'),
    import('three/examples/jsm/postprocessing/UnrealBloomPass.js'),
    import('three/examples/jsm/postprocessing/ShaderPass.js'),
    import('three/examples/jsm/postprocessing/FilmPass.js'),
    import('three/examples/jsm/postprocessing/BokehPass.js'),
  ])

  /**
   * Creates an effect composer and adds a render pass to it.
   *
   * The effect composer is the container for all the post-processing effects.
   * The render pass is the first pass in the chain.
   * It renders the scene to a texture and is the first pass in the chain.
   */
  const composer = new EffectComposer(renderer)
  const renderPass = new RenderPass(scene, camera)
  composer.addPass(renderPass)

  /**
   * BokehPass (Depth of Field)
   * Applies a depth-of-field effect, blurring objects outside the focal plane for a more photographic, cinematic look.
   * Useful for drawing attention to the subject and adding realism by simulating camera lens focus.
   */
  const { bokeh } = postProcessingConfig
  const bokehPass = new BokehPass(scene, camera, {
    focus: bokeh.focus,
    aperture: bokeh.aperture,
    maxblur: bokeh.maxblur,
    width,
    height,
  })
  composer.addPass(bokehPass)

  /**
   * UnrealBloomPass (Bloom)
   * Creates a glowing effect around bright areas of the image, simulating how real cameras and eyes perceive intense light.
   * This makes highlights pop and gives the scene a more atmospheric, dreamy quality.
   */
  const { bloom } = postProcessingConfig
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(width, height),
    bloom.bloomStrength * bloom.bloomStrengthMultiplier,
    bloom.bloomRadius,
    bloom.bloomThreshold * bloom.bloomThresholdMultiplier,
  )
  composer.addPass(bloomPass)
  bloomPass.threshold = bloom.thresholdOverride

  /**
   * SharpeningPass
   * Enhances fine details and edges in the image, counteracting any softness introduced by previous effects (like bloom or bokeh).
   * Helps keep the final result crisp and visually striking.
   */
  const { sharpening } = postProcessingConfig
  const sharpeningPass = new ShaderPass({
    uniforms: {
      tDiffuse: { value: null },
      sharpStrength: { value: sharpening.strength },
      resolution: { value: new THREE.Vector2(width, height) },
    },
    vertexShader: passthroughVertexShader,
    fragmentShader: sharpeningFragmentShader,
  })
  if (sharpening.enabled) composer.addPass(sharpeningPass)

  /**
   * PixelationPass
   * Applies a blocky pixelation effect to the image. Controlled by postProcessingConfig.pixelate.
   */
  const pixelateConfig = postProcessingConfig.pixelate || { enabled: false, pixelSize: 16 }
  const pixelationPass = new ShaderPass({
    uniforms: {
      tDiffuse: { value: null },
      pixelSize: { value: pixelateConfig.pixelSize },
      resolution: { value: new THREE.Vector2(width, height) },
    },
    vertexShader: passthroughVertexShader,
    fragmentShader: pixelationFragmentShader,
  })
  pixelationPass.enabled = pixelateConfig.enabled
  composer.addPass(pixelationPass)

  /**
   * Pixel Bleed Pass
   * Applies advanced pixel bleed corruption that samples large chunks and stretches them
   * using geometric shapes. Creates a computerized corruption that builds on itself.
   */
  const pixelBleedPass = new ShaderPass({
    uniforms: {
      tDiffuse: { value: null },
      time: { value: 0 },
      resolution: { value: new THREE.Vector2(width, height) },
      intensity: { value: 0.0 },
      chunkSize: { value: 30.0 },
      chunkRandomness: { value: 0.5 },
      stretchDistance: { value: 0.3 },
      geometryComplexity: { value: 0.7 },
      persistence: { value: 0.6 },
      regenerationRate: { value: 0.4 },
    },
    vertexShader: passthroughVertexShader,
    fragmentShader: pixelBleedFragmentShader,
  })
  pixelBleedPass.enabled = false // Disabled by default
  composer.addPass(pixelBleedPass)

  /**
   * FilmPass
   * Adds film grain and scanlines to the rendered image, simulating the look of analog film and adding subtle movement and texture.
   * This enhances depth perception and reduces the digital "cleanliness" of the render.
   * Now applied after pixelation for correct visual stacking.
   */
  const { film } = postProcessingConfig
  const filmPass = new FilmPass(
    film.noiseIntensity,
    film.scanlineIntensity,
    film.scanlineCount,
    film.grayscale,
  )
  composer.addPass(filmPass)

  /**
   * FinalPass
   * Applies final color grading and chromatic aberration.
   * Now supports segmented, flickery, theme-colored glitch bands.
   * All effect parameters are exposed as uniforms for animation control.
   */
  const { finalPass: finalPassConfig } = postProcessingConfig
  const glTheme = currentGLTheme.value
  const themePrimary = new THREE.Color(glTheme.primary)
  const themeAccent = new THREE.Color(glTheme.accent)
  const themeSecondary = new THREE.Color(glTheme.secondary)

  const finalPass = new ShaderPass({
    uniforms: {
      tDiffuse: { value: null },
      time: { value: 0 },
      chromaStrength: { value: finalPassConfig.chromaStrength },
      gain: { value: finalPassConfig.gain ?? 1.0 },
      contrast: { value: finalPassConfig.contrast ?? 1.0 },
      segmentedGlitchMode: { value: 0 }, // 0 = classic, 1 = segmented
      glitchIntensity: { value: 0.7 }, // exposed for animation
      flickerRate: { value: 2.0 }, // slower block animation for analog feel
      colorPopIntensity: { value: 1 }, // exposed for animation
      themePrimary: { value: themePrimary.toArray() },
      themeAccent: { value: themeAccent.toArray() },
      themeSecondary: { value: themeSecondary.toArray() },
      blockSize: { value: 48 }, // average block size (larger = fewer, bigger blocks)
      blockOnProbability: { value: 0.000 }, // probability a block is on (lower = cleaner signal)
      burstProbability: { value: 0.1 }, // probability of a global burst (lower = rarer bursts)
    },
    vertexShader: passthroughVertexShader,
    fragmentShader: finalPassFragmentShader,
  })

  finalPass.renderToScreen = true
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
      ditherStrength: { value: finalPassConfig.ditherStrength },
      ditherFrequency: { value: finalPassConfig.ditherFrequency },
      ditherAnimation: { value: finalPassConfig.ditherAnimation },
    },
    vertexShader: passthroughVertexShader,
    fragmentShader: ditheringFragmentShader,
  })
  ditheringPass.renderToScreen = true
  composer.addPass(ditheringPass)

  return { composer, bokehPass, bloomPass, finalPass, ditheringPass, sharpeningPass, pixelationPass, pixelBleedPass }
}
