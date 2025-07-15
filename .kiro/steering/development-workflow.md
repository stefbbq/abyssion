# Development Workflow & Operational Guidelines

## Development Commands

### Primary Development
```bash
# Start development server with file watching
deno task start

# Build shaders + start dev server  
deno task dev

# File watcher with shader rebuilding
deno task watch
```

### Building & Deployment
```bash
# Production build
deno task build

# Preview production build
deno task preview
```

### Code Quality
```bash
# Format, lint, and type check everything
deno task check

# Individual operations
deno fmt                # Format code
deno lint              # Lint code
deno check **/*.ts     # Type check
```

### Shader Development
```bash
# Build all shaders (preprocess + convert to TS)
deno task build:shaders

# Individual shader operations
deno task build:shaders:preprocess   # Process GLSL includes
deno task build:shaders:to-ts        # Convert GLSL to TypeScript
```

## LLM Operational Guidelines

### Core Principles
- **Act, don't ask**: Use available tools directly instead of asking user to perform actions
- **Continuous discovery**: Update understanding with structural findings
- **Immediate action**: Execute plans without confirmation
- **Neutral tone**: Focus on task execution with concise communication

### Available Tools
- `readFile` - Read file contents
- `strReplace` - Edit files with precise replacements
- `fsWrite` - Create new files
- `executeBash` - Run terminal commands
- `grepSearch` - Search for patterns in files
- `listDirectory` - Explore directory structure
- `fileSearch` - Find files by name pattern
- `deleteFile` - Remove files

### Response Guidelines
- **Brief, direct responses**: No fluff or acknowledgment of emotions
- **Focus on execution**: Provide actionable information
- **Technical accuracy**: Use proper terminology and patterns
- **Code examples**: Show concrete implementations when helpful

## File Organization Workflow

### Creating New Features
1. **Identify the domain**: Theme, GL, animation, etc.
2. **Create feature directory**: Group related functionality
3. **Start with types**: Define interfaces first
4. **Pure functions first**: Implement calculations/utilities
5. **Orchestrators last**: Handle side effects and integration

### File Naming Patterns
```
/feature/
  index.ts                    # Barrel export
  types.ts                    # Type definitions
  /utils/
    calculateSomething.ts     # Pure calculation
    transformData.ts          # Pure transformation
  /orchestrators/
    createFeatureManager.ts   # Side-effect orchestrator
```

### Import Strategy
- **Use path aliases**: `@lib/`, `@components/`, etc.
- **Barrel imports**: Import from `index.ts` when available
- **Absolute imports**: Avoid relative imports for top-level modules
- **Group imports**: External → Internal → Types → Implementation

## Debug Workflow

### Debug System Usage
- **Enable debug mode**: Set debug flags or use keyboard shortcuts
- **Debug panels**: Use `DebugPanels` island for interactive controls
- **Logging**: Use structured logger with contexts (`lc.GL`, `lc.THEME`, etc.)
- **Theme testing**: Use debug panel theme selector for real-time switching

### Debug Controls
- **D**: Toggle debug panel visibility
- **R**: Toggle auto-rotation
- **G**: Regenerate layers
- **DOF sliders**: Focus, aperture, blur controls
- **Theme selector**: Live theme family switching

### Logging Best Practices
```typescript
import { log, lc } from '@liblogger/index.ts'

// Use appropriate context
log(lc.GL, 'Initializing GL scene')
log.debug(lc.GL_ANIMATION, 'Animation frame:', frameData)
log.warn(lc.THEME, 'Theme not found, using default')
log.error(lc.GL_SHADER, 'Shader compilation failed:', error)
```

## Configuration Management

### JSON Configuration Files
- **Scene**: `lib/gl/configScene.json` - Core 3D settings
- **Post-processing**: `lib/gl/configPostProcessing.json` - Visual effects
- **Animation**: `lib/gl/configAnimation.json` - Timing and behavior
- **Controls**: `lib/gl/configControls.json` - Input handling
- **Video cycle**: `lib/gl/configVideoCycle.json` - Background management

### Configuration Patterns
- **Type safety**: All configs have corresponding TypeScript types
- **Modular structure**: Effects can be configured independently
- **Runtime updates**: Some configs support live updates via debug controls
- **Validation**: Configs are validated at load time

## Theme Development Workflow

### Creating New Themes
1. **Define BaseTheme**: Color palette and mode in `lib/theme/themes/`
2. **Test in visualizer**: Use `/theme` route for preview
3. **Verify GL integration**: Check 3D effects adapt properly
4. **Test light/dark modes**: Ensure both variants work
5. **Cookie persistence**: Verify theme preferences save correctly

### Theme Integration Checklist
- **CSS variables**: All colors exposed as custom properties
- **Tailwind integration**: Semantic classes work properly
- **GL theme**: 3D effects use theme colors
- **Real-time switching**: No page reload required
- **Debug integration**: Theme selector includes new theme

## 3D Graphics Development

### GL Development Workflow
1. **Pure calculations first**: Implement math functions
2. **Test calculations**: Unit test pure functions
3. **Create orchestrator**: Handle Three.js side effects
4. **Configuration**: Add to appropriate JSON config
5. **Debug integration**: Add controls if needed

### Shader Development
1. **Write GLSL**: Use modular includes from `utils/`
2. **Build shaders**: Run `deno task build:shaders`
3. **Integration**: Add to post-processing pipeline
4. **Configuration**: Add parameters to config JSON
5. **Debug controls**: Create UI for live parameter adjustment

### Animation System
- **Pure functions**: All calculations are deterministic
- **One function per file**: Maximum modularity
- **Orchestrator pattern**: Side effects isolated
- **Composable**: Functions can be combined for new behaviors

## Performance Optimization

### 3D Graphics Performance
- **Efficient video management**: Use video pool rotation
- **Shader optimization**: Minimize complex calculations
- **Memory cleanup**: Dispose of Three.js resources properly
- **Responsive handling**: Adapt to screen size and capabilities

### General Performance
- **Pure functions**: Enable optimization and memoization
- **Immutable updates**: Avoid unnecessary re-renders
- **Signal efficiency**: Use computed signals for derived state
- **Bundle optimization**: Tree-shake unused code

## Testing Strategy

### Pure Function Testing
- **Unit tests**: Easy to test deterministic functions
- **No mocking**: Pure functions have no external dependencies
- **Composability**: Test individual pieces and combinations
- **Predictability**: No hidden state or side effects

### Integration Testing
- **Theme switching**: Verify all systems adapt to theme changes
- **GL initialization**: Test 3D scene setup and cleanup
- **Configuration loading**: Validate JSON configs load properly
- **Debug system**: Ensure debug controls work correctly

## Deployment Considerations

### Build Process
- **Shader compilation**: Ensure GLSL files are processed
- **Type checking**: All TypeScript must compile cleanly
- **Asset optimization**: Images and videos properly compressed
- **Configuration validation**: All JSON configs are valid

### Production Settings
- **Logging levels**: Set appropriate log levels for production
- **Debug mode**: Disable debug features in production
- **Performance monitoring**: Track 3D graphics performance
- **Error handling**: Graceful degradation for unsupported features