/**
 * Centralized GL runtime state and accessors
 */
import { signal } from '@preact/signals'

import type { RendererState } from './types.ts'
import type { PostProcessingConfig } from './configPostProcessing.types.ts'

/**
 * Indicates whether the GL context has been initialized
 */
export const isGLInitialized = signal(false)

/**
 * Internal GL renderer state reference
 */
let glState: RendererState | null = null

export const getGLState = () => glState
export const setGLState = (state: RendererState | null) => {
  glState = state
}

/**
 * Effective post-processing config currently in use (after mobile adjustments)
 */
let currentPostProcessingConfig: PostProcessingConfig | null = null

export const getCurrentPostProcessingConfig = () => currentPostProcessingConfig
export const setCurrentPostProcessingConfig = (cfg: PostProcessingConfig | null) => {
  currentPostProcessingConfig = cfg
}

/**
 * Convenience accessor for the SceneOrchestrator
 */
export const getSceneOrchestrator = () => glState?.sceneOrchestrator

/**
 * Route path telemetry (e.g., '/', '/bio')
 */
export const currentPath = signal<string>('/')
export const setCurrentPath = (path: string) => {
  currentPath.value = path
}

/**
 * Viewport size telemetry
 */
export const viewportSize = signal<{ width: number; height: number }>({ width: 0, height: 0 })
export const setViewportSize = (width: number, height: number) => {
  viewportSize.value = { width, height }
}

/**
 * Scroll position telemetry for GL side-effects
 */
export const scrollY = signal<number>(0)
export const setScrollY = (y: number) => {
  scrollY.value = y
}
