/**
 * Default Layout Configuration
 *
 * Defines the default layout panels for the editor
 */

import { LayoutEngine } from './LayoutEngine';

export function initializeDefaultLayout(layoutEngine: LayoutEngine): void {
  // Components panel
  layoutEngine.registerPanel({
    id: 'components-panel',
    type: 'sidebar',
    title: 'Components',
    position: 'left',
    size: 300,
    resizable: true,
    visible: true,
    order: 1,
  });

  // Properties panel
  layoutEngine.registerPanel({
    id: 'properties-panel',
    type: 'sidebar',
    title: 'Properties',
    position: 'right',
    size: 300,
    resizable: true,
    visible: true,
    order: 1,
  });

  // Layers panel
  layoutEngine.registerPanel({
    id: 'layers-panel',
    type: 'sidebar',
    title: 'Layers',
    position: 'left',
    size: 250,
    resizable: true,
    visible: false,
    order: 2,
  });

  // Toolbar
  layoutEngine.registerPanel({
    id: 'toolbar',
    type: 'toolbar',
    title: 'Toolbar',
    position: 'top',
    size: 50,
    resizable: false,
    visible: true,
    order: 1,
  });

  // Canvas
  layoutEngine.registerPanel({
    id: 'canvas',
    type: 'canvas',
    title: 'Canvas',
    position: 'center',
    visible: true,
    order: 1,
  });
}
