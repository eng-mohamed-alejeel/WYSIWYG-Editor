/**
 * Layout Engine Implementation
 *
 * Manages editor layout and workspace organization
 */

import { EventBus } from './EventBus';

export interface LayoutPanel {
  id: string;
  type: 'sidebar' | 'panel' | 'toolbar' | 'canvas';
  title?: string;
  position: 'left' | 'right' | 'top' | 'bottom' | 'center';
  size?: number;
  resizable?: boolean;
  visible?: boolean;
  order?: number;
  components?: string[];
}

export interface LayoutConfig {
  panels: LayoutPanel[];
  activePanel?: string;
  theme?: 'light' | 'dark';
  density?: 'compact' | 'comfortable' | 'spacious';
}

export class LayoutEngine {
  private config: LayoutConfig;
  private eventBus: EventBus;
  private activePanelId: string | null = null;

  constructor(initialConfig: LayoutConfig, eventBus?: EventBus) {
    this.eventBus = eventBus ?? new EventBus();
    this.config = initialConfig;
  }

  getConfig(): LayoutConfig {
    return { ...this.config };
  }

  updateConfig(updates: Partial<LayoutConfig>): void {
    const previousConfig = { ...this.config };
    this.config = { ...this.config, ...updates };

    this.eventBus.emit('layout:updated', {
      config: this.config,
      previousConfig,
    });
  }

  registerPanel(panel: LayoutPanel): void {
    const existingIndex = this.config.panels.findIndex((p) => p.id === panel.id);

    if (existingIndex >= 0) {
      this.config.panels[existingIndex] = { ...this.config.panels[existingIndex], ...panel };
    } else {
      this.config.panels.push(panel);
    }

    this.eventBus.emit('layout:panel:registered', { panel });
  }

  unregisterPanel(panelId: string): void {
    const index = this.config.panels.findIndex((p) => p.id === panelId);
    if (index >= 0) {
      const panel = this.config.panels[index];
      this.config.panels.splice(index, 1);

      if (this.activePanelId === panelId) {
        this.activePanelId = null;
      }

      this.eventBus.emit('layout:panel:unregistered', { panelId, panel });
    }
  }

  getPanel(panelId: string): LayoutPanel | undefined {
    return this.config.panels.find((p) => p.id === panelId);
  }

  getAllPanels(): LayoutPanel[] {
    return [...this.config.panels];
  }

  showPanel(panelId: string): void {
    const panel = this.config.panels.find((p) => p.id === panelId);
    if (panel) {
      panel.visible = true;
      this.eventBus.emit('layout:panel:visibility:changed', { panelId, visible: true });
    }
  }

  hidePanel(panelId: string): void {
    const panel = this.config.panels.find((p) => p.id === panelId);
    if (panel) {
      panel.visible = false;
      this.eventBus.emit('layout:panel:visibility:changed', { panelId, visible: false });
    }
  }

  togglePanel(panelId: string): void {
    const panel = this.config.panels.find((p) => p.id === panelId);
    if (panel) {
      panel.visible = panel.visible !== undefined ? !panel.visible : true;
      this.eventBus.emit('layout:panel:visibility:changed', {
        panelId,
        visible: panel.visible,
      });
    }
  }

  resizePanel(panelId: string, size: number): void {
    const panel = this.config.panels.find((p) => p.id === panelId);
    if (panel && panel.resizable === true) {
      panel.size = size;
      this.eventBus.emit('layout:panel:resized', { panelId, size });
    }
  }

  setActivePanel(panelId: string): void {
    const panel = this.config.panels.find((p) => p.id === panelId);
    if (panel && panel.visible !== false) {
      this.activePanelId = panelId;
      this.eventBus.emit('layout:panel:activated', { panelId });
    }
  }

  getActivePanel(): LayoutPanel | undefined {
    if (this.activePanelId !== null && this.activePanelId !== undefined) {
      return this.config.panels.find((p) => p.id === this.activePanelId);
    }
    return undefined;
  }

  reset(): void {
    this.activePanelId = null;
    this.config.panels = [];
    this.eventBus.emit('layout:reset', {});
  }
}
