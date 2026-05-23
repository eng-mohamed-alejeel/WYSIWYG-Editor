/**
 * Layout Engine Package
 *
 * Professional layout engine for visual editor with support for:
 * - Flexbox layouts
 * - CSS Grid layouts
 * - Absolute positioning
 * - Auto layout
 * - Constraints
 * - Smart snapping
 * - Alignment controls
 * - Layout guides
 * - Resize handles
 * - Drag alignment
 * - Responsive behavior
 * - Spacing system
 */

// Export all types
export * from './types';

// Export core layout engine
export { LayoutEngine } from './engine/LayoutEngine';

// Export smart snapping system
export { SmartSnappingSystem } from './snap/SmartSnappingSystem';

// Export spacing system
export { SpacingSystem } from './spacing/SpacingSystem';

// Export alignment controls
export { AlignmentControls } from './alignment/AlignmentControls';

// Export layout guides
export { LayoutGuides } from './guides/LayoutGuides';

// Export resize handles
export { ResizeHandles } from './resize/ResizeHandles';

// Export drag alignment
export { DragAlignment } from './drag/DragAlignment';

// Export responsive layout
export { ResponsiveLayout } from './responsive/ResponsiveLayout';
