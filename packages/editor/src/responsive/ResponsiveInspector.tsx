/**
 * Responsive Inspector Component
 *
 * Provides responsive inspector controls for editing styles across breakpoints
 * Similar to Webflow's responsive style inspector
 */

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Breakpoint, StyleObject, ComponentId } from '@wysiwyg/core';
import { InspectorControlState, ResponsiveStyleOverride, StylePreviewState } from './types';
import { getGlobalBreakpointManager } from './BreakpointManager';
import { getGlobalResponsiveStyleManager } from './ResponsiveStyleManager';

interface ResponsiveInspectorProps {
  componentId: ComponentId;
  baseStyles: StyleObject;
  responsiveStyles: Record<Breakpoint, StyleObject>;
  onStyleChange: (breakpoint: Breakpoint, property: string, value: any) => void;
  onStyleRemove?: (breakpoint: Breakpoint, property: string) => void;
  className?: string;
}

export const ResponsiveInspector: React.FC<ResponsiveInspectorProps> = ({
  componentId,
  baseStyles,
  responsiveStyles,
  onStyleChange,
  onStyleRemove,
  className = '',
}) => {
  const breakpointManager = getGlobalBreakpointManager();
  const styleManager = getGlobalResponsiveStyleManager();

  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>(
    breakpointManager.getCurrentBreakpoint()
  );

  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [previewState, setPreviewState] = useState<StylePreviewState | null>(null);
  const [showInherited, setShowInherited] = useState(true);

  // Get effective styles for current breakpoint
  const effectiveStyles = useMemo(() => {
    return styleManager.getEffectiveStyles(baseStyles, responsiveStyles, currentBreakpoint);
  }, [baseStyles, responsiveStyles, currentBreakpoint, styleManager]);

  // Get all style properties
  const allProperties = useMemo(() => {
    const properties = new Set<string>();

    Object.keys(baseStyles).forEach((prop) => properties.add(prop));
    Object.values(responsiveStyles).forEach((styles) => {
      Object.keys(styles).forEach((prop) => properties.add(prop));
    });

    return Array.from(properties);
  }, [baseStyles, responsiveStyles]);

  // Handle breakpoint change
  const handleBreakpointChange = useCallback((breakpoint: Breakpoint) => {
    setCurrentBreakpoint(breakpoint);
    setSelectedProperty(null);
    setPreviewState(null);
  }, []);

  // Handle property selection
  const handlePropertySelect = useCallback(
    (property: string) => {
      setSelectedProperty(property);

      const overrideInfo = styleManager.getOverrideInfo(
        baseStyles,
        responsiveStyles,
        property,
        currentBreakpoint
      );

      setPreviewState({
        componentId,
        breakpoint: currentBreakpoint,
        styles: { [property]: overrideInfo.styles[property as keyof StyleObject] },
        isPreviewing: true,
      });
    },
    [baseStyles, responsiveStyles, currentBreakpoint, componentId, styleManager]
  );

  // Handle style value change
  const handleValueChange = useCallback(
    (property: string, value: any) => {
      onStyleChange(currentBreakpoint, property, value);

      if (previewState) {
        setPreviewState({
          ...previewState,
          styles: { [property]: value },
        });
      }
    },
    [currentBreakpoint, onStyleChange, previewState]
  );

  // Handle style override removal
  const handleOverrideRemove = useCallback(
    (property: string) => {
      if (onStyleRemove) {
        onStyleRemove(currentBreakpoint, property);
      }

      if (previewState) {
        const newValue = effectiveStyles[property as keyof StyleObject];
        setPreviewState({
          ...previewState,
          styles: { [property]: newValue },
        });
      }
    },
    [currentBreakpoint, onStyleRemove, previewState, effectiveStyles]
  );

  // Get property control state
  const getPropertyControlState = useCallback(
    (property: string): InspectorControlState => {
      const isInherited = styleManager.isInherited(
        baseStyles,
        responsiveStyles,
        property,
        currentBreakpoint
      );

      const isOverridden = styleManager.isOverridden(
        baseStyles,
        responsiveStyles,
        property,
        currentBreakpoint
      );

      const overriddenBreakpoints = styleManager.getPropertyOverrideBreakpoints(
        baseStyles,
        responsiveStyles,
        property
      );

      return {
        componentId,
        currentBreakpoint,
        property,
        value: effectiveStyles[property as keyof StyleObject],
        isInherited,
        overriddenBreakpoints,
      };
    },
    [baseStyles, responsiveStyles, currentBreakpoint, effectiveStyles, componentId, styleManager]
  );

  // Render breakpoint selector
  const renderBreakpointSelector = () => {
    return (
      <div className="responsive-breakpoint-selector">
        <div className="breakpoint-label">Breakpoint:</div>
        <div className="breakpoint-options">
          {breakpointManager.getBreakpointOrder().map((bp) => {
            const isActive = bp === currentBreakpoint;
            const hasOverrides = Object.keys(responsiveStyles[bp] || {}).length > 0;

            return (
              <button
                key={bp}
                className={`breakpoint-option ${isActive ? 'active' : ''}`}
                onClick={() => handleBreakpointChange(bp)}
              >
                {bp.charAt(0).toUpperCase() + bp.slice(1)}
                {hasOverrides && <span className="override-indicator">•</span>}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // Render property control
  const renderPropertyControl = (property: string) => {
    const controlState = getPropertyControlState(property);
    const isSelected = selectedProperty === property;

    return (
      <div
        key={property}
        className={`property-control ${isSelected ? 'selected' : ''}`}
        onClick={() => handlePropertySelect(property)}
      >
        <div className="property-header">
          <span className="property-name">{formatPropertyName(property)}</span>
          <div className="property-indicators">
            {controlState.isInherited && showInherited && (
              <span className="indicator inherited" title="Inherited from smaller breakpoint">
                ↓
              </span>
            )}
            {controlState.overriddenBreakpoints.length > 0 && (
              <span
                className="indicator overridden"
                title={`Overridden in: ${controlState.overriddenBreakpoints.join(', ')}`}
              >
                •
              </span>
            )}
          </div>
        </div>

        <div className="property-value">
          <input
            type="text"
            value={formatValue(controlState.value)}
            onChange={(e) => handleValueChange(property, e.target.value)}
            onClick={(e) => e.stopPropagation()}
            className="value-input"
          />
          {controlState.overriddenBreakpoints.includes(currentBreakpoint) && (
            <button
              className="remove-override"
              onClick={(e) => {
                e.stopPropagation();
                handleOverrideRemove(property);
              }}
              title="Remove override"
            >
              ×
            </button>
          )}
        </div>

        {isSelected && previewState && (
          <div className="property-preview">
            <div className="preview-label">Preview:</div>
            <div className="preview-value">
              {formatValue(previewState.styles[property as keyof StyleObject])}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render all property controls
  const renderPropertyControls = () => {
    return (
      <div className="property-controls">
        {allProperties.map((property) => renderPropertyControl(property))}
      </div>
    );
  };

  // Render override summary
  const renderOverrideSummary = () => {
    const overrides = Object.entries(responsiveStyles);
    if (overrides.length === 0) return null;

    return (
      <div className="override-summary">
        <div className="summary-title">Style Overrides</div>
        {overrides.map(([breakpoint, styles]) => (
          <div key={breakpoint} className="breakpoint-overrides">
            <div className="breakpoint-name">
              {breakpoint.charAt(0).toUpperCase() + breakpoint.slice(1)}
            </div>
            <div className="override-count">{Object.keys(styles).length} properties</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`responsive-inspector ${className}`}>
      {renderBreakpointSelector()}

      <div className="inspector-header">
        <h3>Responsive Styles</h3>
        <label className="toggle-inherited">
          <input
            type="checkbox"
            checked={showInherited}
            onChange={(e) => setShowInherited(e.target.checked)}
          />
          Show inherited
        </label>
      </div>

      {renderOverrideSummary()}
      {renderPropertyControls()}

      <style jsx>{`
        .responsive-inspector {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 16px;
          background: white;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
        }

        .responsive-breakpoint-selector {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .breakpoint-label {
          font-size: 12px;
          font-weight: 600;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .breakpoint-options {
          display: flex;
          gap: 4px;
        }

        .breakpoint-option {
          flex: 1;
          padding: 8px 12px;
          border: 1px solid #e5e5e5;
          background: white;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          color: #666;
          transition: all 0.2s;
          position: relative;
        }

        .breakpoint-option:hover {
          background: #f5f5f5;
        }

        .breakpoint-option.active {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }

        .override-indicator {
          position: absolute;
          top: 4px;
          right: 4px;
          font-size: 12px;
          color: #f59e0b;
        }

        .breakpoint-option.active .override-indicator {
          color: white;
        }

        .inspector-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 12px;
          border-bottom: 1px solid #e5e5e5;
        }

        .inspector-header h3 {
          margin: 0;
          font-size: 14px;
          font-weight: 600;
          color: #333;
        }

        .toggle-inherited {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #666;
          cursor: pointer;
        }

        .toggle-inherited input {
          cursor: pointer;
        }

        .override-summary {
          padding: 12px;
          background: #f9fafb;
          border-radius: 6px;
        }

        .summary-title {
          font-size: 12px;
          font-weight: 600;
          color: #666;
          margin-bottom: 8px;
        }

        .breakpoint-overrides {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 4px 0;
          font-size: 13px;
        }

        .breakpoint-name {
          font-weight: 500;
          color: #333;
        }

        .override-count {
          color: #666;
          font-size: 12px;
        }

        .property-controls {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .property-control {
          padding: 12px;
          border: 1px solid #e5e5e5;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .property-control:hover {
          border-color: #3b82f6;
        }

        .property-control.selected {
          border-color: #3b82f6;
          background: #f0f7ff;
        }

        .property-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .property-name {
          font-size: 13px;
          font-weight: 500;
          color: #333;
        }

        .property-indicators {
          display: flex;
          gap: 4px;
        }

        .indicator {
          font-size: 12px;
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 600;
        }

        .indicator.inherited {
          color: #3b82f6;
          background: #eff6ff;
        }

        .indicator.overridden {
          color: #f59e0b;
          background: #fffbeb;
        }

        .property-value {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .value-input {
          flex: 1;
          padding: 6px 8px;
          border: 1px solid #e5e5e5;
          border-radius: 4px;
          font-size: 13px;
          color: #333;
        }

        .value-input:focus {
          outline: none;
          border-color: #3b82f6;
        }

        .remove-override {
          padding: 4px 8px;
          border: none;
          background: #fee2e2;
          color: #ef4444;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.2s;
        }

        .remove-override:hover {
          background: #fecaca;
        }

        .property-preview {
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px solid #e5e5e5;
        }

        .preview-label {
          font-size: 11px;
          color: #666;
          margin-bottom: 4px;
        }

        .preview-value {
          font-size: 13px;
          font-weight: 500;
          color: #3b82f6;
        }
      `}</style>
    </div>
  );
};

// Helper functions
function formatPropertyName(property: string): string {
  return property
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

function formatValue(value: any): string {
  if (typeof value === 'number') {
    return `${value}px`;
  }
  return String(value);
}
