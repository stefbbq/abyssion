# Surface System Documentation

The new surface-based theme system provides a unified approach to styling UI components with consistent borders, opacity, effects, and visual styling across all surfaces.

## Overview

Instead of scattered border radius, glass/frost opacity, and filter properties, the surface system organizes all surface-related styling into a cohesive configuration:

```typescript
surfaces: {
  main: {
    color: hexStringToNumber('#ff2d55'),
    opacity: { light: 0.85, dark: 0.9 },
    borderRadius: '0px',
    border: {
      width: '2px',
      style: 'solid',
      color: hexStringToNumber('#d8d8d8'),
    },
    effects: {
      backdropBlur: '8px',
      filter: 'brightness(1.02) contrast(1.05)',
      boxShadow: '0 0 4px rgba(255, 45, 85, 0.3)',
    },
  },
  // ... other surfaces
}
```

## Available Surfaces

- **main**: Primary content surface
- **alt**: Alternative surface for secondary content
- **header**: Header surface (falls back to main if not specified)
- **nav**: Navigation/action zone surface (falls back to main if not specified)
- **card**: Card surface (falls back to alt if not specified)
- **input**: Input/form surface (falls back to alt if not specified)
- **button**: Button surface (falls back to main if not specified)
- **dropdown**: Dropdown/modal surface (falls back to alt if not specified)

## Usage in Components

### Method 1: Using CSS Classes

```tsx
import { JSX } from 'preact'

export const MyCard = ({ children }: { children: JSX.Element }) => (
  <div className="surface-card border-surface-card">
    {children}
  </div>
)
```

### Method 2: Using Utility Functions

```tsx
import { getSurfaceClasses, getSurfaceBorderClasses } from '@lib/theme/utils/getSurfaceStyles.ts'

export const MyButton = ({ children, onClick }: { children: JSX.Element, onClick: () => void }) => {
  const surfaceClasses = getSurfaceClasses('button')
  const borderClasses = getSurfaceBorderClasses(theme.surfaces.button)
  
  return (
    <button 
      className={`${surfaceClasses} ${borderClasses}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
```

### Method 3: Using Inline Styles

```tsx
import { getTheme } from '@lib/theme/getTheme.ts'
import { getSurfaceProperties } from '@lib/theme/utils/getSurfaceStyles.ts'

export const MyInput = ({ value, onChange }: { value: string, onChange: (value: string) => void }) => {
  const theme = getUITheme()
  const surfaceProps = getSurfaceProperties(theme.surfaces.input, theme.mode)
  
  return (
    <input
      style={surfaceProps}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}
```

## Border Configuration

### Disabling Borders

```typescript
// In theme configuration
surfaces: {
  main: {
    border: {
      width: '0px',
      style: 'none',
    },
  }
}
```

### Custom Border Styles

```typescript
// Various border styles
surfaces: {
  card: {
    border: {
      width: '2px',
      style: 'dashed',
      color: hexStringToNumber('#ff2d55'),
    },
  },
  input: {
    border: {
      width: '1px',
      style: 'solid',
      color: hexStringToNumber('#2EC2FF'),
    },
  }
}
```

## Visual Effects

### Backdrop Blur

```typescript
surfaces: {
  main: {
    effects: {
      backdropBlur: '12px', // Creates glass morphism effect
    },
  }
}
```

### Custom Filters

```typescript
surfaces: {
  nav: {
    effects: {
      filter: 'brightness(1.03) saturate(1.1) drop-shadow(0 0 2px rgba(189, 16, 224, 0.3))',
    },
  }
}
```

### Box Shadows

```typescript
surfaces: {
  card: {
    effects: {
      boxShadow: '0 4px 8px rgba(46, 194, 255, 0.3)',
    },
  }
}
```

### Transforms

```typescript
surfaces: {
  button: {
    effects: {
      transform: 'scale(1.02)',
    },
  }
}
```

## CSS Variables

The surface system automatically generates CSS variables:

```css
/* Background colors */
--surfaces-main-background: rgba(255, 45, 85, 0.85);
--surfaces-alt-background: rgba(46, 194, 255, 0.95);

/* Border properties */
--surfaces-main-borderColor: #d8d8d8;
--surfaces-card-borderRadius: 0px;

/* Effects */
--surfaces-main-backdropBlur: blur(8px);
--surfaces-nav-filter: brightness(1.03) saturate(1.1);
--surfaces-card-boxShadow: 0 4px 8px rgba(46, 194, 255, 0.3);
```

## Migration from Legacy System

### Old Way (Deprecated)

```typescript
// Old scattered properties
borderRadius: { sm: '2px', md: '4px' },
glassOpacity: { light: 0.4, dark: 0.5 },
frostOpacity: { light: 0.9, dark: 0.85 },
filters: { main: 'brightness(1.02)' },
```

### New Way

```typescript
// New organized surface system
surfaces: {
  main: {
    opacity: { light: 0.4, dark: 0.5 },
    borderRadius: '4px',
    effects: {
      backdropBlur: '16px',
      filter: 'brightness(1.02)',
    },
  },
  alt: {
    opacity: { light: 0.9, dark: 0.85 },
    borderRadius: '2px',
    effects: {
      backdropBlur: '20px',
    },
  },
}
```

## Examples

### neonGridOS Theme (CRT Style)

```typescript
surfaces: {
  main: {
    color: hexStringToNumber('#ff2d55'),
    opacity: { light: 0.85, dark: 0.9 },
    borderRadius: '0px', // Squared for retro feel
    border: {
      width: '2px',
      style: 'solid',
      color: hexStringToNumber('#d8d8d8'),
    },
    effects: {
      backdropBlur: '8px',
      filter: 'perspective(1000px) rotateX(0.5deg) scale(1.002, 0.998)',
      boxShadow: '0 0 4px rgba(255, 45, 85, 0.3)',
    },
  },
}
```

### Minimal Theme (Clean Style)

```typescript
surfaces: {
  main: {
    color: hexStringToNumber('#ffffff'),
    opacity: { light: 0.95, dark: 0.9 },
    borderRadius: '8px',
    border: {
      width: '1px',
      style: 'solid',
      color: hexStringToNumber('#e0e0e0'),
    },
    effects: {
      backdropBlur: '4px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    },
  },
}
```

## Best Practices

1. **Consistency**: Use the same surface type for similar components
2. **Fallbacks**: Optional surfaces (header, nav, card, etc.) automatically fall back to main/alt
3. **Performance**: CSS variables are cached and update reactively
4. **Accessibility**: Ensure sufficient contrast when using opacity
5. **Responsive**: Opacity automatically adjusts for light/dark modes

## API Reference

### Types

- `BaseSurface`: Complete surface configuration
- `BaseSurfaces`: Surface system configuration
- `UISurface`: UI-specific surface with CSS values
- `SurfaceType`: Surface identifier type

### Functions

- `getSurfaceStyles(surface, mode)`: Get CSS styles string
- `getSurfaceProperties(surface, mode)`: Get CSS properties object
- `getSurfaceClasses(surfaceType)`: Get CSS class names
- `getSurfaceBorderRadius(surface)`: Get border radius class
- `getSurfaceBorderClasses(surface)`: Get border classes
- `disableBorders()`: Utility to disable borders
- `createCustomBorder(width, style, color)`: Create custom border 