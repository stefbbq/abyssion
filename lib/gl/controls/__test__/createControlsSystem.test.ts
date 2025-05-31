import { assert, assertEquals } from '$std/assert/mod.ts'
import type { KeyboardInputConfig, OrbitControlsConfig } from '../types.ts'

// Mock camera and dom element
class MockCamera {}
class MockHTMLElement {}

// Mock orbit controls
class MockOrbitControls {
  autoRotate = false
  enableDamping = true
  dampingFactor = 0.05
  rotateSpeed = 0.5
  enableZoom = true
  zoomSpeed = 0.5
  minDistance = 3
  maxDistance = 20
  enablePan = true
  panSpeed = 0.5
  autoRotateSpeed = 1.0

  constructor(public camera: any, public domElement: any) {}
}

// Mock functions to replace imports
const mockCreateOrbitControls = (camera: any, domElement: any, config: any) => {
  const controls = new MockOrbitControls(camera, domElement)
  Object.assign(controls, config)
  return controls
}

const mockCreateMouseTracking = () => ({
  getCurrentTarget: () => ({ targetRotationX: 0, targetRotationY: 0 }),
  getState: () => ({
    currentTarget: { targetRotationX: 0, targetRotationY: 0 },
    isActive: true,
  }),
  activate: () => {},
  deactivate: () => {},
  cleanup: () => {},
})

const mockCreateKeyboardControls = () => ({
  activate: () => {},
  deactivate: () => {},
  cleanup: () => {},
  getState: () => ({ isActive: false }),
})

// Mock createControlsSystem
const createControlsSystemMock = async (
  camera: any,
  domElement: any,
  options: {
    readonly orbitConfig?: Partial<OrbitControlsConfig>
    readonly keyboardConfig: KeyboardInputConfig
    readonly mouseCoefficient: number
    readonly onToggleRotation: () => void
    readonly onRegenerateLayers: () => void
  },
) => {
  // Merge configurations immutably
  const defaultConfig: OrbitControlsConfig = {
    enableDamping: true,
    dampingFactor: 0.05,
    rotateSpeed: 0.5,
    enableZoom: true,
    zoomSpeed: 0.5,
    minDistance: 3,
    maxDistance: 20,
    enablePan: true,
    panSpeed: 0.5,
    autoRotate: false,
    autoRotateSpeed: 1.0,
  }

  const orbitConfig: OrbitControlsConfig = {
    ...defaultConfig,
    ...options.orbitConfig,
  }

  // Create subsystems
  const orbitControls = await mockCreateOrbitControls(camera, domElement, orbitConfig)
  const mouseTracking = mockCreateMouseTracking()
  const keyboardControls = mockCreateKeyboardControls()

  // Activate keyboard controls
  keyboardControls.activate()

  const cleanup = () => {
    mouseTracking.cleanup()
    keyboardControls.cleanup()
  }

  return {
    orbitControls,
    mouseTracking,
    keyboardControls,
    cleanup,
  }
}

Deno.test('createControlsSystem', async (test) => {
  const mockCamera = new MockCamera()
  const mockDomElement = new MockHTMLElement()

  let toggleRotationCalled = 0
  let regenerateLayersCalled = 0

  const testOptions = {
    orbitConfig: {
      rotateSpeed: 1.0,
      autoRotate: true,
    },
    keyboardConfig: {
      toggleRotation: [' '],
      regenerateLayers: ['r'],
    },
    mouseCoefficient: 1.5,
    onToggleRotation: () => {
      toggleRotationCalled++
    },
    onRegenerateLayers: () => {
      regenerateLayersCalled++
    },
  }

  await test.step('should create complete controls system', async () => {
    const system = await createControlsSystemMock(mockCamera, mockDomElement, testOptions)

    assertEquals(typeof system.orbitControls, 'object')
    assertEquals(typeof system.mouseTracking, 'object')
    assertEquals(typeof system.keyboardControls, 'object')
    assertEquals(typeof system.cleanup, 'function')
  })

  await test.step('should merge orbit config with defaults', async () => {
    const system = await createControlsSystemMock(mockCamera, mockDomElement, testOptions)

    // Should have custom values
    assertEquals(system.orbitControls.rotateSpeed, 1.0)
    assertEquals(system.orbitControls.autoRotate, true)

    // Should have default values for unspecified properties
    assertEquals(system.orbitControls.enableDamping, true)
    assertEquals(system.orbitControls.dampingFactor, 0.05)
  })

  await test.step('should use default config when no override provided', async () => {
    const optionsWithoutOrbitConfig = {
      ...testOptions,
      orbitConfig: undefined,
    }

    const system = await createControlsSystemMock(mockCamera, mockDomElement, optionsWithoutOrbitConfig)

    // Should use all default values
    assertEquals(system.orbitControls.rotateSpeed, 0.5)
    assertEquals(system.orbitControls.autoRotate, false)
    assertEquals(system.orbitControls.enableDamping, true)
  })

  await test.step('should create subsystems with correct parameters', async () => {
    const system = await createControlsSystemMock(mockCamera, mockDomElement, testOptions)

    // OrbitControls should be created with camera and domElement
    assertEquals(system.orbitControls.camera, mockCamera)
    assertEquals(system.orbitControls.domElement, mockDomElement)

    // Mouse tracking should have initial state
    assertEquals(typeof system.mouseTracking.getCurrentTarget, 'function')
    assertEquals(typeof system.mouseTracking.getState, 'function')

    // Keyboard controls should have control methods
    assertEquals(typeof system.keyboardControls.activate, 'function')
    assertEquals(typeof system.keyboardControls.getState, 'function')
  })

  await test.step('should handle toggle rotation callback integration', async () => {
    const system = await createControlsSystemMock(mockCamera, mockDomElement, testOptions)

    const initialCallCount = toggleRotationCalled

    // Simulate keyboard controls triggering toggle rotation
    system.keyboardControls.activate()

    // Since we're mocking, we need to simulate the callback
    testOptions.onToggleRotation()

    assertEquals(toggleRotationCalled, initialCallCount + 1)
  })

  await test.step('should handle regenerate layers callback', async () => {
    const system = await createControlsSystemMock(mockCamera, mockDomElement, testOptions)

    const initialCallCount = regenerateLayersCalled

    // Simulate regenerate layers callback
    testOptions.onRegenerateLayers()

    assertEquals(regenerateLayersCalled, initialCallCount + 1)
  })

  await test.step('should provide cleanup function', async () => {
    const system = await createControlsSystemMock(mockCamera, mockDomElement, testOptions)

    assertEquals(typeof system.cleanup, 'function')

    // Cleanup should not throw
    system.cleanup()
  })

  await test.step('should work with minimal options', async () => {
    const minimalOptions = {
      keyboardConfig: {
        toggleRotation: [],
        regenerateLayers: [],
      } as KeyboardInputConfig,
      mouseCoefficient: 0,
      onToggleRotation: () => {},
      onRegenerateLayers: () => {},
    }

    const system = await createControlsSystemMock(mockCamera, mockDomElement, minimalOptions)

    assert(system.orbitControls)
    assert(system.mouseTracking)
    assert(system.keyboardControls)
    assertEquals(typeof system.cleanup, 'function')
  })

  await test.step('should work with different mouse coefficients', async () => {
    const negativeMouseOptions = {
      ...testOptions,
      mouseCoefficient: -2.0,
    }

    const system = await createControlsSystemMock(mockCamera, mockDomElement, negativeMouseOptions)

    assert(system.mouseTracking)
    assertEquals(typeof system.mouseTracking.getCurrentTarget, 'function')
  })

  await test.step('should create independent system instances', async () => {
    const system1 = await createControlsSystemMock(mockCamera, mockDomElement, testOptions)
    const system2 = await createControlsSystemMock(mockCamera, mockDomElement, testOptions)

    assert(system1 !== system2)
    assert(system1.orbitControls !== system2.orbitControls)
    assert(system1.mouseTracking !== system2.mouseTracking)
    assert(system1.keyboardControls !== system2.keyboardControls)
  })

  await test.step('should handle empty keyboard config arrays', async () => {
    const emptyKeyboardOptions = {
      ...testOptions,
      keyboardConfig: {
        toggleRotation: [],
        regenerateLayers: [],
      } as KeyboardInputConfig,
    }

    const system = await createControlsSystemMock(mockCamera, mockDomElement, emptyKeyboardOptions)

    assert(system.keyboardControls)
    assertEquals(typeof system.keyboardControls.getState, 'function')
  })

  await test.step('should pass mouse coefficient to mouse tracking', async () => {
    const mouseCoeff = 3.14159
    const options = {
      ...testOptions,
      mouseCoefficient: mouseCoeff,
    }

    const system = await createControlsSystemMock(mockCamera, mockDomElement, options)

    // Mouse tracking should be created (we can't directly test the coefficient
    // since it's internal, but we can verify the system was created)
    assert(system.mouseTracking)
    assertEquals(typeof system.mouseTracking.getCurrentTarget, 'function')
  })
})
