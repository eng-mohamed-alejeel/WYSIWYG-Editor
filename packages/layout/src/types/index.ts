/**
 * Layout Engine Types
 *
 * Comprehensive type definitions for the professional layout engine
 * supporting Flexbox, CSS Grid, absolute positioning, constraints, and auto layout
 */

import { ComponentId, Breakpoint, StyleProperty, StyleValue } from '@wysiwyg/core';

/**
 * Layout mode types
 */
export type LayoutMode = 'flex' | 'grid' | 'absolute' | 'auto' | 'flow';

/**
 * Flexbox direction
 */
export type FlexDirection = 'row' | 'row-reverse' | 'column' | 'column-reverse';

/**
 * Flexbox wrap
 */
export type FlexWrap = 'nowrap' | 'wrap' | 'wrap-reverse';

/**
 * Flexbox alignment options
 */
export type JustifyContent =
  | 'flex-start'
  | 'flex-end'
  | 'center'
  | 'space-between'
  | 'space-around'
  | 'space-evenly';

export type AlignItems = 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';

export type AlignContent =
  | 'flex-start'
  | 'flex-end'
  | 'center'
  | 'space-between'
  | 'space-around'
  | 'stretch';

/**
 * Grid track sizing
 */
export type GridTrackSize =
  | 'auto'
  | 'min-content'
  | 'max-content'
  | 'fit-content'
  | number
  | string;

/**
 * Grid auto flow
 */
export type GridAutoFlow = 'row' | 'column' | 'dense' | 'row dense' | 'column dense';

/**
 * Position types
 */
export type PositionType = 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';

/**
 * Constraint types
 */
export type ConstraintType =
  | 'minWidth'
  | 'maxWidth'
  | 'minHeight'
  | 'maxHeight'
  | 'aspectRatio'
  | 'fixedWidth'
  | 'fixedHeight';

/**
 * Spacing scale
 */
export type SpacingScale = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';

/**
 * Alignment snap points
 */
export type SnapPoint = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly' | 'custom';

/**
 * Layout measurement
 */
export interface LayoutMeasurement {
  width: number;
  height: number;
  top: number;
  left: number;
  right: number;
  bottom: number;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
}

/**
 * Layout bounds
 */
export interface LayoutBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Layout constraints
 */
export interface LayoutConstraints {
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  aspectRatio?: number;
  fixedWidth?: number;
  fixedHeight?: number;
  maintainAspectRatio?: boolean;
}

/**
 * Flexbox layout configuration
 */
export interface FlexLayoutConfig {
  direction: FlexDirection;
  wrap: FlexWrap;
  justifyContent: JustifyContent;
  alignItems: AlignItems;
  alignContent?: AlignContent;
  gap?: number;
  rowGap?: number;
  columnGap?: number;
}

/**
 * Grid layout configuration
 */
export interface GridLayoutConfig {
  columns: GridTrackSize[];
  rows: GridTrackSize[];
  columnGap?: number;
  rowGap?: number;
  autoFlow?: GridAutoFlow;
  autoColumns?: GridTrackSize;
  autoRows?: GridTrackSize;
  templateAreas?: string[][];
}

/**
 * Absolute positioning configuration
 */
export interface AbsoluteLayoutConfig {
  position: PositionType;
  top?: number | 'auto';
  right?: number | 'auto';
  bottom?: number | 'auto';
  left?: number | 'auto';
  zIndex?: number;
}

/**
 * Auto layout configuration
 */
export interface AutoLayoutConfig {
  mode: LayoutMode;
  direction: FlexDirection;
  padding: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  gap: number;
  itemSpacing: number;
  alignment: {
    horizontal: JustifyContent;
    vertical: AlignItems;
  };
  sizing: {
    width: 'fill' | 'fit' | 'fixed';
    height: 'fill' | 'fit' | 'fixed';
  };
}

/**
 * Spacing configuration
 */
export interface SpacingConfig {
  scale: Record<SpacingScale, number>;
  defaultPadding: number;
  defaultMargin: number;
  defaultGap: number;
}

/**
 * Alignment controls configuration
 */
export interface AlignmentControlsConfig {
  snapEnabled: boolean;
  snapThreshold: number;
  snapPoints: SnapPoint[];
  customSnapPoints?: number[];
  showGuides: boolean;
  guideColor: string;
  guideStyle: 'solid' | 'dashed' | 'dotted';
}

/**
 * Smart snapping configuration
 */
export interface SmartSnappingConfig {
  enabled: boolean;
  threshold: number;
  snapToEdges: boolean;
  snapToCenter: boolean;
  snapToSpacing: boolean;
  snapToGrid: boolean;
  gridSize: number;
  snapToComponents: boolean;
  snapToGuides: boolean;
}

/**
 * Layout guides configuration
 */
export interface LayoutGuidesConfig {
  showMargins: boolean;
  showPadding: boolean;
  showBorders: boolean;
  showGrid: boolean;
  showAlignment: boolean;
  showSpacing: boolean;
  marginColor: string;
  paddingColor: string;
  borderColor: string;
  gridColor: string;
  alignmentColor: string;
  spacingColor: string;
}

/**
 * Resize handle configuration
 */
export interface ResizeHandleConfig {
  enabled: boolean;
  handles: 'all' | 'corners' | 'edges' | 'custom';
  customHandles?: ResizeHandlePosition[];
  minimumSize: {
    width: number;
    height: number;
  };
  maximumSize?: {
    width: number;
    height: number;
  };
  maintainAspectRatio: boolean;
  snapToGrid: boolean;
  gridSize: number;
}

/**
 * Resize handle position
 */
export type ResizeHandlePosition =
  | 'top-left'
  | 'top'
  | 'top-right'
  | 'right'
  | 'bottom-right'
  | 'bottom'
  | 'bottom-left'
  | 'left';

/**
 * Drag alignment indicators configuration
 */
export interface DragAlignmentConfig {
  showIndicators: boolean;
  indicatorColor: string;
  indicatorStyle: 'solid' | 'dashed';
  indicatorWidth: number;
  showDistance: boolean;
  snapThreshold: number;
}

/**
 * Layout calculation result
 */
export interface LayoutCalculationResult {
  measurements: Map<ComponentId, LayoutMeasurement>;
  bounds: Map<ComponentId, LayoutBounds>;
  constraints: Map<ComponentId, LayoutConstraints>;
  overflow: Set<ComponentId>;
  warnings: LayoutWarning[];
}

/**
 * Layout warning
 */
export interface LayoutWarning {
  componentId: ComponentId;
  type: 'overflow' | 'constraint' | 'overlap' | 'performance';
  message: string;
  severity: 'info' | 'warning' | 'error';
}

/**
 * Responsive layout configuration
 */
export interface ResponsiveLayoutConfig {
  breakpoints: Record<Breakpoint, number>;
  defaultBreakpoint: Breakpoint;
  currentBreakpoint: Breakpoint;
  layoutConfigs: Partial<Record<Breakpoint, LayoutConfig>>;
}

/**
 * Layout configuration (union of all layout types)
 */
export type LayoutConfig =
  | FlexLayoutConfig
  | GridLayoutConfig
  | AbsoluteLayoutConfig
  | AutoLayoutConfig;

/**
 * Layout engine options
 */
export interface LayoutEngineOptions {
  enableCaching: boolean;
  enableOptimization: boolean;
  enableSmartSnapping: boolean;
  enableLayoutGuides: boolean;
  enableResizeHandles: boolean;
  enableDragAlignment: boolean;
  cacheSize: number;
  optimizationThreshold: number;
  maxCalculationTime: number;
}

/**
 * Layout context
 */
export interface LayoutContext {
  mode: LayoutMode;
  config: LayoutConfig;
  constraints: LayoutConstraints;
  spacing: SpacingConfig;
  alignment: AlignmentControlsConfig;
  snapping: SmartSnappingConfig;
  guides: LayoutGuidesConfig;
  resize: ResizeHandleConfig;
  drag: DragAlignmentConfig;
  responsive: ResponsiveLayoutConfig;
  parentBounds?: LayoutBounds;
  depth: number;
}

/**
 * Layout change event
 */
export interface LayoutChangeEvent {
  componentId: ComponentId;
  type: 'move' | 'resize' | 'reorder' | 'constraint' | 'mode';
  oldValue: LayoutMeasurement;
  newValue: LayoutMeasurement;
  timestamp: number;
}

/**
 * Layout engine state
 */
export interface LayoutEngineState {
  calculations: Map<ComponentId, LayoutCalculationResult>;
  cache: Map<string, LayoutCalculationResult>;
  warnings: LayoutWarning[];
  isCalculating: boolean;
  lastCalculationTime: number;
  totalCalculations: number;
}

/**
 * Layout metrics for performance monitoring
 */
export interface LayoutMetrics {
  calculationTime: number;
  componentCount: number;
  cacheHitRate: number;
  optimizationCount: number;
  warningCount: number;
}

/**
 * Extended style properties for layout
 */
export type LayoutStyleProperty =
  | StyleProperty
  | 'flexDirection'
  | 'flexWrap'
  | 'justifyContent'
  | 'alignItems'
  | 'alignContent'
  | 'gap'
  | 'rowGap'
  | 'columnGap'
  | 'gridTemplateColumns'
  | 'gridTemplateRows'
  | 'gridAutoFlow'
  | 'gridAutoColumns'
  | 'gridAutoRows'
  | 'gridTemplateAreas'
  | 'position'
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'
  | 'zIndex'
  | 'aspectRatio'
  | 'minWidth'
  | 'maxWidth'
  | 'minHeight'
  | 'maxHeight';
