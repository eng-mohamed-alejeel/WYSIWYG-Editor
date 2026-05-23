# Responsive Editing Engine

A professional responsive editing system for the WYSIWYG Visual Component Builder, inspired by Webflow and Framer.

## Features

### 1. Breakpoint Management

- **Four Default Breakpoints**: Mobile, Tablet, Desktop, Wide
- **Custom Device Configurations**: Add and manage custom device presets
- **Breakpoint Visibility**: Control which breakpoints are visible in the editor
- **Device Preview**: Preview designs across different devices and orientations

### 2. Style Inheritance

- **Automatic Inheritance**: Styles automatically cascade from smaller to larger breakpoints
- **Visual Indicators**: Clear indicators showing inherited vs overridden styles
- **Override Tracking**: Track which properties are overridden at each breakpoint
- **Source Breakpoint Detection**: Know exactly where a style value comes from

### 3. Style Overrides

- **Per-Breakpoint Overrides**: Override any style property at any breakpoint
- **Override Management**: Add, remove, and copy overrides between breakpoints
- **Visual Override Indicators**: See at a glance which properties have overrides
- **Bulk Operations**: Clear all overrides for a breakpoint or copy overrides between breakpoints

### 4. Responsive Inspector

- **Breakpoint-Aware Editing**: Edit styles specific to each breakpoint
- **Property-Level Controls**: Fine-grained control over each style property
- **Inheritance Visualization**: See which properties are inherited from smaller breakpoints
- **Real-Time Preview**: Preview style changes before applying them

### 5. Device Preview System

- **Multiple Device Presets**: Preview on phones, tablets, and desktops
- **Orientation Support**: Switch between portrait and landscape modes
- **Zoom Controls**: Zoom in and out for detailed inspection
- **Custom Device Frames**: Configure device frame appearance

### 6. Performance Optimization

- **Style Caching**: Intelligent caching of computed styles
- **Memoization**: Optimized re-renders with React memo
- **Batch Rendering**: Efficient rendering of multiple components
- **Cache Management**: Automatic cache size maintenance

### 7. Style Serialization

- **JSON Export**: Export responsive styles as structured JSON
- **Version Control**: Track style changes with metadata
- **Import/Export**: Save and load responsive style configurations
- **CSS Generation**: Generate production-ready CSS with media queries

## Architecture

### Core Components

#### BreakpointManager

Manages breakpoint configurations and device mappings.

```typescript
import { getGlobalBreakpointManager } from './responsive/BreakpointManager';

const manager = getGlobalBreakpointManager();

// Set current breakpoint
manager.setBreakpoint('tablet');

// Get devices for a breakpoint
const devices = manager.getDevicesByBreakpoint('tablet');

// Add custom device
manager.addDevice({
  id: 'custom-phone',
  name: 'Custom Phone',
  icon: 'smartphone',
  width: 390,
  height: 844,
  breakpoint: 'mobile',
});
```

#### ResponsiveStyleManager

Handles style inheritance, overrides, and serialization.

```typescript
import { getGlobalResponsiveStyleManager } from './responsive/ResponsiveStyleManager';

const styleManager = getGlobalResponsiveStyleManager();

// Get effective styles for a breakpoint
const styles = styleManager.getEffectiveStyles(baseStyles, responsiveStyles, 'tablet');

// Set style override
const newResponsiveStyles = styleManager.setStyleOverride(
  componentId,
  baseStyles,
  responsiveStyles,
  'tablet',
  'padding',
  '20px'
);

// Serialize styles
const serialized = styleManager.serializeResponsiveStyles(
  componentId,
  baseStyles,
  responsiveStyles
);
```

#### ResponsiveEngine

Main engine that coordinates all responsive features.

```typescript
import { ResponsiveEngineProvider, useResponsiveEngine } from './responsive/ResponsiveEngine';

// Wrap your app with the provider
<ResponsiveEngineProvider initialBreakpoint="desktop">
  <YourApp />
</ResponsiveEngineProvider>

// Use the engine in components
function YourComponent() {
  const {
    currentBreakpoint,
    setBreakpoint,
    getEffectiveStyles,
    setStyleOverride,
  } = useResponsiveEngine();

  // ... use responsive features
}
```

#### DevicePreview

Device preview component with breakpoint switching.

```typescript
import { DevicePreview } from './responsive/DevicePreview';

<DevicePreview
  initialBreakpoint="desktop"
  onBreakpointChange={(bp) => console.log('Breakpoint changed:', bp)}
  showDeviceSelector={true}
  showZoomControls={true}
>
  <YourContent />
</DevicePreview>
```

#### ResponsiveInspector

Inspector controls for editing responsive styles.

```typescript
import { ResponsiveInspector } from './responsive/ResponsiveInspector';

<ResponsiveInspector
  componentId="component-123"
  baseStyles={component.styles}
  responsiveStyles={component.responsiveStyles}
  onStyleChange={(breakpoint, property, value) => {
    // Handle style change
  }}
  onStyleRemove={(breakpoint, property) => {
    // Handle style override removal
  }}
/>
```

#### ResponsiveRenderer

Optimized renderer for responsive components.

```typescript
import { ResponsiveRenderer } from './renderer/responsive/ResponsiveRenderer';

<ResponsiveRenderer
  component={componentNode}
  context={rendererContext}
>
  {children}
</ResponsiveRenderer>
```

## Usage Examples

### Basic Setup

```typescript
import { ResponsiveEngineProvider } from '@wysiwyg/editor/responsive';

function App() {
  return (
    <ResponsiveEngineProvider initialBreakpoint="desktop">
      <Editor />
    </ResponsiveEngineProvider>
  );
}
```

### Using Device Preview

```typescript
import { DevicePreview } from '@wysiwyg/editor/responsive';

function Editor() {
  return (
    <DevicePreview
      initialBreakpoint="desktop"
      onBreakpointChange={handleBreakpointChange}
    >
      <Canvas />
    </DevicePreview>
  );
}
```

### Editing Responsive Styles

```typescript
import { ResponsiveInspector } from '@wysiwyg/editor/responsive';

function StylePanel({ component }) {
  return (
    <ResponsiveInspector
      componentId={component.id}
      baseStyles={component.styles}
      responsiveStyles={component.responsiveStyles}
      onStyleChange={(breakpoint, property, value) => {
        updateComponentStyle(component.id, breakpoint, property, value);
      }}
    />
  );
}
```

### Getting Effective Styles

```typescript
import { useResponsiveEngine } from '@wysiwyg/editor/responsive';

function ComponentRenderer({ component }) {
  const { getEffectiveStyles } = useResponsiveEngine();

  const effectiveStyles = getEffectiveStyles(
    component.id,
    component.styles,
    component.responsiveStyles
  );

  return <div style={effectiveStyles}>{component.children}</div>;
}
```

## Performance Considerations

### Style Caching

The responsive engine automatically caches computed styles to improve performance:

- Cache size is automatically maintained
- Cache is invalidated when component styles change
- Pre-warming for adjacent breakpoints on breakpoint change

### Rendering Optimization

- Components use React.memo for optimized re-renders
- Batch rendering for multiple components
- Virtualization support for large component trees

### Best Practices

1. Use the ResponsiveEngineProvider at the root of your app
2. Leverage style caching for frequently accessed components
3. Use batch rendering for large component trees
4. Clear cache when components are removed or significantly changed

## API Reference

### BreakpointManager

- `setBreakpoint(breakpoint: Breakpoint): void`
- `setDevice(deviceId: string): void`
- `getDevicesByBreakpoint(breakpoint: Breakpoint): DeviceConfig[]`
- `getCurrentBreakpoint(): Breakpoint`
- `getNextBreakpoint(current?: Breakpoint): Breakpoint`
- `getPreviousBreakpoint(current?: Breakpoint): Breakpoint`

### ResponsiveStyleManager

- `getEffectiveStyles(baseStyles, responsiveStyles, breakpoint): StyleObject`
- `setStyleOverride(componentId, baseStyles, responsiveStyles, breakpoint, property, value): Record<Breakpoint, StyleObject>`
- `removeStyleOverride(componentId, responsiveStyles, breakpoint, property): Record<Breakpoint, StyleObject>`
- `serializeResponsiveStyles(componentId, baseStyles, responsiveStyles): SerializedResponsiveStyles`
- `deserializeResponsiveStyles(data): { base, responsiveStyles }`

### ResponsiveEngine Context

- `currentBreakpoint: Breakpoint`
- `setBreakpoint(breakpoint: Breakpoint): void`
- `getEffectiveStyles(componentId, baseStyles, responsiveStyles): StyleObject`
- `setStyleOverride(componentId, baseStyles, responsiveStyles, property, value): Record<Breakpoint, StyleObject>`
- `removeStyleOverride(componentId, responsiveStyles, property): Record<Breakpoint, StyleObject>`
- `previewStyles(previewState: StylePreviewState): void`
- `clearPreview(): void`

## Contributing

When contributing to the responsive editing engine:

1. Follow the existing architecture patterns
2. Ensure performance optimizations are maintained
3. Add proper TypeScript types
4. Update documentation for new features
5. Test across all breakpoints

## License

MIT
