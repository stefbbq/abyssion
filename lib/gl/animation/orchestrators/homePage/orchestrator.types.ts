/**
 * bloom override state
 */
export type BloomOverrideState = {
  // the last time the bloom override was regenerated
  lastRegenerateTime: number
  // the next interval at which the bloom override will be regenerated
  nextRegenerateInterval: number
  // whether the bloom override is active
  bloomOverrideActive: boolean
  // the timeout for the bloom override
  bloomOverrideTimeout: ReturnType<typeof setTimeout> | null
}
