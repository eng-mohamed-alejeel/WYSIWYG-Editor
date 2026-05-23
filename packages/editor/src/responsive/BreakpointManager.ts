/**
 * Breakpoint Manager
 *
 * Manages breakpoint configurations, switching, and device mappings
 * Similar to Webflow's breakpoint system
 */

import { Breakpoint } from '@wysiwyg/core';
import { DeviceConfig, BreakpointVisibility } from './types';

/**
 * Default device configurations
 */
const DEFAULT_DEVICES: DeviceConfig[] = [
  {
    id: 'mobile-portrait',
    name: 'Mobile Portrait',
    icon: 'smartphone',
    width: 375,
    height: 667,
    breakpoint: 'mobile',
    scale: 0.5,
    orientation: 'portrait',
    isDefault: true,
  },
  {
    id: 'mobile-landscape',
    name: 'Mobile Landscape',
    icon: 'smartphone',
    width: 667,
    height: 375,
    breakpoint: 'mobile',
    scale: 0.5,
    orientation: 'landscape',
  },
  {
    id: 'tablet-portrait',
    name: 'Tablet Portrait',
    icon: 'tablet',
    width: 768,
    height: 1024,
    breakpoint: 'tablet',
    scale: 0.6,
    orientation: 'portrait',
  },
  {
    id: 'tablet-landscape',
    name: 'Tablet Landscape',
    icon: 'tablet',
    width: 1024,
    height: 768,
    breakpoint: 'tablet',
    scale: 0.6,
    orientation: 'landscape',
  },
  {
    id: 'desktop',
    name: 'Desktop',
    icon: 'monitor',
    width: 1440,
    height: 900,
    breakpoint: 'desktop',
    scale: 0.8,
    isDefault: true,
  },
  {
    id: 'wide',
    name: 'Wide Screen',
    icon: 'maximize',
    width: 1920,
    height: 1080,
    breakpoint: 'wide',
    scale: 0.9,
  },
];

/**
 * Breakpoint Manager Class
 */
export class BreakpointManager {
  private devices: Map<string, DeviceConfig>;
  private currentBreakpoint: Breakpoint;
  private currentDevice: string;
  private breakpointVisibility: Map<Breakpoint, BreakpointVisibility>;
  private breakpointOrder: Breakpoint[];

  constructor() {
    this.devices = new Map();
    DEFAULT_DEVICES.forEach((device) => this.devices.set(device.id, device));
    this.currentBreakpoint = 'desktop';
    this.currentDevice = 'desktop';
    this.breakpointVisibility = new Map();
    this.breakpointOrder = ['mobile', 'tablet', 'desktop', 'wide'];
    this.initializeBreakpointVisibility();
  }

  /**
   * Initialize breakpoint visibility
   */
  private initializeBreakpointVisibility(): void {
    this.breakpointOrder.forEach((bp) => {
      this.breakpointVisibility.set(bp, {
        breakpoint: bp,
        visible: true,
        locked: false,
      });
    });
  }

  /**
   * Get all devices
   */
  getAllDevices(): DeviceConfig[] {
    return Array.from(this.devices.values());
  }

  /**
   * Get devices by breakpoint
   */
  getDevicesByBreakpoint(breakpoint: Breakpoint): DeviceConfig[] {
    return Array.from(this.devices.values()).filter((device) => device.breakpoint === breakpoint);
  }

  /**
   * Get device by ID
   */
  getDevice(deviceId: string): DeviceConfig | undefined {
    return this.devices.get(deviceId);
  }

  /**
   * Get current breakpoint
   */
  getCurrentBreakpoint(): Breakpoint {
    return this.currentBreakpoint;
  }

  /**
   * Get current device
   */
  getCurrentDevice(): DeviceConfig | undefined {
    return this.devices.get(this.currentDevice);
  }

  /**
   * Set current breakpoint
   */
  setBreakpoint(breakpoint: Breakpoint): void {
    this.currentBreakpoint = breakpoint;
    // Switch to default device for this breakpoint
    const defaultDevice = this.getDevicesByBreakpoint(breakpoint).find((d) => d.isDefault);
    if (defaultDevice) {
      this.currentDevice = defaultDevice.id;
    }
  }

  /**
   * Set current device
   */
  setDevice(deviceId: string): void {
    const device = this.devices.get(deviceId);
    if (device) {
      this.currentDevice = deviceId;
      this.currentBreakpoint = device.breakpoint;
    }
  }

  /**
   * Get next breakpoint
   */
  getNextBreakpoint(current?: Breakpoint): Breakpoint {
    const bp = current ?? this.currentBreakpoint;
    const index = this.breakpointOrder.indexOf(bp);
    return this.breakpointOrder[Math.min(index + 1, this.breakpointOrder.length - 1)];
  }

  /**
   * Get previous breakpoint
   */
  getPreviousBreakpoint(current?: Breakpoint): Breakpoint {
    const bp = current ?? this.currentBreakpoint;
    const index = this.breakpointOrder.indexOf(bp);
    return this.breakpointOrder[Math.max(index - 1, 0)];
  }

  /**
   * Get breakpoint order
   */
  getBreakpointOrder(): Breakpoint[] {
    return [...this.breakpointOrder];
  }

  /**
   * Check if breakpoint is larger than another
   */
  isBreakpointLarger(bp1: Breakpoint, bp2: Breakpoint): boolean {
    return this.breakpointOrder.indexOf(bp1) > this.breakpointOrder.indexOf(bp2);
  }

  /**
   * Check if breakpoint is smaller than another
   */
  isBreakpointSmaller(bp1: Breakpoint, bp2: Breakpoint): boolean {
    return this.breakpointOrder.indexOf(bp1) < this.breakpointOrder.indexOf(bp2);
  }

  /**
   * Get breakpoint visibility
   */
  getBreakpointVisibility(breakpoint: Breakpoint): BreakpointVisibility | undefined {
    return this.breakpointVisibility.get(breakpoint);
  }

  /**
   * Set breakpoint visibility
   */
  setBreakpointVisibility(breakpoint: Breakpoint, visible: boolean): void {
    const visibility = this.breakpointVisibility.get(breakpoint);
    if (visibility) {
      visibility.visible = visible;
      this.breakpointVisibility.set(breakpoint, visibility);
    }
  }

  /**
   * Toggle breakpoint visibility
   */
  toggleBreakpointVisibility(breakpoint: Breakpoint): void {
    const visibility = this.breakpointVisibility.get(breakpoint);
    if (visibility) {
      this.setBreakpointVisibility(breakpoint, !visibility.visible);
    }
  }

  /**
   * Get all visible breakpoints
   */
  getVisibleBreakpoints(): Breakpoint[] {
    return this.breakpointOrder.filter((bp) => {
      const visibility = this.breakpointVisibility.get(bp);
      return visibility?.visible ?? true;
    });
  }

  /**
   * Add custom device
   */
  addDevice(device: DeviceConfig): void {
    this.devices.set(device.id, device);
  }

  /**
   * Remove device
   */
  removeDevice(deviceId: string): void {
    this.devices.delete(deviceId);
  }

  /**
   * Update device
   */
  updateDevice(deviceId: string, updates: Partial<DeviceConfig>): void {
    const device = this.devices.get(deviceId);
    if (device) {
      this.devices.set(deviceId, { ...device, ...updates });
    }
  }

  /**
   * Reset to default devices
   */
  resetToDefaults(): void {
    this.devices.clear();
    DEFAULT_DEVICES.forEach((device) => this.devices.set(device.id, device));
    this.currentBreakpoint = 'desktop';
    this.currentDevice = 'desktop';
    this.initializeBreakpointVisibility();
  }

  /**
   * Serialize breakpoint manager state
   */
  serialize(): string {
    return JSON.stringify({
      currentBreakpoint: this.currentBreakpoint,
      currentDevice: this.currentDevice,
      devices: Array.from(this.devices.entries()),
      breakpointVisibility: Array.from(this.breakpointVisibility.entries()),
    });
  }

  /**
   * Deserialize and restore breakpoint manager state
   */
  deserialize(data: string): void {
    try {
      const parsed = JSON.parse(data);
      this.currentBreakpoint = parsed.currentBreakpoint;
      this.currentDevice = parsed.currentDevice;
      this.devices = new Map(parsed.devices);
      this.breakpointVisibility = new Map(parsed.breakpointVisibility);
    } catch (error) {
      console.error('Failed to deserialize breakpoint manager state:', error);
    }
  }
}

/**
 * Global breakpoint manager instance
 */
let globalBreakpointManager: BreakpointManager | null = null;

/**
 * Get or create the global breakpoint manager
 */
export function getGlobalBreakpointManager(): BreakpointManager {
  if (!globalBreakpointManager) {
    globalBreakpointManager = new BreakpointManager();
  }
  return globalBreakpointManager;
}

/**
 * Reset the global breakpoint manager
 */
export function resetGlobalBreakpointManager(): void {
  globalBreakpointManager = null;
}
