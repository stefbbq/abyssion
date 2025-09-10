/**
 * Global state for the UI
 */
import { signal } from '@preact/signals'

/**
 * Global override for themed background intensity (0..1). null disables override
 */
export const backgroundIntensityOverride = signal<number | null>(null)

/**
 * Set the background intensity override
 *
 * @param value - The value to set the background intensity override to
 */
export const setBackgroundIntensityOverride = (value: number | null) => {
  backgroundIntensityOverride.value = value
}

/**
 * Global background intensity (0..1), driven by GL orchestrators
 */
export const backgroundIntensity = signal<number>(0)

/**
 * Set the global background intensity
 */
export const setBackgroundIntensity = (value: number) => {
  backgroundIntensity.value = value
}
