/**
 * Core Layout Engine
 *
 * Main layout engine that handles all layout calculations including:
 * - Flexbox layouts
 * - CSS Grid layouts
 * - Absolute positioning
 * - Auto layout
 * - Constraints
 * - Responsive behavior
 * - Performance optimization
 */

import { ComponentNode, ComponentId } from '@wysiwyg/core';
import {
  LayoutMode,
  LayoutConfig,
  LayoutContext,
  LayoutCalculationResult,
  LayoutMeasurement,
  LayoutBounds,
  LayoutConstraints,
  LayoutEngineOptions,
  LayoutEngineState,
  LayoutMetrics,
  LayoutChangeEvent,
  LayoutWarning,
  FlexLayoutConfig,
  GridLayoutConfig,
  AbsoluteLayoutConfig,
  AutoLayoutConfig,
  JustifyContent,
  GridTrackSize,
} from '../types';

export class LayoutEngine {
  private state: LayoutEngineState;
  private options: Required<LayoutEngineOptions>;
  private eventListeners: Map<string, ((event: LayoutChangeEvent) => void)[]>;
  private calculationQueue: Set<ComponentId>;

  constructor(options: Partial<LayoutEngineOptions> = {}) {
    this.options = {
      enableCaching: options.enableCaching ?? true,
      enableOptimization: options.enableOptimization ?? true,
      enableSmartSnapping: options.enableSmartSnapping ?? true,
      enableLayoutGuides: options.enableLayoutGuides ?? true,
      enableResizeHandles: options.enableResizeHandles ?? true,
      enableDragAlignment: options.enableDragAlignment ?? true,
      cacheSize: options.cacheSize ?? 100,
      optimizationThreshold: options.optimizationThreshold ?? 50,
      maxCalculationTime: options.maxCalculationTime ?? 16, // 60fps target
    };

    this.state = {
      calculations: new Map(),
      cache: new Map(),
      warnings: [],
      isCalculating: false,
      lastCalculationTime: 0,
      totalCalculations: 0,
    };

    this.eventListeners = new Map();
    this.calculationQueue = new Set();
  }

  /**
   * Calculate layout for a component tree
   */
  calculateLayout(
    node: ComponentNode,
    context: LayoutContext,
    parentBounds?: LayoutBounds
  ): LayoutCalculationResult {
    const startTime = performance.now();

    // Check cache if enabled
    if (this.options.enableCaching) {
      const cacheKey = this.getCacheKey(node, context);
      const cached = this.state.cache.get(cacheKey);
      if (cached) {
        return cached;
      }
    }

    this.state.isCalculating = true;
    const measurements = new Map<ComponentId, LayoutMeasurement>();
    const bounds = new Map<ComponentId, LayoutBounds>();
    const constraints = new Map<ComponentId, LayoutConstraints>();
    const overflow = new Set<ComponentId>();
    const warnings: LayoutWarning[] = [];

    // Calculate layout for the node and its children
    this.calculateNodeLayout(
      node,
      context,
      parentBounds,
      measurements,
      bounds,
      constraints,
      overflow,
      warnings
    );

    // Create result
    const result: LayoutCalculationResult = {
      measurements,
      bounds,
      constraints,
      overflow,
      warnings,
    };

    // Update state
    this.state.calculations.set(node.id, result);
    this.state.warnings = warnings;
    this.state.lastCalculationTime = performance.now() - startTime;
    this.state.totalCalculations++;

    // Cache result if enabled
    if (this.options.enableCaching) {
      this.cacheResult(node, context, result);
    }

    this.state.isCalculating = false;
    return result;
  }

  /**
   * Calculate layout for a single node
   */
  private calculateNodeLayout(
    node: ComponentNode,
    context: LayoutContext,
    parentBounds: LayoutBounds | undefined,
    measurements: Map<ComponentId, LayoutMeasurement>,
    bounds: Map<ComponentId, LayoutBounds>,
    constraints: Map<ComponentId, LayoutConstraints>,
    overflow: Set<ComponentId>,
    warnings: LayoutWarning[]
  ): void {
    const nodeContext = this.createNodeContext(node, context, parentBounds);

    // Calculate based on layout mode
    switch (context.mode) {
      case 'flex':
        this.calculateFlexLayout(
          node,
          nodeContext,
          measurements,
          bounds,
          constraints,
          overflow,
          warnings
        );
        break;
      case 'grid':
        this.calculateGridLayout(
          node,
          nodeContext,
          measurements,
          bounds,
          constraints,
          overflow,
          warnings
        );
        break;
      case 'absolute':
        this.calculateAbsoluteLayout(
          node,
          nodeContext,
          measurements,
          bounds,
          constraints,
          overflow,
          warnings
        );
        break;
      case 'auto':
        this.calculateAutoLayout(
          node,
          nodeContext,
          measurements,
          bounds,
          constraints,
          overflow,
          warnings
        );
        break;
      case 'flow':
        this.calculateFlowLayout(
          node,
          nodeContext,
          measurements,
          bounds,
          constraints,
          overflow,
          warnings
        );
        break;
    }

    // Calculate children recursively
    const nodeBounds = bounds.get(node.id);
    if (nodeBounds && node.children.length > 0) {
      for (const child of node.children) {
        const childContext = {
          ...context,
          parentBounds: nodeBounds,
          depth: context.depth + 1,
        };
        this.calculateNodeLayout(
          child,
          childContext,
          nodeBounds,
          measurements,
          bounds,
          constraints,
          overflow,
          warnings
        );
      }
    }
  }

  /**
   * Calculate flexbox layout
   */
  private calculateFlexLayout(
    node: ComponentNode,
    context: LayoutContext,
    measurements: Map<ComponentId, LayoutMeasurement>,
    bounds: Map<ComponentId, LayoutBounds>,
    constraints: Map<ComponentId, LayoutConstraints>,
    overflow: Set<ComponentId>,
    warnings: LayoutWarning[]
  ): void {
    const config = context.config as FlexLayoutConfig;
    const parentBounds = context.parentBounds || { x: 0, y: 0, width: 0, height: 0 };

    // Calculate node measurement
    const measurement = this.calculateMeasurement(node, context, parentBounds);
    measurements.set(node.id, measurement);

    // Calculate bounds
    const nodeBounds: LayoutBounds = {
      x: parentBounds.x + measurement.left,
      y: parentBounds.y + measurement.top,
      width: measurement.width,
      height: measurement.height,
    };
    bounds.set(node.id, nodeBounds);

    // Calculate constraints
    const nodeConstraints = this.calculateConstraints(node, context);
    constraints.set(node.id, nodeConstraints);

    // Calculate children layout
    if (node.children.length > 0) {
      this.calculateFlexChildren(
        node.children,
        config,
        nodeBounds,
        measurements,
        bounds,
        constraints,
        overflow,
        warnings
      );
    }
  }

  /**
   * Calculate flex children layout
   */
  private calculateFlexChildren(
    children: ComponentNode[],
    config: FlexLayoutConfig,
    parentBounds: LayoutBounds,
    measurements: Map<ComponentId, LayoutMeasurement>,
    bounds: Map<ComponentId, LayoutBounds>,
    constraints: Map<ComponentId, LayoutConstraints>,
    overflow: Set<ComponentId>,
    warnings: LayoutWarning[]
  ): void {
    const isRow = config.direction === 'row' || config.direction === 'row-reverse';
    const isReverse = config.direction === 'row-reverse' || config.direction === 'column-reverse';

    let currentPos = 0;
    let crossPos = 0;
    let maxCrossSize = 0;

    const gap = config.gap || 0;
    const rowGap = config.rowGap ?? gap;
    const columnGap = config.columnGap ?? gap;

    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      const childIndex = isReverse ? children.length - 1 - i : i;

      // Calculate child measurement
      const childMeasurement: LayoutMeasurement = {
        width: isRow ? this.calculateChildWidth(child, parentBounds) : parentBounds.width,
        height: isRow ? parentBounds.height : this.calculateChildHeight(child, parentBounds),
        top: isRow ? 0 : currentPos,
        left: isRow ? currentPos : 0,
        right: 0,
        bottom: 0,
      };

      measurements.set(child.id, childMeasurement);

      // Apply alignment
      if (config.alignItems === 'center') {
        childMeasurement.top = (parentBounds.height - childMeasurement.height) / 2;
        childMeasurement.left = (parentBounds.width - childMeasurement.width) / 2;
      } else if (config.alignItems === 'flex-end') {
        childMeasurement.top = parentBounds.height - childMeasurement.height;
        childMeasurement.left = parentBounds.width - childMeasurement.width;
      }

      // Calculate bounds
      const childBounds: LayoutBounds = {
        x: parentBounds.x + childMeasurement.left,
        y: parentBounds.y + childMeasurement.top,
        width: childMeasurement.width,
        height: childMeasurement.height,
      };
      bounds.set(child.id, childBounds);

      // Update position
      if (isRow) {
        currentPos += childMeasurement.width + columnGap;
        maxCrossSize = Math.max(maxCrossSize, childMeasurement.height);
      } else {
        currentPos += childMeasurement.height + rowGap;
        maxCrossSize = Math.max(maxCrossSize, childMeasurement.width);
      }

      // Check for overflow
      if (isRow && currentPos > parentBounds.width) {
        overflow.add(child.id);
      } else if (!isRow && currentPos > parentBounds.height) {
        overflow.add(child.id);
      }
    }

    // Apply justify content
    if (config.justifyContent !== 'flex-start') {
      this.applyJustifyContent(children, config.justifyContent, parentBounds, measurements, bounds);
    }
  }

  /**
   * Calculate CSS Grid layout
   */
  private calculateGridLayout(
    node: ComponentNode,
    context: LayoutContext,
    measurements: Map<ComponentId, LayoutMeasurement>,
    bounds: Map<ComponentId, LayoutBounds>,
    constraints: Map<ComponentId, LayoutConstraints>,
    overflow: Set<ComponentId>,
    warnings: LayoutWarning[]
  ): void {
    const config = context.config as GridLayoutConfig;
    const parentBounds = context.parentBounds || { x: 0, y: 0, width: 0, height: 0 };

    // Calculate node measurement
    const measurement = this.calculateMeasurement(node, context, parentBounds);
    measurements.set(node.id, measurement);

    // Calculate bounds
    const nodeBounds: LayoutBounds = {
      x: parentBounds.x + measurement.left,
      y: parentBounds.y + measurement.top,
      width: measurement.width,
      height: measurement.height,
    };
    bounds.set(node.id, nodeBounds);

    // Calculate constraints
    const nodeConstraints = this.calculateConstraints(node, context);
    constraints.set(node.id, nodeConstraints);

    // Calculate grid tracks
    const columnWidths = this.calculateGridTracks(
      config.columns,
      nodeBounds.width,
      config.columnGap || 0
    );
    const rowHeights = this.calculateGridTracks(config.rows, nodeBounds.height, config.rowGap || 0);

    // Calculate children layout
    if (node.children.length > 0) {
      this.calculateGridChildren(
        node.children,
        config,
        columnWidths,
        rowHeights,
        nodeBounds,
        measurements,
        bounds,
        constraints,
        overflow,
        warnings
      );
    }
  }

  /**
   * Calculate grid children layout
   */
  private calculateGridChildren(
    children: ComponentNode[],
    config: GridLayoutConfig,
    columnWidths: number[],
    rowHeights: number[],
    parentBounds: LayoutBounds,
    measurements: Map<ComponentId, LayoutMeasurement>,
    bounds: Map<ComponentId, LayoutBounds>,
    constraints: Map<ComponentId, LayoutConstraints>,
    overflow: Set<ComponentId>,
    warnings: LayoutWarning[]
  ): void {
    const columnGap = config.columnGap || 0;
    const rowGap = config.rowGap || 0;

    let currentX = 0;
    let currentY = 0;
    let columnIndex = 0;
    let rowIndex = 0;

    for (const child of children) {
      // Get grid position from styles
      const gridColumn = (child.styles.gridColumn as number) || columnIndex + 1;
      const gridRow = (child.styles.gridRow as number) || rowIndex + 1;

      // Calculate position
      const xPos =
        columnWidths.slice(0, gridColumn - 1).reduce((sum, w) => sum + w, 0) +
        (gridColumn - 1) * columnGap;
      const yPos =
        rowHeights.slice(0, gridRow - 1).reduce((sum, h) => sum + h, 0) + (gridRow - 1) * rowGap;

      // Get span
      const columnSpan = (child.styles.gridColumnEnd as number) - gridColumn || 1;
      const rowSpan = (child.styles.gridRowEnd as number) - gridRow || 1;

      // Calculate size
      const width =
        columnWidths
          .slice(gridColumn - 1, gridColumn - 1 + columnSpan)
          .reduce((sum, w) => sum + w, 0) +
        (columnSpan - 1) * columnGap;
      const height =
        rowHeights.slice(gridRow - 1, gridRow - 1 + rowSpan).reduce((sum, h) => sum + h, 0) +
        (rowSpan - 1) * rowGap;

      // Create measurement
      const measurement: LayoutMeasurement = {
        width,
        height,
        top: yPos,
        left: xPos,
        right: 0,
        bottom: 0,
      };

      measurements.set(child.id, measurement);

      // Create bounds
      const childBounds: LayoutBounds = {
        x: parentBounds.x + xPos,
        y: parentBounds.y + yPos,
        width,
        height,
      };
      bounds.set(child.id, childBounds);

      // Check for overflow
      if (xPos + width > parentBounds.width || yPos + height > parentBounds.height) {
        overflow.add(child.id);
      }

      // Update position
      columnIndex += columnSpan;
      if (columnIndex >= columnWidths.length) {
        columnIndex = 0;
        rowIndex += rowSpan;
      }
    }
  }

  /**
   * Calculate absolute positioning layout
   */
  private calculateAbsoluteLayout(
    node: ComponentNode,
    context: LayoutContext,
    measurements: Map<ComponentId, LayoutMeasurement>,
    bounds: Map<ComponentId, LayoutBounds>,
    constraints: Map<ComponentId, LayoutConstraints>,
    overflow: Set<ComponentId>,
    warnings: LayoutWarning[]
  ): void {
    const config = context.config as AbsoluteLayoutConfig;
    const parentBounds = context.parentBounds || { x: 0, y: 0, width: 0, height: 0 };

    // Calculate node measurement
    const measurement = this.calculateMeasurement(node, context, parentBounds);
    measurements.set(node.id, measurement);

    // Calculate bounds based on absolute positioning
    const nodeBounds: LayoutBounds = {
      x: parentBounds.x + (config.left !== undefined ? config.left : 0),
      y: parentBounds.y + (config.top !== undefined ? config.top : 0),
      width: measurement.width,
      height: measurement.height,
    };
    bounds.set(node.id, nodeBounds);

    // Calculate constraints
    const nodeConstraints = this.calculateConstraints(node, context);
    constraints.set(node.id, nodeConstraints);

    // Calculate children layout
    if (node.children.length > 0) {
      this.calculateAbsoluteChildren(
        node.children,
        config,
        nodeBounds,
        measurements,
        bounds,
        constraints,
        overflow,
        warnings
      );
    }
  }

  /**
   * Calculate absolute children layout
   */
  private calculateAbsoluteChildren(
    children: ComponentNode[],
    config: AbsoluteLayoutConfig,
    parentBounds: LayoutBounds,
    measurements: Map<ComponentId, LayoutMeasurement>,
    bounds: Map<ComponentId, LayoutBounds>,
    constraints: Map<ComponentId, LayoutConstraints>,
    overflow: Set<ComponentId>,
    warnings: LayoutWarning[]
  ): void {
    for (const child of children) {
      const childConfig =
        child.styles.position === 'absolute'
          ? {
              position: 'absolute' as const,
              top: child.styles.top as number | undefined,
              right: child.styles.right as number | undefined,
              bottom: child.styles.bottom as number | undefined,
              left: child.styles.left as number | undefined,
              zIndex: child.styles.zIndex as number | undefined,
            }
          : config;

      // Calculate position
      const left = childConfig.left !== undefined ? childConfig.left : 0;
      const top = childConfig.top !== undefined ? childConfig.top : 0;

      // Calculate size
      const width = this.calculateChildWidth(child, parentBounds);
      const height = this.calculateChildHeight(child, parentBounds);

      // Create measurement
      const measurement: LayoutMeasurement = {
        width,
        height,
        top,
        left,
        right: 0,
        bottom: 0,
      };

      measurements.set(child.id, measurement);

      // Create bounds
      const childBounds: LayoutBounds = {
        x: parentBounds.x + left,
        y: parentBounds.y + top,
        width,
        height,
      };
      bounds.set(child.id, childBounds);

      // Check for overflow
      if (left + width > parentBounds.width || top + height > parentBounds.height) {
        overflow.add(child.id);
      }
    }
  }

  /**
   * Calculate auto layout
   */
  private calculateAutoLayout(
    node: ComponentNode,
    context: LayoutContext,
    measurements: Map<ComponentId, LayoutMeasurement>,
    bounds: Map<ComponentId, LayoutBounds>,
    constraints: Map<ComponentId, LayoutConstraints>,
    overflow: Set<ComponentId>,
    warnings: LayoutWarning[]
  ): void {
    const config = context.config as AutoLayoutConfig;
    const parentBounds = context.parentBounds || { x: 0, y: 0, width: 0, height: 0 };

    // Calculate node measurement
    const measurement = this.calculateMeasurement(node, context, parentBounds);
    measurements.set(node.id, measurement);

    // Calculate bounds
    const nodeBounds: LayoutBounds = {
      x: parentBounds.x + measurement.left,
      y: parentBounds.y + measurement.top,
      width: measurement.width,
      height: measurement.height,
    };
    bounds.set(node.id, nodeBounds);

    // Calculate constraints
    const nodeConstraints = this.calculateConstraints(node, context);
    constraints.set(node.id, nodeConstraints);

    // Calculate children layout
    if (node.children.length > 0) {
      this.calculateAutoChildren(
        node.children,
        config,
        nodeBounds,
        measurements,
        bounds,
        constraints,
        overflow,
        warnings
      );
    }
  }

  /**
   * Calculate auto children layout
   */
  private calculateAutoChildren(
    children: ComponentNode[],
    config: AutoLayoutConfig,
    parentBounds: LayoutBounds,
    measurements: Map<ComponentId, LayoutMeasurement>,
    bounds: Map<ComponentId, LayoutBounds>,
    constraints: Map<ComponentId, LayoutConstraints>,
    overflow: Set<ComponentId>,
    warnings: LayoutWarning[]
  ): void {
    const isRow = config.direction === 'row' || config.direction === 'row-reverse';
    const isReverse = config.direction === 'row-reverse' || config.direction === 'column-reverse';

    let currentPos = 0;
    const gap = config.gap || 0;
    const padding = config.padding;

    // Calculate content area
    const contentWidth = parentBounds.width - padding.left - padding.right;
    const contentHeight = parentBounds.height - padding.top - padding.bottom;

    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      const childIndex = isReverse ? children.length - 1 - i : i;

      // Calculate child size based on sizing mode
      let childWidth: number;
      let childHeight: number;

      if (config.sizing.width === 'fill') {
        childWidth = isRow
          ? (contentWidth - (children.length - 1) * gap) / children.length
          : contentWidth;
      } else if (config.sizing.width === 'fit') {
        childWidth = this.calculateChildWidth(child, {
          x: 0,
          y: 0,
          width: contentWidth,
          height: contentHeight,
        });
      } else {
        childWidth = this.calculateChildWidth(child, {
          x: 0,
          y: 0,
          width: contentWidth,
          height: contentHeight,
        });
      }

      if (config.sizing.height === 'fill') {
        childHeight = isRow
          ? contentHeight
          : (contentHeight - (children.length - 1) * gap) / children.length;
      } else if (config.sizing.height === 'fit') {
        childHeight = this.calculateChildHeight(child, {
          x: 0,
          y: 0,
          width: contentWidth,
          height: contentHeight,
        });
      } else {
        childHeight = this.calculateChildHeight(child, {
          x: 0,
          y: 0,
          width: contentWidth,
          height: contentHeight,
        });
      }

      // Calculate position
      const xPos = isRow ? currentPos + padding.left : padding.left;
      const yPos = isRow ? padding.top : currentPos + padding.top;

      // Create measurement
      const measurement: LayoutMeasurement = {
        width: childWidth,
        height: childHeight,
        top: yPos,
        left: xPos,
        right: 0,
        bottom: 0,
      };

      measurements.set(child.id, measurement);

      // Create bounds
      const childBounds: LayoutBounds = {
        x: parentBounds.x + xPos,
        y: parentBounds.y + yPos,
        width: childWidth,
        height: childHeight,
      };
      bounds.set(child.id, childBounds);

      // Update position
      if (isRow) {
        currentPos += childWidth + gap;
      } else {
        currentPos += childHeight + gap;
      }

      // Check for overflow
      if (isRow && currentPos > contentWidth) {
        overflow.add(child.id);
      } else if (!isRow && currentPos > contentHeight) {
        overflow.add(child.id);
      }
    }
  }

  /**
   * Calculate flow layout (default block layout)
   */
  private calculateFlowLayout(
    node: ComponentNode,
    context: LayoutContext,
    measurements: Map<ComponentId, LayoutMeasurement>,
    bounds: Map<ComponentId, LayoutBounds>,
    constraints: Map<ComponentId, LayoutConstraints>,
    overflow: Set<ComponentId>,
    warnings: LayoutWarning[]
  ): void {
    const parentBounds = context.parentBounds || { x: 0, y: 0, width: 0, height: 0 };

    // Calculate node measurement
    const measurement = this.calculateMeasurement(node, context, parentBounds);
    measurements.set(node.id, measurement);

    // Calculate bounds
    const nodeBounds: LayoutBounds = {
      x: parentBounds.x + measurement.left,
      y: parentBounds.y + measurement.top,
      width: measurement.width,
      height: measurement.height,
    };
    bounds.set(node.id, nodeBounds);

    // Calculate constraints
    const nodeConstraints = this.calculateConstraints(node, context);
    constraints.set(node.id, nodeConstraints);

    // Calculate children layout
    if (node.children.length > 0) {
      this.calculateFlowChildren(
        node.children,
        nodeBounds,
        measurements,
        bounds,
        constraints,
        overflow,
        warnings
      );
    }
  }

  /**
   * Calculate flow children layout
   */
  private calculateFlowChildren(
    children: ComponentNode[],
    parentBounds: LayoutBounds,
    measurements: Map<ComponentId, LayoutMeasurement>,
    bounds: Map<ComponentId, LayoutBounds>,
    constraints: Map<ComponentId, LayoutConstraints>,
    overflow: Set<ComponentId>,
    warnings: LayoutWarning[]
  ): void {
    let currentY = 0;
    let maxWidth = 0;

    for (const child of children) {
      // Calculate child size
      const width = this.calculateChildWidth(child, parentBounds);
      const height = this.calculateChildHeight(child, parentBounds);

      // Create measurement
      const measurement: LayoutMeasurement = {
        width,
        height,
        top: currentY,
        left: 0,
        right: 0,
        bottom: 0,
      };

      measurements.set(child.id, measurement);

      // Create bounds
      const childBounds: LayoutBounds = {
        x: parentBounds.x,
        y: parentBounds.y + currentY,
        width,
        height,
      };
      bounds.set(child.id, childBounds);

      // Update position
      currentY += height;
      maxWidth = Math.max(maxWidth, width);

      // Check for overflow
      if (currentY > parentBounds.height) {
        overflow.add(child.id);
      }
    }

    // Update parent bounds if needed
    if (maxWidth > parentBounds.width) {
      overflow.add(parentBounds.x.toString());
    }
  }

  /**
   * Helper methods
   */

  private calculateMeasurement(
    node: ComponentNode,
    context: LayoutContext,
    parentBounds: LayoutBounds
  ): LayoutMeasurement {
    const styles = node.styles;
    return {
      width: this.parseSize(styles.width as string | number, parentBounds.width),
      height: this.parseSize(styles.height as string | number, parentBounds.height),
      top: this.parseSize(styles.top as string | number, parentBounds.height),
      left: this.parseSize(styles.left as string | number, parentBounds.width),
      right: this.parseSize(styles.right as string | number, parentBounds.width),
      bottom: this.parseSize(styles.bottom as string | number, parentBounds.height),
      marginTop: this.parseSize(styles.marginTop as string | number, 0),
      marginBottom: this.parseSize(styles.marginBottom as string | number, 0),
      marginLeft: this.parseSize(styles.marginLeft as string | number, 0),
      marginRight: this.parseSize(styles.marginRight as string | number, 0),
      paddingTop: this.parseSize(styles.paddingTop as string | number, 0),
      paddingBottom: this.parseSize(styles.paddingBottom as string | number, 0),
      paddingLeft: this.parseSize(styles.paddingLeft as string | number, 0),
      paddingRight: this.parseSize(styles.paddingRight as string | number, 0),
    };
  }

  private calculateConstraints(node: ComponentNode, context: LayoutContext): LayoutConstraints {
    const styles = node.styles;
    return {
      minWidth: this.parseSize(styles.minWidth as string | number, 0),
      maxWidth: this.parseSize(styles.maxWidth as string | number, Infinity),
      minHeight: this.parseSize(styles.minHeight as string | number, 0),
      maxHeight: this.parseSize(styles.maxHeight as string | number, Infinity),
      aspectRatio: styles.aspectRatio as number,
      maintainAspectRatio: styles.aspectRatio !== undefined,
    };
  }

  private calculateChildWidth(child: ComponentNode, parentBounds: LayoutBounds): number {
    const width = child.styles.width as string | number | undefined;
    if (width === undefined) {
      return parentBounds.width;
    }
    return this.parseSize(width, parentBounds.width);
  }

  private calculateChildHeight(child: ComponentNode, parentBounds: LayoutBounds): number {
    const height = child.styles.height as string | number | undefined;
    if (height === undefined) {
      return parentBounds.height;
    }
    return this.parseSize(height, parentBounds.height);
  }

  private parseSize(value: string | number | undefined, reference: number): number {
    if (value === undefined || value === 'auto') {
      return reference;
    }
    if (typeof value === 'number') {
      return value;
    }
    if (typeof value === 'string') {
      if (value.endsWith('%')) {
        return (parseFloat(value) / 100) * reference;
      }
      if (value.endsWith('px')) {
        return parseFloat(value);
      }
      return parseFloat(value);
    }
    return reference;
  }

  private calculateGridTracks(
    tracks: GridTrackSize[],
    availableSpace: number,
    gap: number
  ): number[] {
    const totalGap = (tracks.length - 1) * gap;
    const remainingSpace = availableSpace - totalGap;

    return tracks.map((track) => {
      if (typeof track === 'number') {
        return track;
      }
      if (track === 'auto' || track === 'min-content' || track === 'max-content') {
        return remainingSpace / tracks.length;
      }
      if (typeof track === 'string' && track.endsWith('%')) {
        return (parseFloat(track) / 100) * remainingSpace;
      }
      if (typeof track === 'string' && track.startsWith('fit-content')) {
        const match = track.match(/fit-content\((.+)\)/);
        if (match) {
          const max = parseFloat(match[1]);
          return Math.min(remainingSpace / tracks.length, max);
        }
        return remainingSpace / tracks.length;
      }
      return remainingSpace / tracks.length;
    });
  }

  private applyJustifyContent(
    children: ComponentNode[],
    justifyContent: JustifyContent,
    parentBounds: LayoutBounds,
    measurements: Map<ComponentId, LayoutMeasurement>,
    bounds: Map<ComponentId, LayoutBounds>
  ): void {
    const totalWidth = Array.from(measurements.values()).reduce((sum, m) => sum + m.width, 0);

    const remainingSpace = parentBounds.width - totalWidth;

    children.forEach((child, index) => {
      const measurement = measurements.get(child.id);
      if (!measurement) return;

      let offset = 0;

      switch (justifyContent) {
        case 'center':
          offset = remainingSpace / 2;
          break;
        case 'flex-end':
          offset = remainingSpace;
          break;
        case 'space-between':
          offset = index * (remainingSpace / (children.length - 1 || 1));
          break;
        case 'space-around':
          offset =
            (index * remainingSpace) / children.length + remainingSpace / children.length / 2;
          break;
        case 'space-evenly':
          offset =
            (index * remainingSpace) / (children.length + 1) +
            remainingSpace / (children.length + 1);
          break;
      }

      measurement.left += offset;

      const childBounds = bounds.get(child.id);
      if (childBounds) {
        childBounds.x += offset;
      }
    });
  }

  private createNodeContext(
    node: ComponentNode,
    context: LayoutContext,
    parentBounds: LayoutBounds | undefined
  ): LayoutContext {
    return {
      ...context,
      parentBounds,
      depth: context.depth + 1,
    };
  }

  private getCacheKey(node: ComponentNode, context: LayoutContext): string {
    return `${node.id}-${context.mode}-${context.depth}-${JSON.stringify(node.styles)}`;
  }

  private cacheResult(
    node: ComponentNode,
    context: LayoutContext,
    result: LayoutCalculationResult
  ): void {
    const cacheKey = this.getCacheKey(node, context);

    // Remove oldest entry if cache is full
    if (this.state.cache.size >= this.options.cacheSize) {
      const firstKey = this.state.cache.keys().next().value;
      this.state.cache.delete(firstKey);
    }

    this.state.cache.set(cacheKey, result);
  }

  /**
   * Public API methods
   */

  /**
   * Subscribe to layout change events
   */
  on(event: 'layoutChange', callback: (event: LayoutChangeEvent) => void): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  /**
   * Unsubscribe from layout change events
   */
  off(event: 'layoutChange', callback: (event: LayoutChangeEvent) => void): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  /**
   * Emit a layout change event
   */
  private emit(event: 'layoutChange', data: LayoutChangeEvent): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach((callback) => callback(data));
    }
  }

  /**
   * Get layout metrics
   */
  getMetrics(): LayoutMetrics {
    return {
      calculationTime: this.state.lastCalculationTime,
      componentCount: this.state.calculations.size,
      cacheHitRate:
        this.state.cache.size > 0 ? this.state.totalCalculations / this.state.cache.size : 0,
      optimizationCount: 0, // TODO: Implement optimization tracking
      warningCount: this.state.warnings.length,
    };
  }

  /**
   * Clear the layout cache
   */
  clearCache(): void {
    this.state.cache.clear();
  }

  /**
   * Update engine options
   */
  updateOptions(options: Partial<LayoutEngineOptions>): void {
    this.options = { ...this.options, ...options };

    // Clear cache if caching is disabled
    if (!this.options.enableCaching) {
      this.clearCache();
    }
  }

  /**
   * Get engine options
   */
  getOptions(): Required<LayoutEngineOptions> {
    return { ...this.options };
  }

  /**
   * Get layout calculation result for a component
   */
  getLayoutResult(componentId: ComponentId): LayoutCalculationResult | undefined {
    return this.state.calculations.get(componentId);
  }

  /**
   * Get all layout warnings
   */
  getWarnings(): LayoutWarning[] {
    return [...this.state.warnings];
  }

  /**
   * Invalidate layout cache for a component
   */
  invalidateCache(componentId: ComponentId): void {
    const keysToDelete: string[] = [];

    for (const key of this.state.cache.keys()) {
      if (key.startsWith(componentId)) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach((key) => this.state.cache.delete(key));
  }

  /**
   * Reset the engine state
   */
  reset(): void {
    this.state.calculations.clear();
    this.state.cache.clear();
    this.state.warnings = [];
    this.state.isCalculating = false;
    this.state.lastCalculationTime = 0;
    this.state.totalCalculations = 0;
    this.calculationQueue.clear();
  }
}
