# @wysiwyg/templates

Templates and marketplace architecture for the visual builder platform.

## Overview

This package provides a comprehensive template system that enables users to:

- Create, manage, and share reusable templates
- Build and share reusable sections
- Create and share reusable components
- Browse and download templates from a marketplace
- Import and export templates in various formats
- Generate previews for templates, sections, and components

## Features

### Template Management

- **Reusable Templates**: Complete page layouts that can be applied to projects
- **Reusable Sections**: Pre-built sections that can be added to any page
- **Reusable Components**: Custom components that can be reused across projects
- **Template Categories**: Organize templates by category (landing page, portfolio, e-commerce, etc.)
- **Template Metadata**: Rich metadata including name, description, tags, version, author, and more
- **Template Previews**: Automatic preview generation for all template types

### Marketplace Integration

- **Remote Template Loading**: Browse and download templates from a remote marketplace
- **Search and Filtering**: Advanced search and filtering capabilities
- **License Management**: Support for premium templates with license verification
- **Purchase Flow**: Integration with payment systems for premium templates
- **User Templates**: Manage and share your own templates in the marketplace
- **Reviews and Ratings**: Community-driven review system

### Import/Export

- **Multiple Formats**: Support for JSON and ZIP export formats
- **Flexible Options**: Control what to include (assets, theme, etc.)
- **Data Validation**: Comprehensive validation of imported templates
- **Batch Operations**: Import/export multiple templates at once

### Editor Integration

- **Seamless Integration**: Direct integration with the visual editor
- **Drag and Drop**: Drag templates, sections, and components into the editor
- **Live Preview**: Preview templates before applying them
- **Save As Template**: Save current work as a template, section, or component
- **Template Customization**: Modify templates after applying them

## Installation

```bash
npm install @wysiwyg/templates
```

## Usage

### Basic Setup

```typescript
import { useTemplateStore, TemplateManager, MarketplaceService } from '@wysiwyg/templates';

// Initialize services
const templateManager = TemplateManager.getInstance();
const marketplaceService = MarketplaceService.getInstance();

// Configure marketplace
marketplaceService.configure({
  enabled: true,
  apiUrl: 'https://api.marketplace.com',
  apiKey: 'your-api-key',
});
```

### Using the Template Store

```typescript
function MyComponent() {
  const {
    templates,
    addTemplate,
    getTemplate,
    searchTemplates,
  } = useTemplateStore();

  // Add a template
  const handleAddTemplate = (template: Template) => {
    addTemplate(template);
  };

  // Get a template
  const template = getTemplate('template-id');

  // Search templates
  const results = searchTemplates('landing page');

  return (
    <div>
      {/* Render templates */}
    </div>
  );
}
```

### Using Template Manager

```typescript
const templateManager = TemplateManager.getInstance();

// Validate a template
const validation = templateManager.validateTemplate(template);
if (!validation.valid) {
  console.error('Validation errors:', validation.errors);
}

// Clone a template
const cloned = templateManager.cloneTemplate(template);

// Extract a section from a template
const section = templateManager.extractSectionFromTemplate(template, 'Hero Section', [
  'component-id-1',
  'component-id-2',
]);

// Create a reusable component
const component = templateManager.createReusableComponentFromNode(
  componentNode,
  'My Component',
  'Description',
  'category',
  'Author'
);
```

### Using Marketplace Service

```typescript
const marketplaceService = MarketplaceService.getInstance();

// Browse items
const items = await marketplaceService.browseItems({
  category: 'landing-page',
  pricingModel: 'free',
  limit: 20,
});

// Search items
const results = await marketplaceService.searchItems('modern', {
  type: 'template',
});

// Get featured items
const featured = await marketplaceService.getFeaturedItems('template', 10);

// Download an item
const template = await marketplaceService.downloadItem('item-id');

// Upload an item
const uploaded = await marketplaceService.uploadItem(template, true, {
  model: 'premium',
  price: 29.99,
  currency: 'USD',
});
```

### Using Import/Export Service

```typescript
const importExportService = ImportExportService.getInstance();

// Import a template
const template = await importExportService.importTemplate(data, {
  preserveIds: false,
  mergeTheme: true,
  includeDependencies: true,
});

// Export a template
const exported = await importExportService.exportTemplate(template, {
  format: 'json',
  includeAssets: true,
  includeTheme: true,
  minify: false,
});

// Import from file
const item = await importExportService.importFromFile(file);

// Export to file
const blob = await importExportService.exportToFile(template, 'my-template.json');
importExportService.downloadExport(blob, 'my-template.json');
```

### Using Preview Service

```typescript
const previewService = PreviewService.getInstance();

// Generate template preview
const previewUrl = await previewService.generateTemplatePreview(template, {
  width: 1200,
  height: 800,
  format: 'png',
  quality: 0.9,
  useCache: true,
});

// Generate batch previews
const previews = await previewService.generateBatchPreviews([
  { type: 'template', data: template1 },
  { type: 'section', data: section1 },
  { type: 'component', data: component1 },
]);

// Clear cache
previewService.clearCache();
```

### Using React Components

```typescript
import { TemplateMarketplace, TemplateLibrary, TemplatePreview } from '@wysiwyg/templates';

function App() {
  return (
    <div>
      {/* Marketplace Component */}
      <TemplateMarketplace
        onSelectItem={(item) => console.log('Selected:', item)}
        onDownloadItem={(itemId) => console.log('Downloaded:', itemId)}
      />

      {/* Library Component */}
      <TemplateLibrary
        onSelectTemplate={(template) => console.log('Selected template:', template)}
        onSelectSection={(section) => console.log('Selected section:', section)}
        onSelectComponent={(component) => console.log('Selected component:', component)}
      />

      {/* Preview Component */}
      <TemplatePreview
        item={template}
        onUseTemplate={(template) => console.log('Using template:', template)}
        onClose={() => console.log('Closed preview')}
      />
    </div>
  );
}
```

## API Reference

### Types

See [types/index.ts](./src/types/index.ts) for complete type definitions.

### Services

- **TemplateManager**: Manages template operations including validation, cloning, and extraction
- **MarketplaceService**: Handles marketplace interactions including browsing, searching, and downloading
- **ImportExportService**: Manages import/export operations with support for multiple formats
- **PreviewService**: Generates previews for templates, sections, and components

### Components

- **TemplateMarketplace**: UI component for browsing the marketplace
- **TemplateLibrary**: UI component for managing local templates
- **TemplatePreview**: UI component for previewing templates
- **TemplateEditorIntegration**: UI component for integrating templates with the editor

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## License

MIT
