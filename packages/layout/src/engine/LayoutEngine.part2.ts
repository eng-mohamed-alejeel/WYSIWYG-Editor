      const gridRow = (child.styles.gridRow as number) || rowIndex + 1;

      // Calculate position
      const xPos = columnWidths.slice(0, gridColumn - 1).reduce((sum, w) => sum + w, 0) + (gridColumn - 1) * columnGap;
      const yPos = rowHeights.slice(0, gridRow - 1).reduce((sum, h) => sum + h, 0) + (gridRow - 1) * rowGap;

      // Get span
      const columnSpan = (child.styles.gridColumnEnd as number) - gridColumn || 1;
      const rowSpan = (child.styles.gridRowEnd as number) - gridRow || 1;

      // Calculate size
      const width = columnWidths.slice(gridColumn - 1, gridColumn - 1 + columnSpan).reduce((sum, w) => sum + w, 0) + (columnSpan - 1) * columnGap;
      const height = rowHeights.slice(gridRow - 1, gridRow - 1 + rowSpan).reduce((sum, h) => sum + h, 0) + (rowSpan - 1) * rowGap;

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
      const childConfig = child.styles.position === 'absolute' 
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
        childWidth = this.calculateChildWidth(child, { x: 0, y: 0, width: contentWidth, height: contentHeight });
      } else {
        childWidth = this.calculateChildWidth(child, { x: 0, y: 0, width: contentWidth, height: contentHeight });
      }

      if (config.sizing.height === 'fill') {
        childHeight = isRow
          ? contentHeight
          : (contentHeight - (children.length - 1) * gap) / children.length;
      } else if (config.sizing.height === 'fit') {
        childHeight = this.calculateChildHeight(child, { x: 0, y: 0, width: contentWidth, height: contentHeight });
      } else {
        childHeight = this.calculateChildHeight(child, { x: 0, y: 0, width: contentWidth, height: contentHeight });
      }

      // Calculate position
      const xPos = isRow ? currentPos + padding.left : padding.left;
      const yPos = isRow ? padding.top : currentPos + padding.top;

      // Apply alignment
      if (config.alignment.horizontal === 'center') {
        childMeasurement.left = padding.left + (contentWidth - childWidth) / 2;
      } else if (config.alignment.horizontal === 'flex-end') {
        childMeasurement.left = padding.left + contentWidth - childWidth;
      }

      if (config.alignment.vertical === 'center') {
        childMeasurement.top = padding.top + (contentHeight - childHeight) / 2;
      } else if (config.alignment.vertical === 'flex-end') {
        childMeasurement.top = padding.top + contentHeight - childHeight;
      }

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
      width: this.parseSize(styles.width as string, parentBounds.width),
      height: this.parseSize(styles.height as string, parentBounds.height),
      top: this.parseSize(styles.top as string, parentBounds.height),
      left: this.parseSize(styles.left as string, parentBounds.width),
      right: this.parseSize(styles.right as string, parentBounds.width),
      bottom: this.parseSize(styles.bottom as string, parentBounds.height),
      marginTop: this.parseSize(styles.marginTop as string, 0),
      marginBottom: this.parseSize(styles.marginBottom as string, 0),
      marginLeft: this.parseSize(styles.marginLeft as string, 0),
      marginRight: this.parseSize(styles.marginRight as string, 0),
      paddingTop: this.parseSize(styles.paddingTop as string, 0),
      paddingBottom: this.parseSize(styles.paddingBottom as string, 0),
      paddingLeft: this.parseSize(styles.paddingLeft as string, 0),
      paddingRight: this.parseSize(styles.paddingRight as string, 0),
    };
  }

  private calculateConstraints(node: ComponentNode, context: LayoutContext): LayoutConstraints {
    const styles = node.styles;
    return {
      minWidth: this.parseSize(styles.minWidth as string, 0),
      maxWidth: this.parseSize(styles.maxWidth as string, Infinity),
      minHeight: this.parseSize(styles.minHeight as string, 0),
      maxHeight: this.parseSize(styles.maxHeight as string, Infinity),
      aspectRatio: styles.aspectRatio as number,
    };
  }

  private calculateChildWidth(child: ComponentNode, parentBounds: LayoutBounds): number {
    const styles = child.styles;
    const width = this.parseSize(styles.width as string, parentBounds.width);
    const minWidth = this.parseSize(styles.minWidth as string, 0);
    const maxWidth = this.parseSize(styles.maxWidth as string, Infinity);
    return Math.max(minWidth, Math.min(maxWidth, width));
  }

  private calculateChildHeight(child: ComponentNode, parentBounds: LayoutBounds): number {
    const styles = child.styles;
    const height = this.parseSize(styles.height as string, parentBounds.height);
    const minHeight = this.parseSize(styles.minHeight as string, 0);
    const maxHeight = this.parseSize(styles.maxHeight as string, Infinity);
    return Math.max(minHeight, Math.min(maxHeight, height));
  }

  private parseSize(value: string | number | undefined, parentSize: number): number {
    if (value === undefined || value === null) return parentSize;
    if (typeof value === 'number') return value;
    if (value.endsWith('%')) {
      return (parseFloat(value) / 100) * parentSize;
    }
    if (value.endsWith('px')) {
      return parseFloat(value);
    }
    if (value === 'auto') {
      return parentSize;
    }
    return parseFloat(value) || parentSize;
  }

  private calculateGridTracks(tracks: GridTrackSize[], containerSize: number, gap: number): number[] {
    const flexibleTracks: number[] = [];
    const fixedTracks: number[] = [];
    let remainingSpace = containerSize;

    // Separate flexible and fixed tracks
    for (const track of tracks) {
      if (typeof track === 'number') {
        fixedTracks.push(track);
        remainingSpace -= track;
      } else if (typeof track === 'string') {
        if (track.endsWith('fr')) {
          flexibleTracks.push(parseFloat(track));
        } else if (track.endsWith('%')) {
          const size = (parseFloat(track) / 100) * containerSize;
          fixedTracks.push(size);
          remainingSpace -= size;
        } else if (track.endsWith('px')) {
          const size = parseFloat(track);
          fixedTracks.push(size);
          remainingSpace -= size;
        } else if (track === 'auto') {
          flexibleTracks.push(1);
        }
      }
    }

    // Calculate flexible track sizes
    const totalFr = flexibleTracks.reduce((sum, fr) => sum + fr, 0);
    const frUnit = totalFr > 0 ? remainingSpace / totalFr : 0;
    const flexibleSizes = flexibleTracks.map(fr => fr * frUnit);

    // Combine and return
    return [...fixedTracks, ...flexibleSizes];
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

    let xOffset = 0;
    switch (justifyContent) {
      case 'center':
        xOffset = availableSpace / 2;
        break;
      case 'flex-end':
        xOffset = availableSpace;
        break;
      case 'space-between':
        // Already handled in calculateFlexChildren
        return;
      case 'space-around':
        xOffset = availableSpace / (children.length * 2);
        break;
      case 'space-evenly':
        xOffset = availableSpace / (children.length + 1);
        break;
    }

    // Apply offset to all children
    for (const child of children) {
      const measurement = measurements.get(child.id);
      const childBounds = bounds.get(child.id);
      if (measurement && childBounds) {
        measurement.left += xOffset;
        childBounds.x += xOffset;
      }
    }
  }

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

  private getCacheKey(node: ComponentNode, context: LayoutContext): string {
    return `${node.id}-${context.mode}-${context.depth}-${JSON.stringify(context.config)}`;
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
  public on(event: string, listener: (event: LayoutChangeEvent) => void): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(listener);
  }

  public off(event: string, listener: (event: LayoutChangeEvent) => void): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit(event: LayoutChangeEvent): void {
    const listeners = this.eventListeners.get(event.type);
    if (listeners) {
      listeners.forEach(listener => listener(event));
    }
  }

  /**
   * Get engine state
   */
  public getState(): LayoutEngineState {
    return { ...this.state };
  }

  /**
   * Get performance metrics
   */
  public getMetrics(): LayoutMetrics {
    const cacheHitRate = this.state.totalCalculations > 0
      ? this.state.cache.size / this.state.totalCalculations
      : 0;

    return {
      calculationTime: this.state.lastCalculationTime,
      componentCount: this.state.calculations.size,
      cacheHitRate,
      optimizationCount: this.state.totalCalculations,
      warningCount: this.state.warnings.length,
    };
  }

  /**
   * Clear cache
   */
  public clearCache(): void {
    this.state.cache.clear();
  }

  /**
   * Update options
   */
  public updateOptions(options: Partial<LayoutEngineOptions>): void {
    this.options = { ...this.options, ...options };
  }
}
