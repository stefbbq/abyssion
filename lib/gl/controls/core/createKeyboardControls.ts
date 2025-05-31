import type { KeyboardInputConfig } from '../types.ts'

/**
 * Keyboard action handlers
 */
type KeyboardActions = {
  readonly onToggleRotation: () => void
  readonly onRegenerateLayers: () => void
}

/**
 * Create keyboard controls system with functional approach
 * Returns control functions instead of directly mutating DOM
 */
export const createKeyboardControls = (
  config: KeyboardInputConfig,
  actions: KeyboardActions,
) => {
  let isActive = false

  const handleKeyDown = (event: KeyboardEvent) => {
    if (config.toggleRotation.includes(event.key)) {
      actions.onToggleRotation()
    }

    if (config.regenerateLayers.includes(event.key)) {
      actions.onRegenerateLayers()
    }
  }

  const activate = () => {
    if (isActive) return

    globalThis.addEventListener('keydown', handleKeyDown)
    isActive = true
  }

  const deactivate = () => {
    if (!isActive) return

    globalThis.removeEventListener('keydown', handleKeyDown)
    isActive = false
  }

  const cleanup = () => {
    deactivate()
  }

  const getState = () => ({ isActive })

  return {
    activate,
    deactivate,
    cleanup,
    getState,
  }
}
