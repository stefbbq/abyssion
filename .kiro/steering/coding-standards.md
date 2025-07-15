# Coding Standards & Best Practices

## TypeScript Standards

### Type Definitions
- **Type aliases over interfaces**: `type User = { name: string }` not `interface IUser`
- **No "I" prefix**: Avoid `IUser`, `IConfig` - just use `User`, `Config`
- **Union types over inheritance**: `type Status = 'active' | 'inactive'`
- **Unknown over any**: When type is unclear, use `unknown` and narrow it
- **Leverage generics**: `type List<T> = T[]` not `type List = Array<any>`

### Type Documentation
```typescript
// Inline type docs - alternate doc line and type line
// the user's name
type UserName = string
// the user's status  
type Status = 'active' | 'inactive'
// the user object
type User = {
  // the user's display name
  name: UserName
  // current user status
  status: Status
}
```

### Function Definitions
- **Arrow functions always**: `const add = (a: number, b: number) => a + b`
- **Named exports only**: No default exports (except workers)
- **Pure functions preferred**: Deterministic, side-effect free when possible
- **One function per file**: Unless it's an orchestrating module

### Component Structure
```typescript
// Props type at top, not exported
type Props = {
  // the label to display
  label: string
  // whether the component is active
  isActive: boolean
}

// Always export const arrow functions
export const MyComponent = (props: Props) => (
  <div className={props.isActive ? 'active' : ''}>{props.label}</div>
)
```

## Code Style Rules

### Formatting
- **No semicolons**: Unless required by ASI rules
- **Single quotes**: For strings, backticks for templates
- **2 space indentation**: No tabs
- **140 character line width**: As configured in deno.json
- **Single-line conditionals**: `if (x) return y` (no braces for single line)
- **Multi-line always uses braces**: For readability

### Naming Conventions
- **Types**: `PascalCase` (User, ConfigOptions, RendererState)
- **Functions/variables**: `camelCase` (calculatePosition, isDebugMode)
- **State booleans**: `isXXXing`, `hasXXXed` patterns
- **No abbreviations**: Use full words for clarity
- **No underscores**: Except for ignored parameters (`_unused`)

### Import Organization
```typescript
// 1. External imports first
import { signal } from '@preact/signals'
import * as THREE from 'three'

// 2. Internal imports with path aliases
import { log, lc } from '@liblogger/index.ts'
import { createUITheme } from '@libtheme/createUITheme.ts'

// 3. Types second
// the transform function type
type Transform<T> = (value: T) => T

// 4. Implementation
export const processData = <T>(
  data: T,
  transforms: Transform<T>[]
) => pipe(...transforms)(data)
```

## Functional Programming Patterns

### Preferred Patterns
```typescript
// Composable utilities
const add = (a: number) => (b: number) => a + b
const multiply = (a: number) => (b: number) => a * b

// Point-free style where readable
const calculateTotal = pipe(
  map(multiply(1.2)),
  reduce(add(0))
)

// Immutable updates
const updateUser = (user: User, name: string): User => 
  ({ ...user, name })

// Pure calculations
const calculatePosition = (time: number, index: number): Position => ({
  x: Math.sin(time + index) * 10,
  y: Math.cos(time + index) * 10,
  z: index * 2
})
```

### Patterns to Avoid
```typescript
// ❌ Classes (unless absolutely necessary)
class UserService { }

// ❌ Mutations
users.push(newUser)
user.name = 'new name'

// ❌ Imperative loops (unless async needed)
for (let i = 0; i < arr.length; i++) { }

// ❌ Nested ternaries (NEVER!)
x ? y ? a : b : c

// ❌ Any type
const data: any = getData()
```

## Documentation Standards

### JSDoc Comments
```typescript
/**
 * Calculates the position of a layer based on time and index
 * 
 * @example
 * const pos = calculateLayerPosition(1000, 2, 5, false)
 * // Returns: { rotationX: 0, rotationY: 0, positionZ: 5.02 }
 */
export const calculateLayerPosition = (
  time: number,
  index: number,
  baseZ: number,
  isStencil: boolean
): LayerPosition => {
  // Implementation
}
```

### Documentation Rules
- **JSDoc for public functions**: Include examples when helpful
- **No redundant comments**: Don't explain obvious code
- **Document removal conditions**: For temporary code
- **External references**: Use `@see <url>` with date
- **NEVER comment on recent changes**: No "// Fixed bug" or "// Updated for X"

## File Organization

### File Structure
```
/module/
  index.ts           # Main entry point (barrel export)
  types.ts           # Co-located types
  /utils/
    functionA.ts     # One pure function per file
    functionB.ts     # With meaningful typedocs
  /calculations/
    calculateX.ts    # Pure calculation functions
  /orchestrators/
    createY.ts       # Side-effect orchestrators
```

### Module Patterns
- **Barrel exports**: Use `index.ts` for clean public API
- **Feature grouping**: Group by feature, not by type
- **Stable layers**: Core → Features → App structure
- **Import direction**: Dependencies flow inward, no circular deps

## Error Handling

### Preferred Patterns
```typescript
// Result types over throwing
type Result<T, E> = { success: true; data: T } | { success: false; error: E }

// Type guards over assertions
const isUser = (obj: unknown): obj is User => 
  typeof obj === 'object' && obj !== null && 'name' in obj

// Graceful degradation
const safeParseJSON = (str: string): unknown => {
  try {
    return JSON.parse(str)
  } catch {
    return null
  }
}
```

## Performance Considerations

### Async Patterns
- **For...of with await**: When you need sequential async operations
- **Promise.all**: Only when parallel execution is needed and safe
- **Avoid async in map**: Unless you handle the Promise array properly

### Memory Management
- **Cleanup functions**: Always provide cleanup for resources
- **Avoid closures over large objects**: Be mindful of memory leaks
- **Dispose Three.js resources**: Geometries, materials, textures

## Testing Considerations

### Pure Function Benefits
- **Easy to test**: Deterministic inputs/outputs
- **No mocking needed**: No external dependencies
- **Composable**: Test individual pieces and combinations
- **Predictable**: No hidden state or side effects

### Test Structure
```typescript
// Pure function - easy to test
export const calculateMouseRotation = (mouseX: number, mouseY: number, coefficient: number) => ({
  targetRotationX: mouseY * coefficient,
  targetRotationY: mouseX * coefficient
})

// Test
const result = calculateMouseRotation(0.5, 0.3, 0.1)
assertEquals(result.targetRotationX, 0.03)
assertEquals(result.targetRotationY, 0.05)
```