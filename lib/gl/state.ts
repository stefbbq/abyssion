import { signal } from '@preact/signals'

/**
 * A signal that indicates whether the GL context has been initialized.
 */
export const isGLInitialized = signal(false)
