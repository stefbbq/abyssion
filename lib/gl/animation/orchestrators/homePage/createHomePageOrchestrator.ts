import ms from 'ms'
import * as Three from 'three'

import type { AnimationContext, AnimationOrchestrator } from '@libgl/animation/core/types.ts'
import type { RendererState } from '@libgl/types.ts'
import { calculateRegenerationTiming } from './calculations/calculateRegenerationTiming.ts'
import { calculatePlaneUpdate } from './calculations/calculatePlaneUpdate.ts'
import { calculatePostProcessingUpdate } from './calculations/calculatePostProcessingUpdate.ts'
import { calculateRandomLayerPosition } from './calculations/calculateRandomLayerPosition.ts'
import { calculateFadeOpacity } from './calculations/calculateFadeOpacity.ts'
import { GLOBAL_FADE_END_THRESHOLD, GLOBAL_FADE_START_THRESHOLD } from '@libgl/constants.ts'
import { calculateScrollProgress } from '@libgl/animation/calculations/calculateScrollProgress.ts'
import { updateDashedOrbitRotations } from './utils/updateDashedOrbitRotations.ts'
import { applyPlaneUpdate } from './utils/applyPlaneUpdate.ts'
import { applyPostProcessingResult } from './utils/applyPostProcessingResult.ts'
import type { PostProcessingResult as _PostProcessingResult } from './calculations/calculatePostProcessingUpdate.ts'
import type { BloomOverrideState } from './orchestrator.types.ts'
import { scrollState } from '@libgl/animation/state/scrollState.ts'
import { lc, log } from '@lib/logger/index.ts'

/**
 * Home page animation orchestrator (formerly logo page)
 * Manages logo layers, regeneration, and post-processing effects
 * Requires logoController to be available in glState
 */
export const createHomePageOrchestrator = (glState: RendererState): AnimationOrchestrator => {
  log(lc.GL_ANIMATION, 'Creating home page orchestrator')

  const logoController = glState.logoController
  if (!logoController) {
    throw new Error('logoController not available in glState when creating home page orchestrator')
  }

  const stateLocal: BloomOverrideState = {
    lastRegenerateTime: 0,
    nextRegenerateInterval: ms('1s') + Math.random() * ms('3s'),
    bloomOverrideActive: false,
    bloomOverrideTimeout: null,
  }

  const applyGlobalFadeToDashedOrbits = (root: Three.Object3D | null, fadeMultiplier: number) => {
    if (!root) return

    root.traverse((obj: Three.Object3D) => {
      if (!(obj instanceof Three.Mesh)) return
      const mesh = obj as Three.Mesh

      // detect membership in dashed orbit by walking up ancestry to a holder with rotation metadata
      let ancestor: Three.Object3D | null = mesh.parent
      let belongsToDashedOrbit = false
      while (ancestor) {
        const hasRotationData = typeof (ancestor.userData?.rotationSpeed) === 'number'
        if (hasRotationData) {
          belongsToDashedOrbit = true
          break
        }
        ancestor = ancestor.parent
      }
      if (!belongsToDashedOrbit) return

      const materials: Three.Material[] = Array.isArray(mesh.material) ? (mesh.material as Three.Material[]) : [mesh.material as Three.Material]
      // initialize base opacities once
      const existingBase: number[] | undefined = mesh.userData.baseOpacities as number[] | undefined
      if (!existingBase) {
        mesh.userData.baseOpacities = materials.map((m: Three.Material) => m.opacity)
      }
      const baseOpacities: number[] = mesh.userData.baseOpacities as number[]
      materials.forEach((mat: Three.Material, idx: number) => {
        if (typeof mat.opacity === 'number') mat.opacity = baseOpacities[idx] * fadeMultiplier
      })
    })
  }

  const applyGlobalFadeToShadow = (shadowLayer: RendererState['shadowLayer'], fadeMultiplier: number) => {
    if (!shadowLayer?.mesh) return
    const material = shadowLayer.mesh.material

    if (!(material instanceof Three.ShaderMaterial)) return
    const uniforms = material.uniforms

    if (!uniforms?.opacity) return

    if (typeof shadowLayer.mesh.userData.baseShadowOpacity !== 'number') {
      shadowLayer.mesh.userData.baseShadowOpacity = uniforms.opacity.value as number
    }
    uniforms.opacity.value = (shadowLayer.mesh.userData.baseShadowOpacity as number) * fadeMultiplier
  }

  const updateLogoPlanes = (state: RendererState, time: number, scrollProgress: number) => {
    state.logoPlanes.forEach((plane, i) => {
      const layer = state.logoLayers[i]
      if (!layer) return

      const fadeResult = calculateFadeOpacity({
        scrollProgress,
        fadeStartThreshold: GLOBAL_FADE_START_THRESHOLD,
        fadeEndThreshold: GLOBAL_FADE_END_THRESHOLD,
        layerIndex: i,
        totalLayers: state.logoLayers.length,
      })

      const updateResult = calculatePlaneUpdate({
        time,
        planeIndex: i,
        layer: {
          opacity: layer.opacity,
          zPos: layer.zPos,
          fps: layer.fps,
          noiseRate: layer.noiseRate,
          isRandom: layer.isRandom,
          isStencil: layer.isStencil,
        },
        totalLayers: state.logoLayers.length,
        state,
        lastUpdateTime: plane.lastUpdateTime || 0,
      })

      applyPlaneUpdate(
        plane,
        i,
        layer,
        state.logoLayers.length,
        time,
        updateResult,
        fadeResult.fadeMultiplier,
        calculateRandomLayerPosition,
      )
    })
  }

  const update = (context: AnimationContext) => {
    const { state, time } = context

    // defensively clear any background overrides on first update
    // clear any background override set by content-page orchestrator
    try {
      // dynamic import without await to satisfy linter
      import('@lib/ui/state.ts').then((m) => m.setBackgroundIntensityOverride?.(null)).catch(() => {})
    } catch {
      // ignore if dynamic import fails
    }

    // Check layer regeneration timing
    const currentTime = Date.now()
    const regenerationResult = calculateRegenerationTiming(currentTime, stateLocal.lastRegenerateTime, stateLocal.nextRegenerateInterval)

    if (regenerationResult.shouldRegenerate) {
      const { planes, layers } = logoController.regenerate(
        state.scene,
        state.logoPlanes,
        state.planeGeometry,
        state.outlineTexture,
        state.stencilTexture,
      )

      state.logoPlanes = planes
      state.logoLayers = layers
      stateLocal.lastRegenerateTime = currentTime
      stateLocal.nextRegenerateInterval = regenerationResult.newInterval
    }

    // calculate scroll fade shared by non-logo elements
    const scrollProgress = calculateScrollProgress(scrollState.y, globalThis.innerHeight)
    const globalFade = calculateFadeOpacity({
      scrollProgress,
      fadeStartThreshold: GLOBAL_FADE_START_THRESHOLD,
      fadeEndThreshold: GLOBAL_FADE_END_THRESHOLD,
      layerIndex: 0,
      totalLayers: 1,
    }).fadeMultiplier

    // Update logo planes
    updateLogoPlanes(state, time, scrollProgress)

    // Update post-processing effects using pure calculation functions
    const postProcessingResult = calculatePostProcessingUpdate({
      currentTime: time,
      bloomOverrideActive: stateLocal.bloomOverrideActive,
      bloomOverrideTimeout: stateLocal.bloomOverrideTimeout,
      currentChromaStrength: state.finalPass?.uniforms?.chromaStrength?.value || 0,
      rendererWidth: state.renderer.domElement.width,
      rendererHeight: state.renderer.domElement.height,
    })

    const { bloomOverrideActive, bloomOverrideTimeout } = applyPostProcessingResult(
      state,
      postProcessingResult,
      stateLocal.bloomOverrideActive,
      stateLocal.bloomOverrideTimeout,
    )
    stateLocal.bloomOverrideActive = bloomOverrideActive
    stateLocal.bloomOverrideTimeout = bloomOverrideTimeout

    // Update dashed orbit rotations
    updateDashedOrbitRotations(state.scene)

    // Apply scroll-based fade to dashed orbits and shadow layer
    applyGlobalFadeToDashedOrbits(state.shapeLayer ?? state.scene, globalFade)
    applyGlobalFadeToShadow(state.shadowLayer, globalFade)
  }

  const dispose = (context: AnimationContext) => {
    const { state } = context

    // Use the dedicated dispose method from the logoController
    logoController.dispose(state.scene, state.logoPlanes)

    // Clear arrays from state to prevent artifacts on re-navigation
    state.logoPlanes = []
    state.logoLayers = []

    // Clean up timeouts
    if (stateLocal.bloomOverrideTimeout) {
      clearTimeout(stateLocal.bloomOverrideTimeout)
      stateLocal.bloomOverrideTimeout = null
    }

    // Reset local state of the orchestrator
    stateLocal.lastRegenerateTime = 0
    stateLocal.bloomOverrideActive = false
  }

  log(lc.GL_ANIMATION, 'Home page orchestrator created successfully')

  return {
    name: 'home-page',
    update,
    dispose,
  }
}
