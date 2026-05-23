/**
 * Device Preview Component
 *
 * Provides device preview functionality similar to Webflow's device preview
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Breakpoint } from '@wysiwyg/core';
import { DeviceConfig, DeviceFrameConfig, ResponsiveState } from './types';
import { getGlobalBreakpointManager } from './BreakpointManager';

interface DevicePreviewProps {
  children: React.ReactNode;
  onBreakpointChange?: (breakpoint: Breakpoint) => void;
  onDeviceChange?: (device: DeviceConfig) => void;
  initialBreakpoint?: Breakpoint;
  initialDevice?: string;
  showDeviceSelector?: boolean;
  showZoomControls?: boolean;
  showOrientationToggle?: boolean;
  frameConfig?: Partial<DeviceFrameConfig>;
  className?: string;
}

const DEFAULT_FRAME_CONFIG: DeviceFrameConfig = {
  showFrame: true,
  showLabels: true,
  frameColor: '#1a1a1a',
  frameWidth: 12,
  borderRadius: 24,
};

export const DevicePreview: React.FC<DevicePreviewProps> = ({
  children,
  onBreakpointChange,
  onDeviceChange,
  initialBreakpoint = 'desktop',
  initialDevice,
  showDeviceSelector = true,
  showZoomControls = true,
  showOrientationToggle = true,
  frameConfig = {},
  className = '',
}) => {
  const breakpointManager = getGlobalBreakpointManager();
  const [responsiveState, setResponsiveState] = useState<ResponsiveState>({
    currentBreakpoint: initialBreakpoint,
    currentDevice: initialDevice ?? breakpointManager.getCurrentDevice()?.id ?? 'desktop',
    isResponsiveMode: true,
    zoom: 1,
    showBreakpoints: true,
    activeBreakpoints: breakpointManager.getVisibleBreakpoints(),
  });

  const [currentDevice, setCurrentDevice] = useState<DeviceConfig>(
    breakpointManager.getDevice(responsiveState.currentDevice) ??
      breakpointManager.getDevicesByBreakpoint(initialBreakpoint)[0]
  );

  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(
    currentDevice?.orientation ?? 'portrait'
  );

  const [isRotating, setIsRotating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const frameConfigFinal = { ...DEFAULT_FRAME_CONFIG, ...frameConfig };

  // Handle breakpoint change
  const handleBreakpointChange = useCallback(
    (breakpoint: Breakpoint) => {
      setResponsiveState((prev) => ({ ...prev, currentBreakpoint: breakpoint }));
      breakpointManager.setBreakpoint(breakpoint);

      // Get default device for breakpoint
      const defaultDevice = breakpointManager
        .getDevicesByBreakpoint(breakpoint)
        .find((d) => d.isDefault);
      if (defaultDevice) {
        handleDeviceChange(defaultDevice);
      }

      onBreakpointChange?.(breakpoint);
    },
    [breakpointManager, onBreakpointChange]
  );

  // Handle device change
  const handleDeviceChange = useCallback(
    (device: DeviceConfig) => {
      setCurrentDevice(device);
      setResponsiveState((prev) => ({ ...prev, currentDevice: device.id }));
      setOrientation(device.orientation ?? 'portrait');
      breakpointManager.setDevice(device.id);
      onDeviceChange?.(device);
    },
    [breakpointManager, onDeviceChange]
  );

  // Handle zoom change
  const handleZoomChange = useCallback((newZoom: number) => {
    const clampedZoom = Math.max(0.25, Math.min(2, newZoom));
    setResponsiveState((prev) => ({ ...prev, zoom: clampedZoom }));
  }, []);

  // Handle orientation toggle
  const handleOrientationToggle = useCallback(() => {
    if (!currentDevice) return;

    setIsRotating(true);
    setTimeout(() => {
      const newOrientation = orientation === 'portrait' ? 'landscape' : 'portrait';
      setOrientation(newOrientation);
      setIsRotating(false);
    }, 150);
  }, [currentDevice, orientation]);

  // Get device dimensions based on orientation
  const getDeviceDimensions = useCallback(() => {
    if (!currentDevice) return { width: 1440, height: 900 };

    if (orientation === 'landscape' && currentDevice.orientation === 'portrait') {
      return {
        width: currentDevice.height,
        height: currentDevice.width,
      };
    }

    return {
      width: currentDevice.width,
      height: currentDevice.height,
    };
  }, [currentDevice, orientation]);

  const deviceDimensions = getDeviceDimensions();

  // Get all available devices
  const availableDevices = breakpointManager.getAllDevices();

  // Get devices for current breakpoint
  const currentBreakpointDevices = breakpointManager.getDevicesByBreakpoint(
    responsiveState.currentBreakpoint
  );

  // Render device selector
  const renderDeviceSelector = () => {
    if (!showDeviceSelector) return null;

    return (
      <div className="device-selector">
        <div className="device-selector-label">Device:</div>
        <select
          value={currentDevice?.id}
          onChange={(e) => {
            const device = breakpointManager.getDevice(e.target.value);
            if (device) handleDeviceChange(device);
          }}
          className="device-select"
        >
          {availableDevices.map((device) => (
            <option key={device.id} value={device.id}>
              {device.name}
            </option>
          ))}
        </select>
      </div>
    );
  };

  // Render breakpoint tabs
  const renderBreakpointTabs = () => {
    return (
      <div className="breakpoint-tabs">
        {breakpointManager.getBreakpointOrder().map((bp) => {
          const isActive = bp === responsiveState.currentBreakpoint;
          const isVisible = breakpointManager.getBreakpointVisibility(bp)?.visible ?? true;

          return (
            <button
              key={bp}
              className={`breakpoint-tab ${isActive ? 'active' : ''} ${!isVisible ? 'hidden' : ''}`}
              onClick={() => handleBreakpointChange(bp)}
              disabled={!isVisible}
            >
              {bp.charAt(0).toUpperCase() + bp.slice(1)}
            </button>
          );
        })}
      </div>
    );
  };

  // Render zoom controls
  const renderZoomControls = () => {
    if (!showZoomControls) return null;

    return (
      <div className="zoom-controls">
        <button
          onClick={() => handleZoomChange(responsiveState.zoom - 0.1)}
          disabled={responsiveState.zoom <= 0.25}
          className="zoom-button"
        >
          −
        </button>
        <span className="zoom-level">{Math.round(responsiveState.zoom * 100)}%</span>
        <button
          onClick={() => handleZoomChange(responsiveState.zoom + 0.1)}
          disabled={responsiveState.zoom >= 2}
          className="zoom-button"
        >
          +
        </button>
        <button onClick={() => handleZoomChange(1)} className="zoom-reset">
          Reset
        </button>
      </div>
    );
  };

  // Render orientation toggle
  const renderOrientationToggle = () => {
    if (!showOrientationToggle || !currentDevice) return null;

    return (
      <button
        onClick={handleOrientationToggle}
        disabled={isRotating}
        className={`orientation-toggle ${isRotating ? 'rotating' : ''}`}
        title="Toggle orientation"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    );
  };

  return (
    <div className={`device-preview ${className}`} ref={containerRef}>
      {/* Controls Bar */}
      <div className="device-preview-controls">
        {renderBreakpointTabs()}
        <div className="device-preview-actions">
          {renderDeviceSelector()}
          {renderOrientationToggle()}
          {renderZoomControls()}
        </div>
      </div>

      {/* Device Frame */}
      <div className="device-preview-container">
        <div
          className="device-frame"
          style={{
            width: deviceDimensions.width * responsiveState.zoom,
            height: deviceDimensions.height * responsiveState.zoom,
            transform: `scale(${responsiveState.zoom})`,
            transformOrigin: 'top left',
            borderColor: frameConfigFinal.frameColor,
            borderWidth: frameConfigFinal.showFrame ? frameConfigFinal.frameWidth : 0,
            borderRadius: frameConfigFinal.borderRadius,
          }}
        >
          {/* Device Label */}
          {frameConfigFinal.showLabels && currentDevice && (
            <div className="device-label">
              {currentDevice.name}
              <span className="device-dimensions">
                {deviceDimensions.width} × {deviceDimensions.height}
              </span>
            </div>
          )}

          {/* Content Area */}
          <div
            className="device-content"
            style={{
              width: deviceDimensions.width,
              height: deviceDimensions.height,
            }}
          >
            {children}
          </div>
        </div>
      </div>

      <style jsx>{`
        .device-preview {
          display: flex;
          flex-direction: column;
          width: 100%;
          height: 100%;
          background: #f5f5f5;
          overflow: hidden;
        }

        .device-preview-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          background: white;
          border-bottom: 1px solid #e5e5e5;
          gap: 16px;
        }

        .breakpoint-tabs {
          display: flex;
          gap: 4px;
        }

        .breakpoint-tab {
          padding: 6px 12px;
          border: 1px solid #e5e5e5;
          background: white;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          color: #666;
          transition: all 0.2s;
        }

        .breakpoint-tab:hover:not(:disabled) {
          background: #f5f5f5;
        }

        .breakpoint-tab.active {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }

        .breakpoint-tab.hidden {
          opacity: 0.3;
        }

        .breakpoint-tab:disabled {
          cursor: not-allowed;
        }

        .device-preview-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .device-selector {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .device-selector-label {
          font-size: 13px;
          font-weight: 500;
          color: #666;
        }

        .device-select {
          padding: 6px 12px;
          border: 1px solid #e5e5e5;
          border-radius: 6px;
          font-size: 13px;
          cursor: pointer;
          min-width: 140px;
        }

        .zoom-controls {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 8px;
          background: #f5f5f5;
          border-radius: 6px;
        }

        .zoom-button {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          background: white;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 600;
          color: #666;
          transition: all 0.2s;
        }

        .zoom-button:hover:not(:disabled) {
          background: #e5e5e5;
        }

        .zoom-button:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .zoom-level {
          font-size: 13px;
          font-weight: 500;
          color: #666;
          min-width: 48px;
          text-align: center;
        }

        .zoom-reset {
          padding: 4px 8px;
          border: none;
          background: transparent;
          border-radius: 4px;
          cursor: pointer;
          font-size: 11px;
          font-weight: 500;
          color: #3b82f6;
          transition: all 0.2s;
        }

        .zoom-reset:hover {
          background: #e5e5e5;
        }

        .orientation-toggle {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #e5e5e5;
          background: white;
          border-radius: 6px;
          cursor: pointer;
          color: #666;
          transition: all 0.2s;
        }

        .orientation-toggle:hover:not(:disabled) {
          background: #f5f5f5;
        }

        .orientation-toggle.rotating {
          opacity: 0.5;
          cursor: wait;
        }

        .orientation-toggle:disabled {
          cursor: not-allowed;
        }

        .device-preview-container {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: auto;
          padding: 40px;
        }

        .device-frame {
          position: relative;
          background: white;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .device-label {
          position: absolute;
          top: -28px;
          left: 0;
          font-size: 12px;
          font-weight: 500;
          color: #666;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .device-dimensions {
          font-size: 11px;
          color: #999;
        }

        .device-content {
          overflow: auto;
          position: relative;
        }
      `}</style>
    </div>
  );
};

DevicePreview.displayName = 'DevicePreview';
