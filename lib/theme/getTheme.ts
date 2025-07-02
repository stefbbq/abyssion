import { computed } from '@preact/signals'
import type { UITheme } from './types.ts'
import { currentBaseTheme } from './state.ts'
import { createTheme } from './createTheme.ts'

/**
 * Computed signal holding the current UITheme object.
 * Use this for all theme-aware UI logic and CSS variable injection.
 */
export const currentTheme = computed<UITheme>(() => createTheme(currentBaseTheme.value))
