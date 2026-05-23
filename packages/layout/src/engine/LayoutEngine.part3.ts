      this.calculateChildHeight(child, parentBounds);

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

  private calculateConstraints(
    node: ComponentNode,
    context: LayoutContext
  ): LayoutConstraints {
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

    return tracks.map(track => {
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
    const totalWidth = Array.from(measurements.values())
      .reduce((sum, m) => sum + m.width, 0);

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
          offset = (index * remainingSpace / children.length) + (remainingSpace / children.length / 2);
          break;
        case 'space-evenly':
          offset = (index * remainingSpace / (children.length + 1)) + (remainingSpace / (children.length + 1));
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
      listeners.forEach(callback => callback(data));
    }
  }

  /**
   * Get layout metrics
   */
  getMetrics(): LayoutMetrics {
    return {
      calculationTime: this.state.lastCalculationTime,
      componentCount: this.state.calculations.size,
      cacheHitRate: this.state.cache.size > 0 
        ? this.state.totalCalculations / this.state.cache.size 
        : 0,
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

    keysToDelete.forEach(key => this.state.cache.delete(key));
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
