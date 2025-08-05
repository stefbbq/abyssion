import * as THREE from 'three'

import type { RendererState, T_THREE, UIOverlay } from '../types.ts'
import type { LogoController, LogoLayer } from '../layers/LogoLayer.ts'
import type { VideoBackgroundManager } from '../textures/VideoCycle/types.ts'
import type { ShadowLayer } from '../layers/ShadowLayer.ts'
import type { SceneOrchestrator } from '../animation/types.ts'

/**
 * Creates the initial state object for the GL renderer.
 * This function initializes a comprehensive state object with default values,
 * which will be populated and updated throughout the application lifecycle.
 *
 * @param THREE - The Three.js library instance.
 * @returns An initial `RendererState` object.
 */
export const createInitialGLState = (
  THREE_instance: T_THREE,
): RendererState => {
  return {
    scene: null as THREE.Scene | null,
    camera: null as THREE.Camera | null,
    renderer: null as THREE.WebGLRenderer | null,
    composer: null as THREE.ShaderPass | null,
    bokehPass: null as THREE.ShaderPass | null,
    bloomPass: null as THREE.ShaderPass | null,
    finalPass: null as THREE.ShaderPass | null,
    ditheringPass: null as THREE.ShaderPass | null,
    sharpeningPass: null as THREE.ShaderPass | null,
    pixelationPass: null as THREE.ShaderPass | null,
    pixelBleedPass: null as THREE.ShaderPass | null,
    crtPass: null as THREE.ShaderPass | null,
    logoController: null as LogoController | null,
    logoPlanes: [] as THREE.Mesh[],
    logoLayers: [] as LogoLayer[],
    time: 0,
    planeGeometry: null as THREE.PlaneGeometry | null,
    outlineTexture: null as THREE.Texture | null,
    stencilTexture: null as THREE.Texture | null,
    THREE: THREE_instance,
    uiOverlay: {
      scene: null,
      camera: null,
      resize: () => {},
    } as UIOverlay,
    shapeLayer: null as THREE.Group | null,
    shadowLayer: null as ShadowLayer | null,
    videoBackground: null as VideoBackgroundManager | null,
    controls: null as THREE.OrbitControls | null,
    sceneOrchestrator: null as SceneOrchestrator | null,
    get isReady() {
      return !!this.videoBackground?.getDebugInfo?.().isPlaying && !!this.logoController
    },
  }
}
