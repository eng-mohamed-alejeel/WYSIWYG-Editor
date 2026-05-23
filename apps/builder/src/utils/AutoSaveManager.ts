import { useBuilderStore } from '../store/store';

export interface AutoSaveOptions {
  interval: number; // in milliseconds
  enabled: boolean;
  onSave?: (data: any) => void;
  onError?: (error: Error) => void;
}

export class AutoSaveManager {
  private intervalId: NodeJS.Timeout | null = null;
  private options: AutoSaveOptions;
  private lastSaveTime: Date | null = null;
  private isSaving: boolean = false;

  constructor(options: Partial<AutoSaveOptions> = {}) {
    this.options = {
      interval: options.interval || 30000, // Default 30 seconds
      enabled: options.enabled !== false,
      onSave: options.onSave,
      onError: options.onError,
    };
  }

  // Start auto-save
  start() {
    if (this.intervalId) {
      this.stop();
    }

    if (!this.options.enabled) {
      return;
    }

    this.intervalId = setInterval(() => {
      this.save();
    }, this.options.interval);
  }

  // Stop auto-save
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  // Save current state
  async save() {
    if (this.isSaving) {
      return;
    }

    try {
      this.isSaving = true;

      const { project, currentPageId, selectedIds, currentBreakpoint, zoom } =
        useBuilderStore.getState();

      const saveData = {
        project,
        currentPageId,
        selectedIds,
        currentBreakpoint,
        zoom,
        timestamp: new Date().toISOString(),
      };

      // Save to localStorage
      localStorage.setItem('builder-autosave', JSON.stringify(saveData));

      // Call custom save handler if provided
      if (this.options.onSave) {
        await this.options.onSave(saveData);
      }

      this.lastSaveTime = new Date();

      // Mark project as not dirty
      const { setIsDirty } = useBuilderStore.getState();
      setIsDirty(false);
    } catch (error) {
      console.error('Auto-save failed:', error);

      if (this.options.onError) {
        this.options.onError(error as Error);
      }
    } finally {
      this.isSaving = false;
    }
  }

  // Force save immediately
  async forceSave() {
    await this.save();
  }

  // Get last save time
  getLastSaveTime(): Date | null {
    return this.lastSaveTime;
  }

  // Check if currently saving
  isCurrentlySaving(): boolean {
    return this.isSaving;
  }

  // Update options
  updateOptions(options: Partial<AutoSaveOptions>) {
    this.options = { ...this.options, ...options };

    // Restart if interval changed
    if (options.interval && this.intervalId) {
      this.start();
    }
  }

  // Load saved state from localStorage
  static loadSavedState(): any | null {
    try {
      const saved = localStorage.getItem('builder-autosave');
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Failed to load saved state:', error);
      return null;
    }
  }

  // Clear saved state
  static clearSavedState() {
    localStorage.removeItem('builder-autosave');
  }

  // Check if there's a saved state
  static hasSavedState(): boolean {
    return localStorage.getItem('builder-autosave') !== null;
  }
}

export default AutoSaveManager;
