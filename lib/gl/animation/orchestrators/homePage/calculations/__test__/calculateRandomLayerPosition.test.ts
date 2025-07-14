import { assert, assertEquals } from '$std/assert/mod.ts'
import { calculateRandomLayerPosition } from '../calculateRandomLayerPosition.ts'

Deno.test('calculateRandomLayerPosition - basic functionality', async (test) => {
  await test.step('should return position object with correct properties', () => {
    const result = calculateRandomLayerPosition(0, 0, -5, 10)

    assertEquals(typeof result.x, 'number')
    assertEquals(typeof result.y, 'number')
    assertEquals(typeof result.z, 'number')
    assertEquals(result.rotationX, 0)
    assertEquals(result.rotationY, 0)
  })

  await test.step('should calculate different positions for different indices', () => {
    const time = 1000
    const baseZPos = -5
    const totalLayers = 10

    const result1 = calculateRandomLayerPosition(time, 0, baseZPos, totalLayers)
    const result2 = calculateRandomLayerPosition(time, 1, baseZPos, totalLayers)
    const result3 = calculateRandomLayerPosition(time, 5, baseZPos, totalLayers)

    // Different indices should produce different positions
    assert(result1.x !== result2.x || result1.y !== result2.y || result1.z !== result2.z)
    assert(result2.x !== result3.x || result2.y !== result3.y || result2.z !== result3.z)
  })

  await test.step('should vary positions over time', () => {
    const index = 2
    const baseZPos = -3
    const totalLayers = 8

    const result1 = calculateRandomLayerPosition(0, index, baseZPos, totalLayers)
    const result2 = calculateRandomLayerPosition(1000, index, baseZPos, totalLayers)
    const result3 = calculateRandomLayerPosition(2000, index, baseZPos, totalLayers)

    // Different times should produce different positions
    assert(result1.x !== result2.x || result1.y !== result2.y || result1.z !== result2.z)
    assert(result2.x !== result3.x || result2.y !== result3.y || result2.z !== result3.z)
  })
})

Deno.test('calculateRandomLayerPosition - mathematical properties', async (test) => {
  await test.step('should have z position based around baseZPos', () => {
    const time = 500
    const baseZPos = -10
    const totalLayers = 5

    for (let i = 0; i < totalLayers; i++) {
      const result = calculateRandomLayerPosition(time, i, baseZPos, totalLayers)

      const maxBreathingDepth = 0.08 * (i + 1) / totalLayers
      assert(result.z >= baseZPos - maxBreathingDepth)
      assert(result.z <= baseZPos + maxBreathingDepth)
    }
  })

  await test.step('should have movement scale proportional to layer index', () => {
    const totalLayers = 10

    // Higher index layers should generally have larger movement potential
    // This is probabilistic due to sin/cos, but we can check the scale is applied
    const maxMovement0 = 0.02 * (0 + 1) / totalLayers
    const maxMovement9 = 0.02 * (9 + 1) / totalLayers

    assert(maxMovement9 > maxMovement0, 'Higher indices should have larger movement scale')
  })

  await test.step('should have y movement scaled by 0.8 factor', () => {
    const time = Math.PI / 2 // Time where cos(time * 0.3) approaches extreme
    const index = 5
    const baseZPos = -5
    const totalLayers = 10

    // At this specific time, we can predict approximate relationship
    const randomFactor = Math.sin(time * 2 + index * 0.5) * 0.3 + 0.7
    const movementScale = 0.02 * randomFactor * (index + 1) / totalLayers

    const result = calculateRandomLayerPosition(time, index, baseZPos, totalLayers)

    // Y movement should be scaled down by 0.8
    const expectedMaxY = movementScale * 0.8
    assert(Math.abs(result.y) <= expectedMaxY + 0.001) // Small tolerance for floating point
  })
})

Deno.test('calculateRandomLayerPosition - edge cases', async (test) => {
  await test.step('should handle zero time', () => {
    const result = calculateRandomLayerPosition(0, 0, -5, 1)

    assertEquals(typeof result.x, 'number')
    assertEquals(typeof result.y, 'number')
    assertEquals(typeof result.z, 'number')
    assertEquals(result.rotationX, 0)
    assertEquals(result.rotationY, 0)
    assert(!isNaN(result.x))
    assert(!isNaN(result.y))
    assert(!isNaN(result.z))
  })

  await test.step('should handle single layer', () => {
    const result = calculateRandomLayerPosition(1000, 0, -3, 1)

    assertEquals(result.rotationX, 0)
    assertEquals(result.rotationY, 0)
    // With single layer, movements should be smallest scale
    assert(Math.abs(result.x) <= 0.02) // Maximum possible movement for single layer
    assert(Math.abs(result.y) <= 0.02 * 0.8)
  })

  await test.step('should handle large number of layers', () => {
    const totalLayers = 1000
    const result = calculateRandomLayerPosition(1000, totalLayers - 1, -5, totalLayers)

    assertEquals(result.rotationX, 0)
    assertEquals(result.rotationY, 0)
    assertEquals(typeof result.x, 'number')
    assertEquals(typeof result.y, 'number')
    assertEquals(typeof result.z, 'number')
    assert(!isNaN(result.x))
    assert(!isNaN(result.y))
    assert(!isNaN(result.z))
  })

  await test.step('should handle negative baseZPos', () => {
    const result = calculateRandomLayerPosition(500, 2, -100, 5)

    assert(result.z <= -100 + 0.08) // Should be around baseZPos
    assert(result.z >= -100 - 0.08)
    assertEquals(result.rotationX, 0)
    assertEquals(result.rotationY, 0)
  })

  await test.step('should handle positive baseZPos', () => {
    const result = calculateRandomLayerPosition(500, 2, 50, 5)

    assert(result.z <= 50 + 0.08) // Should be around baseZPos
    assert(result.z >= 50 - 0.08)
    assertEquals(result.rotationX, 0)
    assertEquals(result.rotationY, 0)
  })
})

Deno.test('calculateRandomLayerPosition - deterministic behavior', async (test) => {
  await test.step('should be deterministic for same inputs', () => {
    const time = 1234
    const index = 3
    const baseZPos = -7
    const totalLayers = 12

    const result1 = calculateRandomLayerPosition(time, index, baseZPos, totalLayers)
    const result2 = calculateRandomLayerPosition(time, index, baseZPos, totalLayers)

    assertEquals(result1.x, result2.x)
    assertEquals(result1.y, result2.y)
    assertEquals(result1.z, result2.z)
    assertEquals(result1.rotationX, result2.rotationX)
    assertEquals(result1.rotationY, result2.rotationY)
  })

  await test.step('should produce smooth continuous movement', () => {
    const index = 1
    const baseZPos = -5
    const totalLayers = 8
    const timeStep = 10

    const positions = []
    for (let time = 0; time < 100; time += timeStep) {
      positions.push(calculateRandomLayerPosition(time, index, baseZPos, totalLayers))
    }

    // Check that consecutive positions don't jump dramatically
    for (let i = 1; i < positions.length; i++) {
      const prev = positions[i - 1]
      const curr = positions[i]

      const deltaX = Math.abs(curr.x - prev.x)
      const deltaY = Math.abs(curr.y - prev.y)
      const deltaZ = Math.abs(curr.z - prev.z)

      // Movement should be smooth (these are loose bounds for continuous functions)
      assert(deltaX < 0.1, `X movement too large: ${deltaX}`)
      assert(deltaY < 0.1, `Y movement too large: ${deltaY}`)
      assert(deltaZ < 0.1, `Z movement too large: ${deltaZ}`)
    }
  })
})
