/// <reference lib="deno.ns" />
import { assert, assertEquals } from '$std/assert/mod.ts'
import { calculateShaderTime } from '../../calculations/calculateShaderTime.ts'

Deno.test('calculateShaderTime - basic functionality', async (test) => {
  await test.step('should return false when not enough time has passed', () => {
    const result = calculateShaderTime(1.0, 0.99, 60, 1.0) // 0.01s passed, need 0.0167s for 60fps
    assertEquals(result.shouldUpdate, false)
    assertEquals(result.newTime, 0)
  })

  await test.step('should return true when enough time has passed', () => {
    const result = calculateShaderTime(1.0, 0.9, 60, 2.0) // 0.1s passed > 0.0167s
    assertEquals(result.shouldUpdate, true)
    assertEquals(result.newTime, 2.0) // 1.0 * 2.0
  })

  await test.step('should handle different fps values', () => {
    const result = calculateShaderTime(2.0, 0, 1, 1.5) // 1 fps = 1 second interval, 2s passed
    assertEquals(result.shouldUpdate, true)
    assertEquals(result.newTime, 3.0) // 2.0 * 1.5
  })
})

Deno.test('calculateShaderTime - glitchy behavior', async (test) => {
  await test.step('should apply glitch effect when conditions are met', () => {
    const result = calculateShaderTime(1.0, 0, 2, 50, true)
    assertEquals(result.shouldUpdate, true)
    // Should be in range due to random factor (0.5 to 1.5)
    assert(result.newTime >= 25) // 1.0 * 50 * 0.5
    assert(result.newTime <= 75) // 1.0 * 50 * 1.5
  })

  await test.step('should not apply glitch when fps too high', () => {
    const result = calculateShaderTime(1.0, 0, 5, 50, true)
    assertEquals(result.shouldUpdate, true)
    assertEquals(result.newTime, 50) // Normal calculation: 1.0 * 50
  })

  await test.step('should not apply glitch when noise rate too low', () => {
    const result = calculateShaderTime(1.0, 0, 2, 30, true)
    assertEquals(result.shouldUpdate, true)
    assertEquals(result.newTime, 30) // Normal calculation: 1.0 * 30
  })
})

Deno.test('calculateShaderTime - edge cases', async (test) => {
  await test.step('should handle zero noise rate', () => {
    const result = calculateShaderTime(1.0, 0, 60, 0)
    assertEquals(result.shouldUpdate, true)
    assertEquals(result.newTime, 0)
  })

  await test.step('should handle exact time boundary', () => {
    const currentTime = 1.0
    const lastUpdateTime = 1.0 - (1.0 / 60) // Exactly one frame ago at 60fps
    const result = calculateShaderTime(currentTime, lastUpdateTime, 60, 1.0)
    assertEquals(result.shouldUpdate, true)
    assertEquals(result.newTime, 1.0)
  })
})
