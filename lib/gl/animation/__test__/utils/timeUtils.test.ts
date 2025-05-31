/// <reference lib="deno.ns" />
import { assert, assertEquals } from '$std/assert/mod.ts'
import { getRandomInterval, getSafeModulatedTime, shouldUpdateForFps } from '../../utils/timeUtils.ts'

Deno.test('timeUtils - getRandomInterval', async (test) => {
  await test.step('should return value between min and max', () => {
    const result = getRandomInterval('1s', '2s')
    assertEquals(result >= 1000, true)
    assertEquals(result <= 2000, true)
  })

  await test.step('should use default values when no parameters', () => {
    const result = getRandomInterval()
    assertEquals(result >= 1000, true)
    assertEquals(result <= 4000, true)
  })

  await test.step('should handle different time units', () => {
    const result = getRandomInterval('500ms', '1s')
    assertEquals(result >= 500, true)
    assertEquals(result <= 1000, true)
  })
})

Deno.test('timeUtils - getSafeModulatedTime', async (test) => {
  await test.step('should return modulated time within bounds', () => {
    const result = getSafeModulatedTime(5000, '2s')
    assertEquals(result, 1000) // 5000 % 2000 = 1000
  })

  await test.step('should use default modulo duration', () => {
    const result = getSafeModulatedTime(1001000) // 1001 seconds
    assertEquals(result, 1000) // 1001000 % 1000000 = 1000
  })

  await test.step('should handle time less than modulo', () => {
    const result = getSafeModulatedTime(500, '2s')
    assertEquals(result, 500)
  })
})

Deno.test('timeUtils - shouldUpdateForFps', async (test) => {
  await test.step('should return true when enough time has passed', () => {
    const currentTime = 1000
    const lastUpdateTime = 900
    const fps = 60
    const result = shouldUpdateForFps(currentTime, lastUpdateTime, fps)
    assertEquals(result, true) // 100ms > 16.67ms (1000/60)
  })

  await test.step('should return false when not enough time has passed', () => {
    const currentTime = 1000
    const lastUpdateTime = 995
    const fps = 60
    const result = shouldUpdateForFps(currentTime, lastUpdateTime, fps)
    assertEquals(result, false) // 5ms < 16.67ms (1000/60)
  })

  await test.step('should handle different fps values', () => {
    const currentTime = 1000
    const lastUpdateTime = 750
    const fps = 4 // 250ms per frame
    const result = shouldUpdateForFps(currentTime, lastUpdateTime, fps)
    assertEquals(result, true) // 250ms >= 250ms
  })
})
