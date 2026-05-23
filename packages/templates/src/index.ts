/**
 * WYSIWYG Editor Templates Package
 *
 * This is the main entry point for the templates package.
 * It exports all types, services, stores, and components for template
 * and marketplace functionality.
 */

// Types
export * from './types';

// Services
export { TemplateManager } from './services/TemplateManager';
export { MarketplaceService } from './services/MarketplaceService';
export { ImportExportService } from './services/ImportExportService';
export { PreviewService } from './services/PreviewService';

// Store
export { useTemplateStore } from './store/templateStore';

// Components
export { TemplateMarketplace } from './components/TemplateMarketplace';
export { TemplateLibrary } from './components/TemplateLibrary';
export { TemplatePreview } from './components/TemplatePreview';
export { TemplateEditorIntegration } from './components/TemplateEditorIntegration';
