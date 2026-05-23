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
      const x = this.calculateGridPosition(gridColumn, columnWidths, columnGap);
      const y = this.calculateGridPosition(gridRow, rowHeights, rowGap);

      // Calculate size
      const width = this.calculateGridSpan(child, columnWidths, columnGap, 'column');
      const height = this.calculateGridSpan(child, rowHeights, rowGap, 'row');

      // Create measurement
      const childMeasurement: LayoutMeasurement = {
        width,
        height,
        top: y,
        left: x,
        right: 0,
        bottom: 0,
      };

      measurements.set(child.id, childMeasurement);

      // Create bounds
      const childBounds: LayoutBounds = {
        x: parentBounds.x + x,
        y: parentBounds.y + y,
        width,
        height,
      };
      bounds.set(child.id, childBounds);

      // Update position for next item
      columnIndex++;
      if (columnIndex >= columnWidths.length) {
        columnIndex = 0;
        rowIndex++;
      }

      // Check for overflow
      if (x + width > parentBounds.width || y + height > parentBounds.height) {
        overflow.add(child.id);
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
   * Calculate absolute positioned children
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
      const position = (child.styles.position as PositionType) || 'absolute';

      // Calculate position based on position properties
      let x = 0;
      let y = 0;
      let width = this.calculateChildWidth(child, parentBounds);
      let height = this.calculateChildHeight(child, parentBounds);

      if (position === 'absolute' || position === 'fixed') {
        x = this.parsePositionValue(child.styles.left, parentBounds.width);
        y = this.parsePositionValue(child.styles.top, parentBounds.height);

        // Handle right and bottom
        if (child.styles.right !== undefined) {
          x =
            parentBounds.width -
            width -
            this.parsePositionValue(child.styles.right, parentBounds.width);
        }
        if (child.styles.bottom !== undefined) {
          y =
            parentBounds.height -
            height -
            this.parsePositionValue(child.styles.bottom, parentBounds.height);
        }
      }

      // Create measurement
      const childMeasurement: LayoutMeasurement = {
        width,
        height,
        top: y,
        left: x,
        right: 0,
        bottom: 0,
      };

      measurements.set(child.id, childMeasurement);

      // Create bounds
      const childBounds: LayoutBounds = {
        x: parentBounds.x + x,
        y: parentBounds.y + y,
        width,
        height,
      };
      bounds.set(child.id, childBounds);

      // Check for overflow
      if (x < 0 || y < 0 || x + width > parentBounds.width || y + height > parentBounds.height) {
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
   * Calculate auto layout children
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
    const { padding, gap, itemSpacing, alignment, sizing } = config;

    let currentPos = isRow ? padding.left : padding.top;
    const startPos = currentPos;
    const contentSize = isRow
      ? parentBounds.width - padding.left - padding.right
      : parentBounds.height - padding.top - padding.bottom;

    for (const child of children) {
      // Calculate child size
      const childWidth = isRow
        ? this.calculateChildSize(child, contentSize, sizing.width)
        : parentBounds.width - padding.left - padding.right;

      const childHeight = isRow
        ? parentBounds.height - padding.top - padding.bottom
        : this.calculateChildSize(child, contentSize, sizing.height);

      // Calculate child position
      const childX = isRow ? currentPos : padding.left;
      const childY = isRow ? padding.top : currentPos;

      // Apply alignment
      let alignedX = childX;
      let alignedY = childY;

      if (!isRow) {
        switch (alignment.horizontal) {
          case 'center':
            alignedX =
              padding.left + (parentBounds.width - padding.left - padding.right - childWidth) / 2;
            break;
          case 'flex-end':
            alignedX = parentBounds.width - padding.right - childWidth;
            break;
        }
      } else {
        switch (alignment.vertical) {
          case 'center':
            alignedY =
              padding.top + (parentBounds.height - padding.top - padding.bottom - childHeight) / 2;
            break;
          case 'flex-end':
            alignedY = parentBounds.height - padding.bottom - childHeight;
            break;
        }
      }

      // Create measurement
      const childMeasurement: LayoutMeasurement = {
        width: childWidth,
        height: childHeight,
        top: alignedY,
        left: alignedX,
        right: 0,
        bottom: 0,
      };

      measurements.set(child.id, childMeasurement);

      // Create bounds
      const childBounds: LayoutBounds = {
        x: parentBounds.x + alignedX,
        y: parentBounds.y + alignedY,
        width: childWidth,
        height: childHeight,
      };
      bounds.set(child.id, childBounds);

      // Update position
      currentPos += (isRow ? childWidth : childHeight) + itemSpacing;
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
   * Calculate flow layout children
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

    for (const child of children) {
      const childWidth = this.calculateChildWidth(child, parentBounds);
      const childHeight = this.calculateChildHeight(child, parentBounds);

      // Create measurement
      const childMeasurement: LayoutMeasurement = {
        width: childWidth,
        height: childHeight,
        top: currentY,
        left: 0,
        right: 0,
        bottom: 0,
      };

      measurements.set(child.id, childMeasurement);

      // Create bounds
      const childBounds: LayoutBounds = {
        x: parentBounds.x,
        y: parentBounds.y + currentY,
        width: childWidth,
        height: childHeight,
      };
      bounds.set(child.id, childBounds);

      // Update position
      currentY += childHeight;

      // Check for overflow
      if (currentY > parentBounds.height) {
        overflow.add(child.id);
      }
    }
  }

  /**
   * Helper methods
   */
  private createNodeContext(
    node: ComponentNode,
    context: LayoutContext,
    parentBounds?: LayoutBounds
  ): LayoutContext {
    return {
      ...context,
      parentBounds,
      depth: context.depth + 1,
    };
  }

  private calculateMeasurement(
    node: ComponentNode,
    context: LayoutContext,
    parentBounds: LayoutBounds
  ): LayoutMeasurement {
    const width = this.parseSizeValue(node.styles.width, parentBounds.width);
    const height = this.parseSizeValue(node.styles.height, parentBounds.height);

    return {
      width,
      height,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      marginTop: this.parseSpacingValue(node.styles.marginTop),
      marginBottom: this.parseSpacingValue(node.styles.marginBottom),
      marginLeft: this.parseSpacingValue(node.styles.marginLeft),
      marginRight: this.parseSpacingValue(node.styles.marginRight),
      paddingTop: this.parseSpacingValue(node.styles.paddingTop),
      paddingBottom: this.parseSpacingValue(node.styles.paddingBottom),
      paddingLeft: this.parseSpacingValue(node.styles.paddingLeft),
      paddingRight: this.parseSpacingValue(node.styles.paddingRight),
    };
  }

  private calculateConstraints(node: ComponentNode, context: LayoutContext): LayoutConstraints {
    return {
      minWidth: this.parseSizeValue(node.styles.minWidth),
      maxWidth: this.parseSizeValue(node.styles.maxWidth),
      minHeight: this.parseSizeValue(node.styles.minHeight),
      maxHeight: this.parseSizeValue(node.styles.maxHeight),
      aspectRatio: node.styles.aspectRatio as number,
      maintainAspectRatio: node.styles.maintainAspectRatio as boolean,
    };
  }

  private calculateChildWidth(child: ComponentNode, parentBounds: LayoutBounds): number {
    const width = child.styles.width;
    if (typeof width === 'string' && width.includes('%')) {
      return parentBounds.width * (parseFloat(width) / 100);
    }
    return this.parseSizeValue(width, parentBounds.width);
  }

  private calculateChildHeight(child: ComponentNode, parentBounds: LayoutBounds): number {
    const height = child.styles.height;
    if (typeof height === 'string' && height.includes('%')) {
      return parentBounds.height * (parseFloat(height) / 100);
    }
    return this.parseSizeValue(height, parentBounds.height);
  }

  private calculateChildSize(
    child: ComponentNode,
    parentSize: number,
    sizingMode: 'fill' | 'fit' | 'fixed'
  ): number {
    const size =
      sizingMode === 'fill'
        ? parentSize
        : sizingMode === 'fit'
          ? Math.min(this.parseSizeValue(child.styles.width, parentSize), parentSize)
          : this.parseSizeValue(child.styles.width, parentSize);
    return Math.max(0, size);
  }

  private calculateGridTracks(
    tracks: GridTrackSize[],
    containerSize: number,
    gap: number
  ): number[] {
    const totalGap = gap * (tracks.length - 1);
    const availableSize = containerSize - totalGap;
    const flexibleTracks = tracks.filter((t) => t === 'auto' || t === 'fit-content');
    const fixedTracks = tracks.filter(
      (t) => typeof t === 'number' || (typeof t === 'string' && !isNaN(parseFloat(t)))
    );

    const fixedSize = fixedTracks.reduce(
      (sum, t) => sum + (typeof t === 'number' ? t : parseFloat(t)),
      0
    );
    const flexibleSize = availableSize - fixedSize;
    const flexibleTrackSize = flexibleTracks.length > 0 ? flexibleSize / flexibleTracks.length : 0;

    return tracks.map((track) => {
      if (track === 'auto' || track === 'fit-content') {
        return flexibleTrackSize;
      }
      if (typeof track === 'number') {
        return track;
      }
      if (typeof track === 'string') {
        const parsed = parseFloat(track);
        return isNaN(parsed) ? flexibleTrackSize : parsed;
      }
      return flexibleTrackSize;
    });
  }

  private calculateGridPosition(line: number, tracks: number[], gap: number): number {
    let position = 0;
    for (let i = 0; i < line - 1 && i < tracks.length; i++) {
      position += tracks[i] + gap;
    }
    return position;
  }

  private calculateGridSpan(
    child: ComponentNode,
    tracks: number[],
    gap: number,
    direction: 'column' | 'row'
  ): number {
    const span =
      (child.styles[`grid${direction === 'column' ? 'Column' : 'Row'}End`] as number) || 1;
    const start =
      (child.styles[`grid${direction === 'column' ? 'Column' : 'Row'}Start`] as number) || 1;
    const end = Math.min(start + span - 1, tracks.length);

    let size = 0;
    for (let i = start - 1; i < end && i < tracks.length; i++) {
      size += tracks[i];
      if (i < end - 1) {
        size += gap;
      }
    }
    return size;
  }

  private applyJustifyContent(
    children: ComponentNode[],
    justifyContent: JustifyContent,
    parentBounds: LayoutBounds,
    measurements: Map<ComponentId, LayoutMeasurement>,
    bounds: Map<ComponentId, LayoutBounds>
  ): void {
    const totalWidth = Array.from(bounds.values()).reduce((sum, b) => sum + b.width, 0);
    const availableSpace = parentBounds.width - totalWidth;

    let offset = 0;
    switch (justifyContent) {
      case 'center':
        offset = availableSpace / 2;
        break;
      case 'flex-end':
        offset = availableSpace;
        break;
      case 'space-between':
        // Handled in calculateFlexChildren
        return;
      case 'space-around':
        offset = availableSpace / (children.length * 2);
        break;
      case 'space-evenly':
        offset = availableSpace / (children.length + 1);
        break;
    }

    for (const child of children) {
      const measurement = measurements.get(child.id);
      const bound = bounds.get(child.id);
      if (measurement && bound) {
        measurement.left += offset;
        bound.x += offset;
      }
    }
  }

  private parseSizeValue(value: any, defaultValue: number = 0): number {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      if (value.endsWith('px')) return parseFloat(value);
      if (value.endsWith('%')) return defaultValue * (parseFloat(value) / 100);
      return parseFloat(value) || defaultValue;
    }
    return defaultValue;
  }

  private parseSpacingValue(value: any): number {
    return this.parseSizeValue(value, 0);
  }

  private parsePositionValue(value: any, containerSize: number): number {
    if (value === 'auto') return 0;
    return this.parseSizeValue(value, containerSize);
  }

  private getCacheKey(node: ComponentNode, context: LayoutContext): string {
    return `${node.id}-${context.mode}-${JSON.stringify(context.config)}`;
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
   * Event handling
   */
  on(event: string, listener: (event: LayoutChangeEvent) => void): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(listener);
  }

  off(event: string, listener: (event: LayoutChangeEvent) => void): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: LayoutChangeEvent): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach((listener) => listener(data));
    }
  }

  /**
   * Get engine state
   */
  getState(): LayoutEngineState {
    return { ...this.state };
  }

  /**
   * Get performance metrics
   */
  getMetrics(): LayoutMetrics {
    return {
      calculationTime: this.state.lastCalculationTime,
      componentCount: this.state.calculations.size,
      cacheHitRate: this.state.cache.size > 0 ? 1 : 0,
      optimizationCount: this.state.totalCalculations,
      warningCount: this.state.warnings.length,
    };
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.state.cache.clear();
  }

  /**
   * Reset engine state
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
