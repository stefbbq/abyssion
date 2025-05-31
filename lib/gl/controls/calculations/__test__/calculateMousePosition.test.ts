import { assertEquals } from '$std/assert/mod.ts'
import { calculateMousePosition } from '../calculateMousePosition.ts'

Deno.test('calculateMousePosition', async (test) => {
  await test.step('setup mock dimensions', () => {
    // Mock globalThis.innerWidth and innerHeight
    Object.defineProperty(globalThis, 'innerWidth', {
      value: 1920,
      writable: true,
    })
    Object.defineProperty(globalThis, 'innerHeight', {
      value: 1080,
      writable: true,
    })
  })

  await test.step('should calculate normalized coordinates for center of screen', () => {
    const mockEvent = {
      clientX: 960, // half of 1920
      clientY: 540, // half of 1080
    } as MouseEvent

    const result = calculateMousePosition(mockEvent)

    assertEquals(result, {
      x: 0, // (960 / 1920) * 2 - 1 = 0
      y: 0, // (540 / 1080) * 2 - 1 = 0
    })
  })

  await test.step('should calculate normalized coordinates for top-left corner', () => {
    const mockEvent = {
      clientX: 0,
      clientY: 0,
    } as MouseEvent

    const result = calculateMousePosition(mockEvent)

    assertEquals(result, {
      x: -1, // (0 / 1920) * 2 - 1 = -1
      y: -1, // (0 / 1080) * 2 - 1 = -1
    })
  })

  await test.step('should calculate normalized coordinates for bottom-right corner', () => {
    const mockEvent = {
      clientX: 1920,
      clientY: 1080,
    } as MouseEvent

    const result = calculateMousePosition(mockEvent)

    assertEquals(result, {
      x: 1, // (1920 / 1920) * 2 - 1 = 1
      y: 1, // (1080 / 1080) * 2 - 1 = 1
    })
  })

  await test.step('should handle different screen dimensions', () => {
    // Change screen dimensions
    Object.defineProperty(globalThis, 'innerWidth', { value: 800 })
    Object.defineProperty(globalThis, 'innerHeight', { value: 600 })

    const mockEvent = {
      clientX: 400, // half of 800
      clientY: 300, // half of 600
    } as MouseEvent

    const result = calculateMousePosition(mockEvent)

    assertEquals(result, {
      x: 0, // (400 / 800) * 2 - 1 = 0
      y: 0, // (300 / 600) * 2 - 1 = 0
    })
  })

  await test.step('should return precise floating point values', () => {
    // Reset to known dimensions for this test
    Object.defineProperty(globalThis, 'innerWidth', { value: 1920 })
    Object.defineProperty(globalThis, 'innerHeight', { value: 1080 })

    const mockEvent = {
      clientX: 100,
      clientY: 200,
    } as MouseEvent

    const result = calculateMousePosition(mockEvent)
    const expectedX = (100 / 1920) * 2 - 1
    const expectedY = (200 / 1080) * 2 - 1

    // Check with tolerance for floating point precision
    const tolerance = 0.00001
    assertEquals(Math.abs(result.x - expectedX) < tolerance, true)
    assertEquals(Math.abs(result.y - expectedY) < tolerance, true)
  })
})
