#!/usr/bin/env deno run --allow-read

/**
 * Animation module test runner
 * Runs all unit tests for the animation system
 */

// Import all test files to ensure they're executed
import './utils/timeUtils.test.ts'
import './calculations/calculateShaderTime.test.ts'
import './calculations/calculateBloomEffect.test.ts'
import './calculations/calculateRegenerationTiming.test.ts'
import './calculations/calculateMouseRotation.test.ts'
import './calculations/calculateRotationInterpolation.test.ts'
import './core/createAnimationEngine.test.ts'
import './core/updateAnimationEngine.test.ts'

console.log('🧪 Animation module tests loaded')
console.log('Run with: deno test lib/gl/animation/tests/')
