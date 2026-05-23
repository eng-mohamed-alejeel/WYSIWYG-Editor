/**
 * Layout Guides System
 *
 * Provides visual guides for layout editing including:
 * - Margin guides
 * - Padding guides
 * - Border guides
 * - Grid guides
 * - Alignment guides
 * - Spacing guides
 */

import { ComponentId, ComponentNode } from '@wysiwyg/core';
import { LayoutBounds, LayoutGuidesConfig, LayoutMeasurement } from '../types';

export interface LayoutGuide {
  id: string;
  type: 'margin' | 'padding' | 'border' | 'grid' | 'alignment' | 'spacing';
  componentId?: ComponentId;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  style: {
    color: string;
    style: 'solid' | 'dashed' | 'dotted';
    width: number;
  };
  label?: string;
  value?: number;
}

export class LayoutGuides {
  private config: Required<LayoutGuidesConfig>;
  private activeGuides: Map<ComponentId, LayoutGuide[]>;
  private gridGuides: LayoutGuide[];

  constructor(config: Partial<LayoutGuidesConfig> = {}) {
    this.config = {
      showMargins: config.showMargins ?? true,
      showPadding: config.showPadding ?? true,
      showBorders: config.showBorders ?? true,
      showGrid: config.showGrid ?? false,
      showAlignment: config.showAlignment ?? true,
      showSpacing: config.showSpacing ?? true,
      marginColor: config.marginColor ?? '#ef4444',
      paddingColor: config.paddingColor ?? '#3b82f6',
      borderColor: config.borderColor ?? '#10b981',
      gridColor: config.gridColor ?? '#6b7280',
      alignmentColor: config.alignmentColor ?? '#8b5cf6',
      spacingColor: config.spacingColor ?? '#f59e0b',
    };

    this.activeGuides = new Map();
    this.gridGuides = [];
  }

  /**
   * Generate guides for a component
   */
  generateGuides(
    componentId: ComponentId,
    node: ComponentNode,
    bounds: LayoutBounds,
    measurement: LayoutMeasurement
  ): LayoutGuide[] {
    const guides: LayoutGuide[] = [];

    // Margin guides
    if (this.config.showMargins) {
      guides.push(...this.generateMarginGuides(componentId, bounds, measurement));
    }

    // Padding guides
    if (this.config.showPadding) {
      guides.push(...this.generatePaddingGuides(componentId, bounds, measurement));
    }

    // Border guides
    if (this.config.showBorders) {
      guides.push(...this.generateBorderGuides(componentId, bounds));
    }

    // Store guides
    this.activeGuides.set(componentId, guides);

    return guides;
  }

  /**
   * Generate margin guides
   */
  private generateMarginGuides(
    componentId: ComponentId,
    bounds: LayoutBounds,
    measurement: LayoutMeasurement
  ): LayoutGuide[] {
    const guides: LayoutGuide[] = [];
    const { marginTop, marginBottom, marginLeft, marginRight } = measurement;

    // Top margin guide
    if (marginTop && marginTop > 0) {
      guides.push({
        id: `margin-top-${componentId}`,
        type: 'margin',
        componentId,
        position: {
          x: bounds.x - (marginLeft || 0),
          y: bounds.y - marginTop,
          width: bounds.width + (marginLeft || 0) + (marginRight || 0),
          height: marginTop,
        },
        style: {
          color: this.config.marginColor,
          style: 'dashed',
          width: 1,
        },
        label: `Margin Top: ${marginTop}px`,
        value: marginTop,
      });
    }

    // Bottom margin guide
    if (marginBottom && marginBottom > 0) {
      guides.push({
        id: `margin-bottom-${componentId}`,
        type: 'margin',
        componentId,
        position: {
          x: bounds.x - (marginLeft || 0),
          y: bounds.y + bounds.height,
          width: bounds.width + (marginLeft || 0) + (marginRight || 0),
          height: marginBottom,
        },
        style: {
          color: this.config.marginColor,
          style: 'dashed',
          width: 1,
        },
        label: `Margin Bottom: ${marginBottom}px`,
        value: marginBottom,
      });
    }

    // Left margin guide
    if (marginLeft && marginLeft > 0) {
      guides.push({
        id: `margin-left-${componentId}`,
        type: 'margin',
        componentId,
        position: {
          x: bounds.x - marginLeft,
          y: bounds.y - (marginTop || 0),
          width: marginLeft,
          height: bounds.height + (marginTop || 0) + (marginBottom || 0),
        },
        style: {
          color: this.config.marginColor,
          style: 'dashed',
          width: 1,
        },
        label: `Margin Left: ${marginLeft}px`,
        value: marginLeft,
      });
    }

    // Right margin guide
    if (marginRight && marginRight > 0) {
      guides.push({
        id: `margin-right-${componentId}`,
        type: 'margin',
        componentId,
        position: {
          x: bounds.x + bounds.width,
          y: bounds.y - (marginTop || 0),
          width: marginRight,
          height: bounds.height + (marginTop || 0) + (marginBottom || 0),
        },
        style: {
          color: this.config.marginColor,
          style: 'dashed',
          width: 1,
        },
        label: `Margin Right: ${marginRight}px`,
        value: marginRight,
      });
    }

    return guides;
  }

  /**
   * Generate padding guides
   */
  private generatePaddingGuides(
    componentId: ComponentId,
    bounds: LayoutBounds,
    measurement: LayoutMeasurement
  ): LayoutGuide[] {
    const guides: LayoutGuide[] = [];
    const { paddingTop, paddingBottom, paddingLeft, paddingRight } = measurement;

    // Top padding guide
    if (paddingTop && paddingTop > 0) {
      guides.push({
        id: `padding-top-${componentId}`,
        type: 'padding',
        componentId,
        position: {
          x: bounds.x,
          y: bounds.y,
          width: bounds.width,
          height: paddingTop,
        },
        style: {
          color: this.config.paddingColor,
          style: 'dotted',
          width: 1,
        },
        label: `Padding Top: ${paddingTop}px`,
        value: paddingTop,
      });
    }

    // Bottom padding guide
    if (paddingBottom && paddingBottom > 0) {
      guides.push({
        id: `padding-bottom-${componentId}`,
        type: 'padding',
        componentId,
        position: {
          x: bounds.x,
          y: bounds.y + bounds.height - paddingBottom,
          width: bounds.width,
          height: paddingBottom,
        },
        style: {
          color: this.config.paddingColor,
          style: 'dotted',
          width: 1,
        },
        label: `Padding Bottom: ${paddingBottom}px`,
        value: paddingBottom,
      });
    }

    // Left padding guide
    if (paddingLeft && paddingLeft > 0) {
      guides.push({
        id: `padding-left-${componentId}`,
        type: 'padding',
        componentId,
        position: {
          x: bounds.x,
          y: bounds.y,
          width: paddingLeft,
          height: bounds.height,
        },
        style: {
          color: this.config.paddingColor,
          style: 'dotted',
          width: 1,
        },
        label: `Padding Left: ${paddingLeft}px`,
        value: paddingLeft,
      });
    }

    // Right padding guide
    if (paddingRight && paddingRight > 0) {
      guides.push({
        id: `padding-right-${componentId}`,
        type: 'padding',
        componentId,
        position: {
          x: bounds.x + bounds.width - paddingRight,
          y: bounds.y,
          width: paddingRight,
          height: bounds.height,
        },
        style: {
          color: this.config.paddingColor,
          style: 'dotted',
          width: 1,
        },
        label: `Padding Right: ${paddingRight}px`,
        value: paddingRight,
      });
    }

    return guides;
  }

  /**
   * Generate border guides
   */
  private generateBorderGuides(componentId: ComponentId, bounds: LayoutBounds): LayoutGuide[] {
    const guides: LayoutGuide[] = [];

    // Top border guide
    guides.push({
      id: `border-top-${componentId}`,
      type: 'border',
      componentId,
      position: {
        x: bounds.x,
        y: bounds.y,
        width: bounds.width,
        height: 0,
      },
      style: {
        color: this.config.borderColor,
        style: 'solid',
        width: 2,
      },
    });

    // Bottom border guide
    guides.push({
      id: `border-bottom-${componentId}`,
      type: 'border',
      componentId,
      position: {
        x: bounds.x,
        y: bounds.y + bounds.height,
        width: bounds.width,
        height: 0,
      },
      style: {
        color: this.config.borderColor,
        style: 'solid',
        width: 2,
      },
    });

    // Left border guide
    guides.push({
      id: `border-left-${componentId}`,
      type: 'border',
      componentId,
      position: {
        x: bounds.x,
        y: bounds.y,
        width: 0,
        height: bounds.height,
      },
      style: {
        color: this.config.borderColor,
        style: 'solid',
        width: 2,
      },
    });

    // Right border guide
    guides.push({
      id: `border-right-${componentId}`,
      type: 'border',
      componentId,
      position: {
        x: bounds.x + bounds.width,
        y: bounds.y,
        width: 0,
        height: bounds.height,
      },
      style: {
        color: this.config.borderColor,
        style: 'solid',
        width: 2,
      },
    });

    return guides;
  }

  /**
   * Generate grid guides
   */
  generateGridGuides(
    containerBounds: LayoutBounds,
    columns: number,
    rows: number,
    columnGap: number = 0,
    rowGap: number = 0
  ): LayoutGuide[] {
    const guides: LayoutGuide[] = [];

    if (!this.config.showGrid) {
      return guides;
    }

    const columnWidth = (containerBounds.width - (columns - 1) * columnGap) / columns;
    const rowHeight = (containerBounds.height - (rows - 1) * rowGap) / rows;

    // Vertical grid lines
    for (let i = 0; i <= columns; i++) {
      const x = containerBounds.x + i * (columnWidth + columnGap);
      guides.push({
        id: `grid-vertical-${i}`,
        type: 'grid',
        position: {
          x,
          y: containerBounds.y,
          width: 0,
          height: containerBounds.height,
        },
        style: {
          color: this.config.gridColor,
          style: 'dashed',
          width: 1,
        },
      });
    }

    // Horizontal grid lines
    for (let i = 0; i <= rows; i++) {
      const y = containerBounds.y + i * (rowHeight + rowGap);
      guides.push({
        id: `grid-horizontal-${i}`,
        type: 'grid',
        position: {
          x: containerBounds.x,
          y,
          width: containerBounds.width,
          height: 0,
        },
        style: {
          color: this.config.gridColor,
          style: 'dashed',
          width: 1,
        },
      });
    }

    this.gridGuides = guides;
    return guides;
  }

  /**
   * Generate alignment guides
   */
  generateAlignmentGuides(
    componentId: ComponentId,
    bounds: LayoutBounds,
    alignment: 'horizontal' | 'vertical' | 'both',
    referenceBounds?: LayoutBounds
  ): LayoutGuide[] {
    const guides: LayoutGuide[] = [];

    if (!this.config.showAlignment) {
      return guides;
    }

    const centerX = bounds.x + bounds.width / 2;
    const centerY = bounds.y + bounds.height / 2;

    if (alignment === 'horizontal' || alignment === 'both') {
      guides.push({
        id: `alignment-horizontal-${componentId}`,
        type: 'alignment',
        componentId,
        position: {
          x: referenceBounds ? referenceBounds.x : bounds.x,
          y: centerY,
          width: referenceBounds ? referenceBounds.width : bounds.width,
          height: 0,
        },
        style: {
          color: this.config.alignmentColor,
          style: 'dashed',
          width: 2,
        },
        label: 'Center',
      });
    }

    if (alignment === 'vertical' || alignment === 'both') {
      guides.push({
        id: `alignment-vertical-${componentId}`,
        type: 'alignment',
        componentId,
        position: {
          x: centerX,
          y: referenceBounds ? referenceBounds.y : bounds.y,
          width: 0,
          height: referenceBounds ? referenceBounds.height : bounds.height,
        },
        style: {
          color: this.config.alignmentColor,
          style: 'dashed',
          width: 2,
        },
        label: 'Center',
      });
    }

    return guides;
  }

  /**
   * Generate spacing guides
   */
  generateSpacingGuides(
    componentId1: ComponentId,
    bounds1: LayoutBounds,
    componentId2: ComponentId,
    bounds2: LayoutBounds,
    orientation: 'horizontal' | 'vertical'
  ): LayoutGuide[] {
    const guides: LayoutGuide[] = [];

    if (!this.config.showSpacing) {
      return guides;
    }

    let spacing: number;
    let guidePosition: { x: number; y: number; width: number; height: number };

    if (orientation === 'horizontal') {
      spacing = bounds2.x - (bounds1.x + bounds1.width);
      guidePosition = {
        x: bounds1.x + bounds1.width,
        y: Math.min(bounds1.y, bounds2.y),
        width: spacing,
        height: Math.max(bounds1.height, bounds2.height),
      };
    } else {
      spacing = bounds2.y - (bounds1.y + bounds1.height);
      guidePosition = {
        x: Math.min(bounds1.x, bounds2.x),
        y: bounds1.y + bounds1.height,
        width: Math.max(bounds1.width, bounds2.width),
        height: spacing,
      };
    }

    guides.push({
      id: `spacing-${componentId1}-${componentId2}`,
      type: 'spacing',
      position: guidePosition,
      style: {
        color: this.config.spacingColor,
        style: 'dotted',
        width: 1,
      },
      label: `${Math.round(spacing)}px`,
      value: spacing,
    });

    return guides;
  }

  /**
   * Get guides for a component
   */
  getGuides(componentId: ComponentId): LayoutGuide[] {
    return this.activeGuides.get(componentId) || [];
  }

  /**
   * Get all active guides
   */
  getAllGuides(): LayoutGuide[] {
    const allGuides: LayoutGuide[] = [];
    for (const guides of this.activeGuides.values()) {
      allGuides.push(...guides);
    }
    return allGuides;
  }

  /**
   * Get grid guides
   */
  getGridGuides(): LayoutGuide[] {
    return [...this.gridGuides];
  }

  /**
   * Clear guides for a component
   */
  clearGuides(componentId: ComponentId): void {
    this.activeGuides.delete(componentId);
  }

  /**
   * Clear all guides
   */
  clearAllGuides(): void {
    this.activeGuides.clear();
    this.gridGuides = [];
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<LayoutGuidesConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  getConfig(): Required<LayoutGuidesConfig> {
    return { ...this.config };
  }
}
