import * as Three from 'three'
import type { PostProcessingConfig } from '@lib/gl/configPostProcessing.types.ts'
import { lc as _lc, log as _log } from '@lib/logger/index.ts'
import { createBokehPass } from '@lib/gl/scene/postPorcessingPasses/createBokehPass.ts'
import { createBloomPass } from '@lib/gl/scene/postPorcessingPasses/createBloomPass.ts'
import { createSharpeningPass } from '@lib/gl/scene/postPorcessingPasses/createSharpeningPass.ts'
import { createPixelationPass } from '@lib/gl/scene/postPorcessingPasses/createPixelationPass.ts'
import { createPixelBleedPass } from '@lib/gl/scene/postPorcessingPasses/createPixelBleedPass.ts'
import { createCRTPass } from '@lib/gl/scene/postPorcessingPasses/createCRTPass.ts'
import { createFilmPass } from '@lib/gl/scene/postPorcessingPasses/createFilmPass.ts'
import { createFinalPass } from '@lib/gl/scene/postPorcessingPasses/createFinalPass.ts'
import { createDitheringPass } from '@lib/gl/scene/postPorcessingPasses/createDitheringPass.ts'

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
  postProcessingConfig?: Partial<PostProcessingConfig>,
) => {
  const [{ EffectComposer }, { RenderPass }] = await Promise.all([
    import('three/examples/jsm/postprocessing/EffectComposer.js'),
    import('three/examples/jsm/postprocessing/RenderPass.js'),
  ])

  if (postProcessingConfig?.enabled === false) {
    const composer = new EffectComposer(renderer)
    const renderPass = new RenderPass(scene, camera)
    composer.addPass(renderPass)

    return {
      composer,
      bokehPass: null,
      bloomPass: null,
      finalPass: null,
      ditheringPass: null,
      sharpeningPass: null,
      pixelationPass: null,
      pixelBleedPass: null,
      crtPass: null,
    }
  }

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
  const bokehPass = await createBokehPass(THREE, scene, camera, width, height, postProcessingConfig?.bokeh)
  if (bokehPass) composer.addPass(bokehPass)

  /**
   * UnrealBloomPass (Bloom)
   * Creates a glowing effect around bright areas of the image, simulating how real cameras and eyes perceive intense light.
   * This makes highlights pop and gives the scene a more atmospheric, dreamy quality.
   */
  const bloomPass = await createBloomPass(THREE, width, height, postProcessingConfig?.bloom)
  if (bloomPass) composer.addPass(bloomPass)

  /**
   * SharpeningPass
   * Enhances fine details and edges in the image, counteracting any softness introduced by previous effects (like bloom or bokeh).
   * Helps keep the final result crisp and visually striking.
   */
  const sharpeningPass = await createSharpeningPass(THREE, width, height, postProcessingConfig?.sharpening)
  if (sharpeningPass) composer.addPass(sharpeningPass)

  /**
   * PixelationPass
   * Applies a blocky pixelation effect to the image. Controlled by postProcessingConfig.pixelate.
   */
  const pixelationPass = await createPixelationPass(THREE, width, height, postProcessingConfig?.pixelate)
  if (pixelationPass) composer.addPass(pixelationPass)

  /**
   * Pixel Bleed Pass
   * Applies advanced pixel bleed corruption that samples large chunks and stretches them
   * using geometric shapes. Creates a computerized corruption that builds on itself.
   */
  const pixelBleedPass = await createPixelBleedPass(THREE, width, height)
  if (pixelBleedPass) composer.addPass(pixelBleedPass)

  /**
   * CRT Corruption Pass
   * Applies CRT-style corruption effects including RGB distortion, block corruption,
   * white noise, wave distortion, and screen shake. This creates retro TV-like glitches
   * and distortion effects controlled by scroll position and debug parameters.
   */
  const crtPass = await createCRTPass(THREE, width, height, postProcessingConfig?.crtScrollCorruption)
  if (crtPass?.enabled) composer.addPass(crtPass)

  /**
   * FilmPass
   * Adds film grain and scanlines to the rendered image, simulating the look of analog film and adding subtle movement and texture.
   * This enhances depth perception and reduces the digital "cleanliness" of the render.
   * Now applied after pixelation for correct visual stacking.
   */
  const filmPass = await createFilmPass(postProcessingConfig?.film)
  if (filmPass) composer.addPass(filmPass)

  /**
   * FinalPass
   * Applies final color grading and chromatic aberration.
   * Now supports segmented, flickery, theme-colored glitch bands.
   * All effect parameters are exposed as uniforms for animation control.
   */
  const finalPassConfig = postProcessingConfig?.finalPass
  const finalPass = await createFinalPass(THREE, finalPassConfig)
  if (finalPass) composer.addPass(finalPass)

  /**
   * DitheringPass
   * Adds subtle noise to the image to break up color banding, especially in gradients and after heavy post-processing.
   * This ensures smooth transitions and a more natural look by simulating the effect of analog film grain.
   * This pass is rendered to screen as the absolute last step.
   */
  const ditheringPass = await createDitheringPass(finalPassConfig)
  if (ditheringPass) composer.addPass(ditheringPass)

  return {
    composer,
    bokehPass,
    bloomPass,
    finalPass,
    ditheringPass,
    sharpeningPass,
    pixelationPass,
    pixelBleedPass,
    crtPass,
  }
}
