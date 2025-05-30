# Animation System

## Overview

The animation system has been refactored following strict functional programming principles:

- **One function per file** for maximum modularity
- **Pure functions only** - no side effects in calculations
- **Immutable data structures** throughout
- **Clear separation** between pure calculations and necessary side effects

## Architecture

```
/animation/
  /core/                    # Pure animation engine functions
    /createAnimationEngine.ts
    /updateAnimationEngine.ts
    /addBehavior.ts
    /removeBehavior.ts
  /calculations/           # Pure calculation functions
    /calculateMouseRotation.ts
    /calculateStaticLayerPosition.ts
    /calculateRandomLayerPosition.ts
  /utils/                  # Pure utility functions
    /smoothRotationInterpolation.ts
    /getRandomInterval.ts
    /timeUtils.ts
    /interpolationUtils.ts
  /createLogoAnimator.ts   # Main orchestrator
  /types.ts               # Type definitions
```

## Core Principles

### Pure Calculations
All math and position calculations are pure functions:

```typescript
// Pure function - deterministic output for given inputs
const position = calculateStaticLayerPosition(time, index, baseZPos, isStencil)
```

### Side Effect Isolation
Side effects (DOM mutations, Three.js updates) are isolated to the main orchestrator:

```typescript
// Side effects happen only in orchestrator
plane.position.x = position.positionX // Necessary side effect
```

### One Function Per File
Each function has its own file for maximum modularity:

```typescript
// /calculations/calculateMouseRotation.ts
export const calculateMouseRotation = (mouseX, mouseY, coefficient) => ({
  targetRotationX: mouseY * coefficient,
  targetRotationY: mouseX * coefficient
})
```

## Usage

### Basic Setup
```typescript
import { createLogoAnimator } from './animation'

const animator = createLogoAnimator(dependencies)
const cleanup = animator.start()
```

### Pure Calculations (Testable)
```typescript
import { calculateStaticLayerPosition } from './animation'

// Pure function - easy to test
const position = calculateStaticLayerPosition(1000, 0, 5, false)
// Returns: { rotationX: 0, rotationY: 0, positionZ: 5.02 }
```

### Custom Calculations
```typescript
// Create your own pure calculation
const calculateCustomPosition = (time, factor) => ({
  x: Math.sin(time * factor),
  y: Math.cos(time * factor)
})

// Use in your own animator
const customPosition = calculateCustomPosition(totalTime, 0.1)
plane.position.x = customPosition.x
```

## Benefits

1. **Highly Testable**: Pure functions are easy to unit test
2. **Predictable**: No hidden side effects or state mutations
3. **Modular**: Each function can be used independently
4. **Composable**: Easy to combine functions for new behaviors
5. **Debuggable**: Clear data flow makes debugging simple

## File Organization

Following the guide's "one function per file" principle:

- Each calculation is a separate file
- Each utility is a separate file  
- Each core function is a separate file
- Main orchestrator combines them all

This makes the codebase highly modular and follows pure FP principles while keeping the necessary side effects (Three.js mutations) clearly isolated. 