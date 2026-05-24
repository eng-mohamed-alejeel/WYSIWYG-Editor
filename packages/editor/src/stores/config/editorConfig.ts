/**
 * Editor Configuration
 *
 * Default configuration values for the editor
 */

import { EditorConfig } from '../../types';

export const DEFAULT_CONFIG: Required<EditorConfig> = {
  enableAiFeatures: false,
  enableAnalytics: false,
  maxHistorySize: 50,
  autoSaveInterval: 30000,
  defaultBreakpoint: 'desktop',
};
