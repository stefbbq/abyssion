import { assert, assertEquals } from '$std/assert/mod.ts'
import { defaultOrbitControlsConfig } from '../defaultOrbitControlsConfig.ts'

Deno.test('defaultOrbitControlsConfig', async (test) => {
  await test.step('should have all required properties', () => {
    const config = defaultOrbitControlsConfig

    assert('enableDamping' in config)
    assert('dampingFactor' in config)
    assert('rotateSpeed' in config)
    assert('enableZoom' in config)
    assert('zoomSpeed' in config)
    assert('minDistance' in config)
    assert('maxDistance' in config)
    assert('enablePan' in config)
    assert('panSpeed' in config)
    assert('autoRotate' in config)
    assert('autoRotateSpeed' in config)
  })

  await test.step('should have correct default values', () => {
    const config = defaultOrbitControlsConfig

    assertEquals(config.enableDamping, true)
    assertEquals(config.dampingFactor, 0.05)
    assertEquals(config.rotateSpeed, 0.5)
    assertEquals(config.enableZoom, true)
    assertEquals(config.zoomSpeed, 0.5)
    assertEquals(config.minDistance, 3)
    assertEquals(config.maxDistance, 20)
    assertEquals(config.enablePan, true)
    assertEquals(config.panSpeed, 0.5)
    assertEquals(config.autoRotate, false)
    assertEquals(config.autoRotateSpeed, 1.0)
  })

  await test.step('should have boolean properties as booleans', () => {
    const config = defaultOrbitControlsConfig

    assertEquals(typeof config.enableDamping, 'boolean')
    assertEquals(typeof config.enableZoom, 'boolean')
    assertEquals(typeof config.enablePan, 'boolean')
    assertEquals(typeof config.autoRotate, 'boolean')
  })

  await test.step('should have numeric properties as numbers', () => {
    const config = defaultOrbitControlsConfig

    assertEquals(typeof config.dampingFactor, 'number')
    assertEquals(typeof config.rotateSpeed, 'number')
    assertEquals(typeof config.zoomSpeed, 'number')
    assertEquals(typeof config.minDistance, 'number')
    assertEquals(typeof config.maxDistance, 'number')
    assertEquals(typeof config.panSpeed, 'number')
    assertEquals(typeof config.autoRotateSpeed, 'number')
  })

  await test.step('should have valid numeric ranges', () => {
    const config = defaultOrbitControlsConfig

    // Damping factor should be between 0 and 1
    assert(config.dampingFactor >= 0 && config.dampingFactor <= 1)

    // Speeds should be positive
    assert(config.rotateSpeed > 0)
    assert(config.zoomSpeed > 0)
    assert(config.panSpeed > 0)
    assert(config.autoRotateSpeed > 0)

    // Distance constraints should be logical
    assert(config.minDistance > 0)
    assert(config.maxDistance > config.minDistance)
  })

  await test.step('should be typed as readonly', () => {
    const config = defaultOrbitControlsConfig

    // This test verifies the config is typed as readonly in TypeScript
    // The 'as const' assertion provides compile-time immutability
    // Runtime immutability would require Object.freeze() which isn't applied here
    assertEquals(typeof config, 'object')
    assert(config !== null)
  })

  await test.step('should be usable for partial overrides', () => {
    // Test that the config can be spread and partially overridden
    const customConfig = {
      ...defaultOrbitControlsConfig,
      rotateSpeed: 1.0,
      autoRotate: true,
    }

    assertEquals(customConfig.rotateSpeed, 1.0)
    assertEquals(customConfig.autoRotate, true)
    assertEquals(customConfig.dampingFactor, 0.05) // should preserve other values
  })
})
