# Templates and Marketplace Usage Guide

This guide provides detailed instructions on how to use the templates and marketplace system in the WYSIWYG visual builder platform.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Working with Templates](#working-with-templates)
3. [Working with Sections](#working-with-sections)
4. [Working with Reusable Components](#working-with-reusable-components)
5. [Using the Marketplace](#using-the-marketplace)
6. [Importing and Exporting](#importing-and-exporting)
7. [Creating Custom Templates](#creating-custom-templates)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)

## Getting Started

### Installation

The templates package is included in the WYSIWYG editor platform. No additional installation is required.

### Basic Setup

```typescript
import { useTemplateStore, TemplateManager, MarketplaceService } from '@wysiwyg/templates';

// Initialize services
const templateManager = TemplateManager.getInstance();
const marketplaceService = MarketplaceService.getInstance();

// Configure marketplace (optional)
marketplaceService.configure({
  enabled: true,
  apiUrl: 'https://api.marketplace.com',
  apiKey: 'your-api-key',
  cacheEnabled: true,
  cacheDuration: 3600000, // 1 hour
});
```

## Working with Templates

### Browsing Templates

```typescript
const { getAllTemplates, getTemplatesByCategory, searchTemplates } = useTemplateStore();

// Get all templates
const allTemplates = getAllTemplates();

// Get templates by category
const landingPageTemplates = getTemplatesByCategory('landing-page');

// Search templates
const results = searchTemplates('modern');
```

### Applying a Template

```typescript
const { getTemplate } = useTemplateStore();

// Get a specific template
const template = getTemplate('template-id');

// Apply template to project
onApplyTemplate(template);
```

### Creating a Template from Current Project

```typescript
const templateManager = TemplateManager.getInstance();

const template = {
  metadata: {
    id: crypto.randomUUID(),
    name: 'My Custom Template',
    description: 'A custom template created from my project',
    category: 'landing-page',
    tags: ['custom', 'modern'],
    version: '1.0.0',
    author: 'Your Name',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'draft',
  },
  content: {
    pages: project.pages,
    theme: project.theme,
    assets: project.assets,
  },
};

// Validate template
const validation = templateManager.validateTemplate(template);
if (!validation.valid) {
  console.error('Validation errors:', validation.errors);
  return;
}

// Add template to store
useTemplateStore.getState().addTemplate(template);
```

## Working with Sections

### Browsing Sections

```typescript
const { getAllSections, getSectionsByCategory, searchSections } = useTemplateStore();

// Get all sections
const allSections = getAllSections();

// Get sections by category
const businessSections = getSectionsByCategory('business');

// Search sections
const results = searchSections('hero');
```

### Adding a Section to a Page

```typescript
const { getSection } = useTemplateStore();

// Get a specific section
const section = getSection('section-id');

// Add section to current page
onApplySection(section);
```

### Creating a Section from Selected Components

```typescript
const templateManager = TemplateManager.getInstance();

// Extract section from template
const section = templateManager.extractSectionFromTemplate(template, 'Hero Section', [
  'component-id-1',
  'component-id-2',
]);

// Add section to store
useTemplateStore.getState().addSection(section);
```

## Working with Reusable Components

### Browsing Reusable Components

```typescript
const { getAllReusableComponents, searchReusableComponents } = useTemplateStore();

// Get all reusable components
const allComponents = getAllReusableComponents();

// Search components
const results = searchReusableComponents('button');
```

### Using a Reusable Component

```typescript
const { getReusableComponent } = useTemplateStore();

// Get a specific component
const component = getReusableComponent('component-id');

// Add component to current page
onApplyComponent(component);
```

### Creating a Reusable Component

```typescript
const templateManager = TemplateManager.getInstance();

const component = templateManager.createReusableComponentFromNode(
  selectedComponent,
  'My Custom Component',
  'A custom button component',
  'forms',
  'Your Name'
);

// Add component to store
useTemplateStore.getState().addReusableComponent(component);
```

## Using the Marketplace

### Browsing the Marketplace

```typescript
const marketplaceService = MarketplaceService.getInstance();

// Browse items with filters
const items = await marketplaceService.browseItems({
  category: 'landing-page',
  pricingModel: 'free',
  type: 'template',
  limit: 20,
});

// Search items
const results = await marketplaceService.searchItems('modern', {
  type: 'template',
});

// Get featured items
const featured = await marketplaceService.getFeaturedItems('template', 10);

// Get trending items
const trending = await marketplaceService.getTrendingItems('section', 10);
```

### Downloading from Marketplace

```typescript
// Check license (for premium items)
const hasLicense = await marketplaceService.verifyLicense('item-id');

if (!hasLicense) {
  // Initiate purchase
  const purchase = await marketplaceService.purchaseLicense('item-id', 'payment-method-id');
  if (!purchase.success) {
    console.error('Purchase failed:', purchase.error);
    return;
  }
}

// Download item
const template = await marketplaceService.downloadItem('item-id');

// Add to local library
useTemplateStore.getState().addTemplate(template);
```

### Uploading to Marketplace

```typescript
// Upload template to marketplace
const uploaded = await marketplaceService.uploadItem(template, true, {
  model: 'premium',
  price: 29.99,
  currency: 'USD',
});

console.log('Uploaded item:', uploaded);
```

## Importing and Exporting

### Importing a Template

```typescript
const importExportService = ImportExportService.getInstance();

// Import from file
const file = event.target.files[0];
const template = await importExportService.importFromFile(file);

// Or import from data
const template = await importExportService.importTemplate(data, {
  preserveIds: false,
  mergeTheme: true,
  includeDependencies: true,
});

// Add to store
useTemplateStore.getState().addTemplate(template);
```

### Exporting a Template

```typescript
// Export template
const exported = await importExportService.exportTemplate(template, {
  format: 'json',
  includeAssets: true,
  includeTheme: true,
  minify: false,
});

// Download as file
const blob = await importExportService.exportToFile(template, 'my-template.json');
importExportService.downloadExport(blob, 'my-template.json');
```

### Batch Import/Export

```typescript
// Import multiple templates
const files = event.target.files;
for (const file of files) {
  const item = await importExportService.importFromFile(file);
  if ('pages' in item.content) {
    useTemplateStore.getState().addTemplate(item);
  } else if ('components' in item.content) {
    useTemplateStore.getState().addSection(item);
  } else {
    useTemplateStore.getState().addReusableComponent(item);
  }
}

// Export multiple templates
const templates = useTemplateStore.getState().getAllTemplates();
for (const template of templates) {
  const blob = await importExportService.exportToFile(template, `${template.metadata.name}.json`);
  importExportService.downloadExport(blob, `${template.metadata.name}.json`);
}
```

## Creating Custom Templates

### Template Structure

A template consists of:

1. **Metadata**: Information about the template
   - Name, description, category
   - Tags, version, author
   - Preview images
   - Pricing model (for marketplace)

2. **Content**: The actual template data
   - Pages with component trees
   - Theme configuration
   - Asset references
   - Custom styles and scripts

3. **Dependencies**: External requirements
   - Required components
   - Required plugins
   - External libraries

### Best Practices for Template Creation

1. **Use Semantic HTML**
   - Proper heading hierarchy
   - Semantic elements (header, nav, main, footer)
   - Accessible attributes

2. **Optimize Performance**
   - Compress images
   - Minimize custom scripts
   - Use efficient CSS

3. **Ensure Responsiveness**
   - Test on all breakpoints
   - Use flexible layouts
   - Optimize for mobile

4. **Provide Good Documentation**
   - Clear descriptions
   - Usage instructions
   - Customization tips

### Example: Creating a Landing Page Template

```typescript
const landingPageTemplate: Template = {
  metadata: {
    id: crypto.randomUUID(),
    name: 'Modern Landing Page',
    description: 'A modern, responsive landing page template',
    category: 'landing-page',
    tags: ['modern', 'responsive', 'startup'],
    version: '1.0.0',
    author: 'Your Name',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    thumbnailUrl: '/templates/landing-page/thumbnail.png',
    previewUrls: [
      '/templates/landing-page/preview-desktop.png',
      '/templates/landing-page/preview-mobile.png',
    ],
    pricingModel: 'free',
    status: 'published',
  },
  content: {
    pages: [
      {
        id: crypto.randomUUID(),
        name: 'Home',
        slug: 'home',
        components: [
          // Your component tree here
        ],
        metadata: {
          title: 'Modern Landing Page',
          description: 'A modern landing page template',
        },
        settings: {},
      },
    ],
    theme: {
      // Your theme configuration here
    },
    assets: [
      // Your asset references here
    ],
  },
};

// Validate and add
const templateManager = TemplateManager.getInstance();
const validation = templateManager.validateTemplate(landingPageTemplate);

if (validation.valid) {
  useTemplateStore.getState().addTemplate(landingPageTemplate);
} else {
  console.error('Validation errors:', validation.errors);
}
```

## Best Practices

### Template Management

1. **Version Control**
   - Use semantic versioning
   - Document changes between versions
   - Maintain backward compatibility

2. **Organization**
   - Use meaningful categories
   - Add relevant tags
   - Provide clear descriptions

3. **Quality Assurance**
   - Validate all templates
   - Test on multiple devices
   - Check accessibility

### Marketplace Usage

1. **Search Optimization**
   - Use relevant keywords
   - Filter by category and pricing
   - Check ratings and reviews

2. **License Management**
   - Verify licenses before download
   - Keep track of purchases
   - Understand usage rights

3. **Community Engagement**
   - Leave reviews
   - Report issues
   - Share feedback

### Performance

1. **Caching**
   - Enable preview caching
   - Cache marketplace results
   - Clear cache periodically

2. **Lazy Loading**
   - Load templates on demand
   - Use pagination for large lists
   - Optimize image loading

3. **Optimization**
   - Minify exports
   - Compress assets
   - Use efficient data structures

## Troubleshooting

### Common Issues

#### Template Import Fails

**Problem**: Template import fails with validation errors

**Solution**:

1. Check validation error messages
2. Verify template structure
3. Ensure all dependencies are available
4. Check for missing required fields

#### Marketplace Loading Issues

**Problem**: Marketplace items fail to load

**Solution**:

1. Check API configuration
2. Verify network connectivity
3. Check authentication credentials
4. Clear cache and retry

#### Preview Generation Problems

**Problem**: Preview images fail to generate

**Solution**:

1. Clear preview cache
2. Check browser compatibility
3. Verify template structure
4. Ensure sufficient resources

#### Performance Issues

**Problem**: Slow template loading or rendering

**Solution**:

1. Enable caching
2. Optimize template size
3. Use lazy loading
4. Check network performance

### Getting Help

If you encounter issues not covered in this guide:

1. Check the [Architecture Documentation](./ARCHITECTURE.md)
2. Review the [API Reference](./README.md#api-reference)
3. Search existing issues
4. Create a new issue with detailed information

## Conclusion

This guide covers the essential aspects of using the templates and marketplace system. For more detailed information, refer to the architecture documentation and API reference.

Remember to follow best practices and optimize your templates for the best user experience.
