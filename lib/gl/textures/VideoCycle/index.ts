// Public API exports for Video Cycle system

// Main orchestrator functions
export { createVideoCycle } from './utils/createVideoCycle.ts'
export { createVideoCycleManager } from './utils/createVideoCycleManager.ts'
export { createConfigurableVideoCycleManager } from './utils/createVideoCycleManager.ts'

// Test-enabled orchestrator functions
export {
  createTestableVideoCycleManager,
  createConfigurableTestableVideoCycleManager
} from './utils/createTestableVideoCycleManager.ts'
export type { TestableVideoCycleManager } from './utils/createTestableVideoCycleManager.ts'

// Pure utility functions for external use
export { calculateBufferState } from './utils/calculateBufferState.ts'
export { calculateNextVideoSource } from './utils/calculateNextVideoSource.ts'
export { calculateVideoReadiness } from './utils/calculateVideoReadiness.ts'

// Configuration management functions
export {
  loadConfiguration,
  validateConfiguration,
  createDefaultConfiguration,
  loadConfigurationWithDefaults
} from './utils/loadConfiguration.ts'
export {
  applyConfigurationToVideoPool,
  validateConfigurationRanges,
  detectConfigurationChanges,
  applyConfigurationChanges
} from './utils/applyConfiguration.ts'

// Error handling utilities
export { createErrorHandler } from './utils/createErrorHandler.ts'
export { createMemoryManager } from './utils/createMemoryManager.ts'

// Debug utilities
export { generateDebugInfo } from './utils/generateDebugInfo.ts'

// Test hooks and utilities (only active in test mode)
export {
  createTestHooks,
  injectTestHooks,
  getTestHooks,
  removeTestHooks
} from './utils/__test__/e2e/createTestHooks.ts'
export {
  isTestModeEnabled,
  enableTestMode,
  disableTestMode,
  createControlledTimer,
  enableControlledTiming,
  disableControlledTiming,
  advanceControlledTime,
  resetControlledTime
} from './utils/__test__/e2e/testHooks.ts'
export { NetworkRequestTracker } from './utils/__test__/e2e/NetworkRequestTracker.ts'
export { MemoryUsageTracker } from './utils/__test__/e2e/MemoryUsageTracker.ts'

// Type exports
export type {
  VideoCycleConfig,
  VideoCycleManager,
  VideoPoolState,
  NewPlaybackState,
  LoadingProgress,
  VideoInfo,
  BufferObject,
  PlaybackState,
  VideoManifest,
  VideoPool
} from './types.ts'

// Test hooks type exports
export type {
  TestHooks,
  NetworkRequest,
  MemoryMetrics,
  ControlledTimer
} from './utils/__test__/e2e/testHooks.ts'