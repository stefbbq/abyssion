import { assert, assertAlmostEquals, assertEquals } from '$std/assert/mod.ts'
import { calculateStaticLayerPosition } from '../calculateStaticLayerPosition.ts'

Deno.test('calculateStaticLayerPosition - basic functionality', async (test) => {
  await test.step('should return position object with correct properties', () => {
    const result = calculateStaticLayerPosition(0, 0, -5, false)

    assertEquals(typeof result.x, 'number')
    assertEquals(typeof result.y, 'number')
    assertEquals(typeof result.z, 'number')
    assertEquals(typeof result.rotationX, 'number')
    assertEquals(typeof result.rotationY, 'number')
  })

  await test.step('should always have x and y as 0 for non-stencil layers', () => {
    const result1 = calculateStaticLayerPosition(0, 0, -5, false)
    const result2 = calculateStaticLayerPosition(1000, 5, -10, false)
    const result3 = calculateStaticLayerPosition(5000, 10, 2, false)

    assertEquals(result1.x, 0)
    assertEquals(result1.y, 0)
    assertEquals(result2.x, 0)
    assertEquals(result2.y, 0)
    assertEquals(result3.x, 0)
    assertEquals(result3.y, 0)
  })

  await test.step('should always have x and y as 0 for stencil layers', () => {
    const result1 = calculateStaticLayerPosition(0, 0, -5, true)
    const result2 = calculateStaticLayerPosition(1000, 5, -10, true)
    const result3 = calculateStaticLayerPosition(5000, 10, 2, true)

    assertEquals(result1.x, 0)
    assertEquals(result1.y, 0)
    assertEquals(result2.x, 0)
    assertEquals(result2.y, 0)
    assertEquals(result3.x, 0)
    assertEquals(result3.y, 0)
  })
})

Deno.test('calculateStaticLayerPosition - stencil layer behavior', async (test) => {
  await test.step('should have breathing motion in z for stencil layers', () => {
    const time = 0
    const baseZPos = -5
    const result = calculateStaticLayerPosition(time, 0, baseZPos, true)

    // At time 0, Math.sin(0 * 0.2) = 0, so z should equal baseZPos
    assertAlmostEquals(result.z, baseZPos, 0.001)
  })

  await test.step('should have rotation for stencil layers', () => {
    const time = Math.PI / 2 // 90 degrees where sin is 1 and cos is 0
    const result = calculateStaticLayerPosition(time, 0, -5, true)

    // rotationX = Math.sin(time * 0.1) * 0.03
    // At time π/2: sin(π/2 * 0.1) = sin(π/20)
    const expectedRotationX = Math.sin(Math.PI / 20) * 0.03
    assertAlmostEquals(result.rotationX, expectedRotationX, 0.001)

    // rotationY = Math.cos(time * 0.15) * 0.03
    // At time π/2: cos(π/2 * 0.15) = cos(3π/40)
    const expectedRotationY = Math.cos(3 * Math.PI / 40) * 0.03
    assertAlmostEquals(result.rotationY, expectedRotationY, 0.001)
  })

  await test.step('should vary z position over time for stencil layers', () => {
    const baseZPos = -3
    const result1 = calculateStaticLayerPosition(0, 0, baseZPos, true)
    const result2 = calculateStaticLayerPosition(Math.PI, 0, baseZPos, true) // π where sin is 0
    const result3 = calculateStaticLayerPosition(Math.PI / 2, 0, baseZPos, true) // π/2 where sin is 1

    // At time 0: sin(0) = 0
    assertAlmostEquals(result1.z, baseZPos, 0.001)

    // At time π: sin(π * 0.2) = sin(π/5)
    const expectedZ2 = baseZPos + Math.sin(Math.PI / 5) * 0.02
    assertAlmostEquals(result2.z, expectedZ2, 0.001)

    // At time π/2: sin(π/2 * 0.2) = sin(π/10)
    const expectedZ3 = baseZPos + Math.sin(Math.PI / 10) * 0.02
    assertAlmostEquals(result3.z, expectedZ3, 0.001)
  })
})

Deno.test('calculateStaticLayerPosition - non-stencil layer behavior', async (test) => {
  await test.step('should have no rotation for non-stencil layers', () => {
    const result1 = calculateStaticLayerPosition(0, 0, -5, false)
    const result2 = calculateStaticLayerPosition(1000, 5, -10, false)
    const result3 = calculateStaticLayerPosition(Math.PI, 3, 2, false)

    assertEquals(result1.rotationX, 0)
    assertEquals(result1.rotationY, 0)
    assertEquals(result2.rotationX, 0)
    assertEquals(result2.rotationY, 0)
    assertEquals(result3.rotationX, 0)
    assertEquals(result3.rotationY, 0)
  })

  await test.step('should have breathing motion with index offset for non-stencil layers', () => {
    const time = 1000
    const baseZPos = -7

    const result0 = calculateStaticLayerPosition(time, 0, baseZPos, false)
    const result1 = calculateStaticLayerPosition(time, 1, baseZPos, false)
    const result5 = calculateStaticLayerPosition(time, 5, baseZPos, false)

    // Each should have different z due to index offset in calculation
    // z = baseZPos + Math.sin(time * 0.2 + index * 0.05) * 0.02
    const expectedZ0 = baseZPos + Math.sin(time * 0.2 + 0 * 0.05) * 0.02
    const expectedZ1 = baseZPos + Math.sin(time * 0.2 + 1 * 0.05) * 0.02
    const expectedZ5 = baseZPos + Math.sin(time * 0.2 + 5 * 0.05) * 0.02

    assertAlmostEquals(result0.z, expectedZ0, 0.001)
    assertAlmostEquals(result1.z, expectedZ1, 0.001)
    assertAlmostEquals(result5.z, expectedZ5, 0.001)

    // They should be different
    assert(result0.z !== result1.z)
    assert(result1.z !== result5.z)
  })

  await test.step('should have z position vary smoothly over time for non-stencil layers', () => {
    const index = 3
    const baseZPos = -4

    const positions = []
    for (let time = 0; time < 100; time += 10) {
      const result = calculateStaticLayerPosition(time, index, baseZPos, false)
      positions.push(result.z)
    }

    // Check that positions are smooth and within expected range
    for (const z of positions) {
      assert(z >= baseZPos - 0.02) // Min breathing
      assert(z <= baseZPos + 0.02) // Max breathing
    }

    // Check that consecutive positions don't jump dramatically
    for (let i = 1; i < positions.length; i++) {
      const delta = Math.abs(positions[i] - positions[i - 1])
      assert(delta < 0.04, `Z position jumped too much: ${delta}`)
    }
  })
})

Deno.test('calculateStaticLayerPosition - edge cases', async (test) => {
  await test.step('should handle zero time', () => {
    const resultStencil = calculateStaticLayerPosition(0, 0, -5, true)
    const resultNonStencil = calculateStaticLayerPosition(0, 0, -5, false)

    assertEquals(resultStencil.x, 0)
    assertEquals(resultStencil.y, 0)
    assertEquals(resultNonStencil.x, 0)
    assertEquals(resultNonStencil.y, 0)

    // Both should have z close to baseZPos since sin(0) = 0
    assertAlmostEquals(resultStencil.z, -5, 0.001)
    assertAlmostEquals(resultNonStencil.z, -5, 0.001)
  })

  await test.step('should handle negative baseZPos', () => {
    const result = calculateStaticLayerPosition(500, 2, -100, false)

    assertEquals(result.x, 0)
    assertEquals(result.y, 0)
    assert(result.z >= -100.02) // Within breathing range
    assert(result.z <= -99.98)
    assertEquals(result.rotationX, 0)
    assertEquals(result.rotationY, 0)
  })

  await test.step('should handle positive baseZPos', () => {
    const result = calculateStaticLayerPosition(500, 2, 50, true)

    assertEquals(result.x, 0)
    assertEquals(result.y, 0)
    assert(result.z >= 49.98) // Within breathing range
    assert(result.z <= 50.02)
    assert(typeof result.rotationX === 'number')
    assert(typeof result.rotationY === 'number')
  })

  await test.step('should handle large time values', () => {
    const largeTime = 1000000
    const result = calculateStaticLayerPosition(largeTime, 0, -5, true)

    assertEquals(result.x, 0)
    assertEquals(result.y, 0)
    assertEquals(typeof result.z, 'number')
    assertEquals(typeof result.rotationX, 'number')
    assertEquals(typeof result.rotationY, 'number')
    assert(!isNaN(result.z))
    assert(!isNaN(result.rotationX))
    assert(!isNaN(result.rotationY))
  })

  await test.step('should handle large index values', () => {
    const result = calculateStaticLayerPosition(1000, 9999, -5, false)

    assertEquals(result.x, 0)
    assertEquals(result.y, 0)
    assertEquals(result.rotationX, 0)
    assertEquals(result.rotationY, 0)
    assertEquals(typeof result.z, 'number')
    assert(!isNaN(result.z))
  })
})

Deno.test('calculateStaticLayerPosition - deterministic behavior', async (test) => {
  await test.step('should be deterministic for same inputs', () => {
    const time = 1234
    const index = 7
    const baseZPos = -8
    const isStencil = true

    const result1 = calculateStaticLayerPosition(time, index, baseZPos, isStencil)
    const result2 = calculateStaticLayerPosition(time, index, baseZPos, isStencil)

    assertEquals(result1.x, result2.x)
    assertEquals(result1.y, result2.y)
    assertEquals(result1.z, result2.z)
    assertEquals(result1.rotationX, result2.rotationX)
    assertEquals(result1.rotationY, result2.rotationY)
  })

  await test.step('should have different behavior for stencil vs non-stencil', () => {
    const time = 1000
    const index = 3
    const baseZPos = -6

    const stencilResult = calculateStaticLayerPosition(time, index, baseZPos, true)
    const nonStencilResult = calculateStaticLayerPosition(time, index, baseZPos, false)

    // X and Y should be same (both 0)
    assertEquals(stencilResult.x, nonStencilResult.x)
    assertEquals(stencilResult.y, nonStencilResult.y)

    // Z might be different due to different calculations
    // Rotations should definitely be different
    assert(stencilResult.rotationX !== nonStencilResult.rotationX)
    assert(stencilResult.rotationY !== nonStencilResult.rotationY)
    assertEquals(nonStencilResult.rotationX, 0)
    assertEquals(nonStencilResult.rotationY, 0)
  })
})
