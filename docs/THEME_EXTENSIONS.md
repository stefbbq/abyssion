# Theme System Extensions

This document covers the new extensions to the theme system, including border radius customization, glass/frost opacity overrides, themed background opacity controls, and filter effects for UI elements.

## Border Radius

### Theme Definition

Add custom border radius values to your theme:

```typescript
export const myTheme = createBaseTheme({
  // ... other theme properties
  borderRadius: {
    sm: '0.25rem',    // Override default small radius
    md: '0.5rem',     // Override default medium radius
    lg: '0.75rem',    // Override default large radius
    xl: '1rem',       // Override default extra large radius
    // 'none' and 'full' use defaults if not specified
  },
})
```

### Usage

Use themed border radius in your components:

```tsx
// Using utility classes
<div className="rounded-theme-sm glass-effect">Small rounded corners</div>
<div className="rounded-theme-lg frost-effect">Large rounded corners</div>

// Using the utility function
import { getBorderRadiusClass } from '@lib/theme/utils/getFilterClasses.ts'

<div className={`${getBorderRadiusClass('md')} glass-effect`}>
  Medium rounded corners
</div>

// Using CSS variables directly
<div style={{ borderRadius: 'var(--borderRadius-lg)' }}>
  Custom styling with theme radius
</div>
```

## Glass & Frost Opacity Overrides

### Theme Definition

Control glass and frost morphism opacity for both light and dark modes:

```typescript
export const myTheme = createBaseTheme({
  // ... other theme properties
  
  // Glass effect opacity (for content containers)
  glassOpacity: {
    light: 0.4,  // Glass opacity in light mode
    dark: 0.6,   // Glass opacity in dark mode
  },
  
  // Frost effect opacity (for navigation elements)
  frostOpacity: {
    light: 0.92, // Frost opacity in light mode
    dark: 0.9,   // Frost opacity in dark mode
  },
})
```

### Usage

The opacity values are automatically applied to `.glass-effect` and `.frost-effect` classes:

```tsx
// Glass effect automatically uses theme-specific opacity
<div className="glass-effect p-4">
  Content with themed glass opacity
</div>

// Frost effect automatically uses theme-specific opacity
<nav className="frost-effect">
  Navigation with themed frost opacity
</nav>

// Access opacity values directly in TypeScript
import { currentTheme } from '@lib/theme/state.ts'

const glassOpacity = currentTheme.value.glass.opacity.dark
const frostOpacity = currentTheme.value.frost.opacity.light
```

## Themed Background Opacity

### Theme Definition

Control the opacity of the themed background overlay (per mode theme file):

```typescript
export const myDarkTheme = {
  // ... other theme properties
  mode: 'dark',
  backgroundOpacity: 0.6, // overlay opacity used for this mode
}

export const myLightTheme = {
  // ... other theme properties
  mode: 'light',
  backgroundOpacity: 0.8,
}
```

### Usage

The themed background opacity is automatically applied by the `ThemedBackground` island:

```tsx
// Access background opacity values in TypeScript
import { currentTheme } from '@lib/theme/state.ts'

const backgroundOpacity = currentTheme.value.backgroundOpacity

// Use in custom components with theme-aware opacity
<div 
  style={{ 
    backgroundColor: 'var(--colors-background-primary)',
    opacity: theme.backgroundOpacity 
  }}
>
  Custom background with theme opacity
</div>
```

### Background Behavior

- **Homepage**: Background overlay is hidden (opacity 0) to show GL canvas
- **Content Pages**: Background overlay uses theme-specific opacity values
- **Mode Switching**: Opacity automatically updates when switching between light/dark modes (each mode defines its own value)
- **Theme Switching**: Opacity values update instantly when changing theme families

## Filter Effects

### Theme Definition

Apply custom CSS filter effects to main content, header, and navigation elements:

```typescript
export const myTheme = createBaseTheme({
  // ... other theme properties
  filters: {
    // Filter for main content area
    main: 'brightness(1.05) contrast(1.02)',
    
    // Filter for header element
    header: 'brightness(0.98) saturate(1.1) hue-rotate(2deg)',
    
    // Filter for navigation/action zone
    nav: 'brightness(1.02) contrast(1.05) saturate(0.95)',
  },
})
```

### Usage

Apply filter effects using utility classes or functions:

```tsx
// Using utility classes
<main className="filter-main">
  Main content with themed filter
</main>

<header className="filter-header">
  Header with themed filter
</header>

<nav className="filter-nav">
  Navigation with themed filter
</nav>

// Using the utility function
import { getFilterClass, getFilterClasses } from '@lib/theme/utils/getFilterClasses.ts'

<div className={getFilterClass('main')}>
  Single filter effect
</div>

<div className={getFilterClasses(['main', 'header'])}>
  Multiple filter effects combined
</div>

// Using CSS variables directly
<div style={{ filter: 'var(--filters-main, none)' }}>
  Custom styling with theme filter
</div>
```

## Complete Example

Here's a complete example showing all new features:

```typescript
// theme definition
export const advancedTheme = createBaseTheme({
  name: 'advanced-example',
  mode: 'dark',
  
  // ... standard color properties
  primary: hexStringToRGB('#4263eb'),
  background: hexStringToNumber('#0a0a0a'),
  // ... etc
  
  // New extensions
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
  },
  
  glassOpacity: {
    light: 0.3,
    dark: 0.6,
  },
  
  frostOpacity: {
    light: 0.95,
    dark: 0.9,
  },
  
  backgroundOpacity: {
    light: 0.8,
    dark: 0.6,
  },
  
  filters: {
    main: 'brightness(1.05) contrast(1.02)',
    header: 'brightness(0.98) saturate(1.1) hue-rotate(2deg)',
    nav: 'brightness(1.02) contrast(1.05) saturate(0.95)',
  },
})
```

```tsx
// usage in components
import { getFilterClass, getBorderRadiusClass } from '@lib/theme/utils/getFilterClasses.ts'

export const ExampleComponent = () => (
  <main className={getFilterClass('main')}>
    <header className={`${getFilterClass('header')} frost-effect`}>
      <h1 className={getBorderRadiusClass('lg')}>Themed Header</h1>
    </header>
    
    <div className={`glass-effect ${getBorderRadiusClass('md')} p-6`}>
      <p>Content with themed glass effect and border radius</p>
    </div>
    
    <nav className={`${getFilterClass('nav')} frost-effect rounded-theme-sm`}>
      Navigation with all theme features
    </nav>
  </main>
)
```

## CSS Variables Reference

All new theme properties are exposed as CSS variables:

### Border Radius
- `--borderRadius-none`
- `--borderRadius-sm` 
- `--borderRadius-md`
- `--borderRadius-lg`
- `--borderRadius-xl`
- `--borderRadius-full`

### Filter Effects
- `--filters-main`
- `--filters-header`
- `--filters-nav`

### Opacity Controls (accessible in theme object)
- `theme.glass.opacity.light`
- `theme.glass.opacity.dark`
- `theme.frost.opacity.light`
- `theme.frost.opacity.dark`
- `theme.backgroundOpacity.light`
- `theme.backgroundOpacity.dark`

## Migration Guide

If you have existing themes, they will continue to work without changes. The new properties are optional and use sensible defaults:

- **Border Radius**: Uses standard Tailwind values if not specified
- **Glass Opacity**: `{ light: 0.4, dark: 0.5 }` by default
- **Frost Opacity**: `{ light: 0.9, dark: 0.85 }` by default
- **Background Opacity**: `{ light: 0.7, dark: 0.6 }` by default
- **Filters**: No filters applied if not specified

To adopt the new features, simply add the optional properties to your theme definitions as needed. 