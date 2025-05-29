# LLM Operational Guide

## Core Principles

### Functional Programming First
- **Pure functions only:** Every function must be deterministic and side-effect free, whenever possible
- **Immutability:** Never mutate data. Return new values instead, whenever possible
- **Composition over inheritance:** Build complex behavior by composing simple functions
- **Types over classes:** Use type aliases and unions. No classes unless absolutely necessary
- **One file per function, unless it's an orchastrating module:** Each file exports a single, well-typed function
- **Avoid relative imports:** Use absolute imports whenever possible; make them if you need to for top level modules

### File Organization
```
/module/
  /module.ts         # main entry point
  /module.d.ts       # colocated types
  /utils/
    /functionA.ts    # one pure function per file
    /functionB.ts    # with meaningful typedocs
```

### Tool Usage
- **Act, don't ask:** Use available tools directly instead of asking user to perform actions
- **Available tools:** `codebase_search`, `read_file`, `edit_file`, `run_terminal_cmd`, `grep_search`, `list_dir`, `file_search`, `delete_file`, `reapply`, `web_search`
- **Continuous discovery:** Update "Repo Map" section with structural findings

## Code Standards

### Naming
- Types: `PascalCase` (no "I" prefix for interfaces)
- Functions/variables: `camelCase` (no abbreviations)
- State booleans: `isXXXing`, `hasXXXed`, etc
- Avoid underscores, unless you're using them for ignored parameters

### TypeScript Specifics
- **Named exports only** (except workers)
- **Type aliases > interfaces:** `type User = { name: string }` not `interface IUser`
- **Leverage generics:** `type List<T> = T[]` not `type List = Array<any>`
- **Union types > inheritance:** `type Status = 'active' | 'inactive'`
- **Unknown > any:** When type is unclear, use `unknown` and narrow it
- **Arrow functions always:** `const add = (a: number, b: number) => a + b`
- **Write Typedocs:** Write typedocs for all functions, and all modules; avoid params and returns in the docs
- **Use JSDoc style comments for types and their values**

### Code Structure
```typescript
// imports first
import { pipe } from './utils/pipe'

// types second
type Transform<T> = (value: T) => T

// single exported function
export const processData = <T>(
  data: T,
  transforms: Transform<T>[]
): T => pipe(...transforms)(data)
```

### Style Rules

- No semicolons (unless required by ASI rules)
- Single-line if/else without braces: `if (x) return y`
- Multi-line always uses braces
- 2 space indentation
- Single quotes for strings, backticks for templates

### Documentation

- JSDoc for public functions with examples
- `@see <url>` with date for external references
- Document removal conditions for temporary code
- No redundant comments explaining obvious code
- Absolutely (!!!!) no comments explaining code changes just made (EVER! LIKE EVER EVER! NEVER DO THIS!!!!)

## Functional Patterns

### Prefer
```typescript
// composable utilities
const add = (a: number) => (b: number) => a + b
const multiply = (a: number) => (b: number) => a * b

// point-free style where readable
const calculateTotal = pipe(
  map(multiply(1.2)),
  reduce(add(0))
)

// immutable updates
const updateUser = (user: User, name: string): User => 
  ({ ...user, name })
```

### Avoid
```typescript
// classes
class UserService { }

// mutations
users.push(newUser)

// imperative loops (unless async needed)
for (let i = 0; i < arr.length; i++) { }

// nested ternaries
x ? y ? a : b : c
```

## Edge Cases

- **Async in loops:** Use `for...of` with `await`, not `.map` with `Promise.all` unless parallel execution needed
- **Type narrowing:** Use type guards over type assertions
- **Error boundaries:** Return `Result<T, E>` types instead of throwing
- **File size:** Split files >200 lines into smaller utilities; keep things readable

## Response Guidelines

- **Neutral tone:** Focus on task execution
- **Concise communication:** Brief, direct responses
- **No acknowledgment** of user emotions
- **Immediate action:** Execute plans without confirmation
