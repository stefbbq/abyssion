# abyssion llm operational guide

short, practical engineering rules for working on abyssion with an llm. this guide is optimized for search and quick reference.

- keywords: abyssion codebase, functional typescript, preact components, fresh deno, three.js, gl animation, shader pipeline, testing pure functions

## core principles

### functional programming first

- **Pure functions only:** Every function must be deterministic and side-effect free, whenever possible
- **Immutability:** Never mutate data. Return new values instead, whenever possible
- **Composition over inheritance:** Build complex behavior by composing simple functions
- **Types over classes:** Use type aliases and unions. No classes unless absolutely necessary
- **One file per function, unless it's an orchastrating module:** Each file exports a single, well-typed function
- **Avoid relative imports:** Use absolute imports whenever possible; make them if you need to for top level modules

### component authoring

- **Always use export const arrow functions for components**
- **Always define the Props type at the top of the file, do not export it, and use it directly below for the component**
- **Never write @property autodoc unless the property is truly unusual**
- **Write type docs for each type inline: alternate a doc line and a type line, one after the other**

### file organization

```
/module/
  /module.ts         # main entry point
  /module.d.ts       # colocated types
  /utils/
    /functionA.ts    # one pure function per file
    /functionB.ts    # with meaningful typedocs
```

### tool usage

- **Act, don't ask:** Use available tools directly instead of asking user to perform actions
- **Available tools:** `codebase_search`, `read_file`, `apply_patch`, `edit_file`, `run_terminal_cmd`, `grep_search`, `list_dir`, `glob_file_search`, `delete_file`, `web_search`
- **Continuous discovery:** Keep mental notes; no dedicated "Repo Map" section maintained here

## code standards

### naming

- Types: `PascalCase` (no "I" prefix for interfaces)
- Functions/variables: `camelCase` (no abbreviations)
- State booleans: `isXXXing`, `hasXXXed`, etc
- Avoid underscores, unless you're using them for ignored parameters

### typescript specifics

- **Named exports only** (except workers)
- **Type aliases > interfaces:** `type User = { name: string }` not `interface IUser`
- **Leverage generics:** `type List<T> = T[]` not `type List = Array<any>`
- **Union types > inheritance:** `type Status = 'active' | 'inactive'`
- **Unknown > any:** When type is unclear, use `unknown` and narrow it
- **Arrow functions always:** `const add = (a: number, b: number) => a + b`
- **Write Typedocs:** Write typedocs for all functions, and all modules; avoid params and returns in the docs
- **Type docs for each type inline:**

  ```typescript
  // the user's name
  type UserName = string
  // the user's status
  type Status = 'active' | 'inactive'
  ```

- **Do not use @property autodoc unless the property is truly unusual**
- **Use JSDoc style comments for types and their values**

### component structure

- **Always use export const arrow functions for components**
- **Always define the Props type at the top of the file, do not export it, and use it directly below for the component**

  ```typescript
  // the props for MyComponent
  type Props = {
    // the label to display
    label: string
    // whether the component is active
    isActive: boolean
  }

  export const MyComponent = (props: Props) => (
    <div>{props.label}</div>
  )
  ```

### code structure

```typescript
// imports first
import { pipe } from './utils/pipe'

// types second
// the transform function type
/** transforms a value of type T */
type Transform<T> = (value: T) => T

// single exported function
export const processData = <T>(
  data: T,
  transforms: Transform<T>[]
) => pipe(...transforms)(data)
```

### style rules

- No semicolons (unless required by ASI rules)
- Single-line if/else without braces: `if (x) return y`
- Multi-line always uses braces
- 2 space indentation
- Single quotes for strings, backticks for templates

### documentation

- JSDoc for public functions with examples
- `@see <url>` with date for external references
- Document removal conditions for temporary code
- No redundant comments explaining obvious code
- Absolutely (!!!!) no comments explaining code changes just made (EVER! LIKE EVER EVER! NEVER DO THIS!!!!)

## functional patterns

### prefer

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

### avoid

```typescript
// classes
class UserService { }

// mutations
users.push(newUser)

// imperative loops (unless async needed)
for (let i = 0; i < arr.length; i++) { }

// NEVER DO THIS!!: nested ternaries
x ? y ? a : b : c
```

## edge cases

- **Async in loops:** Use `for...of` with `await`, not `.map` with `Promise.all` unless parallel execution needed
- **Type narrowing:** Use type guards over type assertions
- **Error boundaries:** Return `Result<T, E>` types instead of throwing
- **File size:** Split files >200 lines into smaller utilities; keep things readable

## response guidelines

- **Neutral tone:** Focus on task execution
- **Concise communication:** Brief, direct responses
- **No acknowledgment** of user emotions
- **Immediate action:** Execute plans without confirmation

--- conventions

Totally normal to feel this way. The longer you do this, the more edge cases and tradeoffs you see—and that makes every choice feel heavier. Here's the straight version, no fluff:

⸻

🔧 When to Use Classes vs. Composables
 • Use classes when:
 • You're modeling a domain entity or lifecycle-based object (User, Car, etc.).
 • You want inheritance or need to override behavior cleanly.
 • You care about encapsulating internal state with method access.
 • Use composables (functions + closures) when:
 • Behavior is king, not identity.
 • You want easier testing, reuse, and composition.
 • You're in functional-heavy or React-style codebases.

Most modern JS/TS leans composable. Cleaner dependency injection, less state weirdness.

⸻

📁 File Structure & Function Count
 • 1 function per file: Good for utilities, pure functions, and strict composability. Annoying if overdone—death by tabs.
 • Multiple exports per file: Best when they're conceptually cohesive (e.g. all related to auth, or useXYZ React hooks).
 • 10 random exports per file: Avoid. Hard to scan, brittle in refactors.

Rule of thumb: if you feel like scrolling sucks, you're cramming too much.

⸻

📦 Barrel Files

Use barrel files (index.ts exporting from sibling modules) when:
 • You want a clean public API surface for a module or folder.
 • You're consuming many things from a directory in multiple places.

Don't overuse. Barrel hell = circular deps + unclear provenance.

⸻

🧭 Named vs. Default Exports
 • Named exports: Clear, auto-suggest works, easier refactors. Default in most teams.
 • Default exports: Handy when there's one main thing and naming isn't critical (export default function handler()).

Avoid mixing them in the same file unless you're very intentional.

⸻

🧠 Mental Models That Help
 • Group by feature, not type: Keep auth/login.ts, auth/validate.ts instead of utils/, services/, etc.
 • Stable layers: Use layers like core, features, app or domain, infra, ui, etc. They clarify flow.
 • Draw the tree: Visualize import direction. Dependencies should flow inward, not circularly.

⸻

✅ Practical Defaults That Don't Suck
 • Named exports only.
 • Barrel files only at module boundaries.
 • Max 1–3 top-level functions per file unless it's a utility file.
 • Prefer composables over classes unless you're in OOP land.
 • Organize by feature > domain > type.

Want a real example based on your current project setup? Happy to go through it with you.
