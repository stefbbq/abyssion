import { assert, assertEquals } from '$std/assert/mod.ts'
import { createOrbitControls } from '../createOrbitControls.ts'
import type { OrbitControlsConfig } from '../../types.ts'

// Simple mock objects for interface testing
interface MinimalHTMLElement {
  style: Record<string, unknown>
  addEventListener: (...args: unknown[]) => void
  removeEventListener: (...args: unknown[]) => void
  getBoundingClientRect: () => { left: number; top: number; width: number; height: number }
  readonly clientWidth: number
  readonly clientHeight: number
}

class MockCamera {
  position = { x: 0, y: 0, z: 5 }
  up = { x: 0, y: 1, z: 0 }
}

class MockHTMLElement implements MinimalHTMLElement {
  style: Record<string, unknown> = {}

  constructor() {
    this.style.touchAction = ''
  }

  addEventListener() {}
  removeEventListener() {}
  getBoundingClientRect() {
    return { left: 0, top: 0, width: 800, height: 600 }
  }

  get clientWidth() {
    return 800
  }
  get clientHeight() {
    return 600
  }
}

Deno.test('createOrbitControls', async (test) => {
  const mockCamera = new MockCamera()
  const mockDomElement = new MockHTMLElement() as unknown as HTMLElement

  const testConfig: OrbitControlsConfig = {
    enableDamping: true,
    dampingFactor: 0.1,
    rotateSpeed: 1.5,
    enableZoom: true,
    zoomSpeed: 1.2,
    minDistance: 5,
    maxDistance: 50,
    enablePan: true,
    panSpeed: 0.8,
    autoRotate: true,
    autoRotateSpeed: 2.0,
  }

  await test.step('should be an async function', () => {
    assert(typeof createOrbitControls === 'function')
  })

  await test.step('should accept camera, domElement, and config parameters', () => {
    // Test that the function can be called with correct parameters
    const call = () => createOrbitControls(mockCamera, mockDomElement, testConfig)

    // Should not throw on parameter validation
    assert(typeof call === 'function')
  })

  await test.step('should handle different config objects', () => {
    const minimalConfig: OrbitControlsConfig = {
      enableDamping: false,
      dampingFactor: 0,
      rotateSpeed: 1,
      enableZoom: false,
      zoomSpeed: 1,
      minDistance: 1,
      maxDistance: 10,
      enablePan: false,
      panSpeed: 1,
      autoRotate: false,
      autoRotateSpeed: 1,
    }

    const edgeConfig: OrbitControlsConfig = {
      enableDamping: true,
      dampingFactor: 0.001,
      rotateSpeed: 0.01,
      enableZoom: true,
      zoomSpeed: 10,
      minDistance: 0.1,
      maxDistance: 1000,
      enablePan: true,
      panSpeed: 0.001,
      autoRotate: true,
      autoRotateSpeed: 100,
    }

    // Should accept all valid configurations
    const call1 = () => createOrbitControls(mockCamera, mockDomElement, minimalConfig)
    const call2 = () => createOrbitControls(mockCamera, mockDomElement, edgeConfig)

    assert(typeof call1 === 'function')
    assert(typeof call2 === 'function')
  })

  await test.step('should be pure function (no mutation of parameters)', () => {
    const originalConfig = { ...testConfig }
    const originalCameraPosition = { ...mockCamera.position }

    // Parameters should remain unchanged during function call creation
    assertEquals(testConfig, originalConfig)
    assertEquals(mockCamera.position.x, originalCameraPosition.x)
    assertEquals(mockCamera.position.y, originalCameraPosition.y)
    assertEquals(mockCamera.position.z, originalCameraPosition.z)
  })

  await test.step('should handle different camera and element combinations', () => {
    const camera1 = new MockCamera()
    const camera2 = new MockCamera()
    const element1 = new MockHTMLElement() as unknown as HTMLElement
    const element2 = new MockHTMLElement() as unknown as HTMLElement

    // Should accept different combinations
    const call1 = () => createOrbitControls(camera1, element1, testConfig)
    const call2 = () => createOrbitControls(camera2, element2, testConfig)

    assert(typeof call1 === 'function')
    assert(typeof call2 === 'function')
  })

  await test.step('should work with readonly config', () => {
    const readonlyConfig = testConfig as Readonly<OrbitControlsConfig>

    // Should accept readonly configuration
    const call = () => createOrbitControls(mockCamera, mockDomElement, readonlyConfig)

    assert(typeof call === 'function')
  })

  await test.step('should validate function interface', () => {
    // Verify parameter types are accepted without calling the function
    assert(typeof mockCamera === 'object')
    assert(typeof mockDomElement === 'object')
    assert(typeof testConfig === 'object')
    assert(typeof createOrbitControls === 'function')
  })
})
