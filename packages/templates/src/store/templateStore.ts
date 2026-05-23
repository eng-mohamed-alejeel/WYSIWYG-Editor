/**
 * Template Store
 *
 * Centralized state management for templates, sections, and reusable components
 * using Zustand for efficient state management and updates.
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type {
  Template,
  Section,
  ReusableComponent,
  TemplateId,
  SectionId,
  ReusableComponentId,
  TemplateCategory,
  MarketplaceItem,
  MarketplaceFilters,
  MarketplaceResponse,
  TemplateImportOptions,
  TemplateExportOptions,
  TemplateValidationResult,
  TemplateStore,
} from '../types';

interface TemplateStoreState {
  templates: Map<TemplateId, Template>;
  sections: Map<SectionId, Section>;
  reusableComponents: Map<ReusableComponentId, ReusableComponent>;
  categories: Set<TemplateCategory>;
  marketplaceItems: Map<string, MarketplaceItem>;
  isLoading: boolean;
  error: string | null;
  marketplaceConfig: {
    enabled: boolean;
    apiUrl: string;
    apiKey?: string;
    cacheEnabled: boolean;
    cacheDuration: number;
  };
}

const initialState: TemplateStoreState = {
  templates: new Map(),
  sections: new Map(),
  reusableComponents: new Map(),
  categories: new Set([
    'landing-page',
    'portfolio',
    'ecommerce',
    'blog',
    'business',
    'event',
    'product',
    'service',
    'personal',
    'corporate',
    'startup',
    'saas',
    'coming-soon',
    'error-page',
    'other',
  ]),
  marketplaceItems: new Map(),
  isLoading: false,
  error: null,
  marketplaceConfig: {
    enabled: true,
    apiUrl: '/api/marketplace',
    cacheEnabled: true,
    cacheDuration: 3600000, // 1 hour
  },
};

export const useTemplateStore = create<TemplateStore>()(
  immer((set, get) => ({
    ...initialState,

    // Template operations
    addTemplate: (template) => {
      set((state) => {
        state.templates.set(template.metadata.id, template);
      });
    },

    updateTemplate: (id, updates) => {
      set((state) => {
        const template = state.templates.get(id);
        if (template) {
          Object.assign(template, updates);
          template.metadata.updatedAt = new Date().toISOString();
        }
      });
    },

    deleteTemplate: (id) => {
      set((state) => {
        state.templates.delete(id);
      });
    },

    getTemplate: (id) => {
      return get().templates.get(id);
    },

    getAllTemplates: () => {
      return Array.from(get().templates.values());
    },

    getTemplatesByCategory: (category) => {
      return get()
        .templates.values()
        .filter((template) => template.metadata.category === category);
    },

    searchTemplates: (query) => {
      const lowerQuery = query.toLowerCase();
      return get()
        .templates.values()
        .filter(
          (template) =>
            template.metadata.name.toLowerCase().includes(lowerQuery) ||
            template.metadata.description.toLowerCase().includes(lowerQuery) ||
            template.metadata.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
        );
    },

    // Section operations
    addSection: (section) => {
      set((state) => {
        state.sections.set(section.metadata.id, section);
      });
    },

    updateSection: (id, updates) => {
      set((state) => {
        const section = state.sections.get(id);
        if (section) {
          Object.assign(section, updates);
          section.metadata.updatedAt = new Date().toISOString();
        }
      });
    },

    deleteSection: (id) => {
      set((state) => {
        state.sections.delete(id);
      });
    },

    getSection: (id) => {
      return get().sections.get(id);
    },

    getAllSections: () => {
      return Array.from(get().sections.values());
    },

    getSectionsByCategory: (category) => {
      return get()
        .sections.values()
        .filter((section) => section.metadata.category === category);
    },

    searchSections: (query) => {
      const lowerQuery = query.toLowerCase();
      return get()
        .sections.values()
        .filter(
          (section) =>
            section.metadata.name.toLowerCase().includes(lowerQuery) ||
            section.metadata.description.toLowerCase().includes(lowerQuery) ||
            section.metadata.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
        );
    },

    // Reusable component operations
    addReusableComponent: (component) => {
      set((state) => {
        state.reusableComponents.set(component.metadata.id, component);
      });
    },

    updateReusableComponent: (id, updates) => {
      set((state) => {
        const component = state.reusableComponents.get(id);
        if (component) {
          Object.assign(component, updates);
          component.metadata.updatedAt = new Date().toISOString();
        }
      });
    },

    deleteReusableComponent: (id) => {
      set((state) => {
        state.reusableComponents.delete(id);
      });
    },

    getReusableComponent: (id) => {
      return get().reusableComponents.get(id);
    },

    getAllReusableComponents: () => {
      return Array.from(get().reusableComponents.values());
    },

    searchReusableComponents: (query) => {
      const lowerQuery = query.toLowerCase();
      return get()
        .reusableComponents.values()
        .filter(
          (component) =>
            component.metadata.name.toLowerCase().includes(lowerQuery) ||
            component.metadata.description.toLowerCase().includes(lowerQuery) ||
            component.metadata.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
        );
    },

    // Category operations
    addCategory: (category) => {
      set((state) => {
        state.categories.add(category);
      });
    },

    removeCategory: (category) => {
      set((state) => {
        state.categories.delete(category);
      });
    },

    getAllCategories: () => {
      return Array.from(get().categories);
    },

    // Marketplace operations
    loadMarketplaceItems: async (filters?: MarketplaceFilters) => {
      const state = get();
      if (!state.marketplaceConfig.enabled) {
        return;
      }

      set({ isLoading: true, error: null });

      try {
        const queryParams = new URLSearchParams();
        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined) {
              if (Array.isArray(value)) {
                value.forEach((v) => queryParams.append(key, String(v)));
              } else {
                queryParams.append(key, String(value));
              }
            }
          });
        }

        const response = await fetch(
          `${state.marketplaceConfig.apiUrl}/items?${queryParams.toString()}`,
          {
            headers: {
              'Content-Type': 'application/json',
              ...(state.marketplaceConfig.apiKey && {
                Authorization: `Bearer ${state.marketplaceConfig.apiKey}`,
              }),
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to load marketplace items');
        }

        const data: MarketplaceResponse = await response.json();

        set((state) => {
          data.items.forEach((item) => {
            state.marketplaceItems.set(item.id, item);
          });
        });
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to load marketplace items',
        });
      } finally {
        set({ isLoading: false });
      }
    },

    downloadMarketplaceItem: async (itemId: string) => {
      const state = get();
      if (!state.marketplaceConfig.enabled) {
        throw new Error('Marketplace is not enabled');
      }

      set({ isLoading: true, error: null });

      try {
        const response = await fetch(`${state.marketplaceConfig.apiUrl}/items/${itemId}/download`, {
          headers: {
            'Content-Type': 'application/json',
            ...(state.marketplaceConfig.apiKey && {
              Authorization: `Bearer ${state.marketplaceConfig.apiKey}`,
            }),
          },
        });

        if (!response.ok) {
          throw new Error('Failed to download marketplace item');
        }

        const data = await response.json();

        // Based on item type, add to appropriate store
        const item = state.marketplaceItems.get(itemId);
        if (item) {
          switch (item.type) {
            case 'template':
              get().addTemplate(data as Template);
              break;
            case 'section':
              get().addSection(data as Section);
              break;
            case 'component':
              get().addReusableComponent(data as ReusableComponent);
              break;
          }
        }

        return data;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to download item';
        set({ error: errorMessage });
        throw new Error(errorMessage);
      } finally {
        set({ isLoading: false });
      }
    },

    uploadToMarketplace: async (item: Template | Section | ReusableComponent) => {
      const state = get();
      if (!state.marketplaceConfig.enabled) {
        throw new Error('Marketplace is not enabled');
      }

      set({ isLoading: true, error: null });

      try {
        const itemType =
          'metadata' in item ? 'template' : 'content' in item ? 'section' : 'component';
        const response = await fetch(`${state.marketplaceConfig.apiUrl}/items`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(state.marketplaceConfig.apiKey && {
              Authorization: `Bearer ${state.marketplaceConfig.apiKey}`,
            }),
          },
          body: JSON.stringify({
            type: itemType,
            item,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to upload item to marketplace');
        }

        const data: MarketplaceItem = await response.json();

        set((state) => {
          state.marketplaceItems.set(data.id, data);
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to upload item';
        set({ error: errorMessage });
        throw new Error(errorMessage);
      } finally {
        set({ isLoading: false });
      }
    },

    // Import/Export operations
    importTemplate: async (data: any, options?: TemplateImportOptions) => {
      const { validateTemplate } = get();
      const validation = validateTemplate(data);

      if (!validation.valid) {
        throw new Error(
          `Template validation failed: ${validation.errors.map((e) => e.message).join(', ')}`
        );
      }

      const template: Template = {
        ...data,
        metadata: {
          ...data.metadata,
          id: options?.preserveIds ? data.metadata.id : crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };

      get().addTemplate(template);
      return template;
    },

    exportTemplate: async (id: TemplateId, options?: TemplateExportOptions) => {
      const template = get().getTemplate(id);
      if (!template) {
        throw new Error('Template not found');
      }

      const exportData = {
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        template: options?.minify ? JSON.stringify(template) : template,
        includeAssets: options?.includeAssets ?? true,
        includeTheme: options?.includeTheme ?? true,
      };

      if (options?.format === 'zip') {
        // In a real implementation, you would use a library like JSZip
        // For now, we'll return the JSON data
        return exportData;
      }

      return exportData;
    },

    importSection: async (data: any, options?: TemplateImportOptions) => {
      const { validateSection } = get();
      const validation = validateSection(data);

      if (!validation.valid) {
        throw new Error(
          `Section validation failed: ${validation.errors.map((e) => e.message).join(', ')}`
        );
      }

      const section: Section = {
        ...data,
        metadata: {
          ...data.metadata,
          id: options?.preserveIds ? data.metadata.id : crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };

      get().addSection(section);
      return section;
    },

    exportSection: async (id: SectionId, options?: TemplateExportOptions) => {
      const section = get().getSection(id);
      if (!section) {
        throw new Error('Section not found');
      }

      const exportData = {
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        section: options?.minify ? JSON.stringify(section) : section,
      };

      return exportData;
    },

    importReusableComponent: async (data: any, options?: TemplateImportOptions) => {
      const { validateReusableComponent } = get();
      const validation = validateReusableComponent(data);

      if (!validation.valid) {
        throw new Error(
          `Component validation failed: ${validation.errors.map((e) => e.message).join(', ')}`
        );
      }

      const component: ReusableComponent = {
        ...data,
        metadata: {
          ...data.metadata,
          id: options?.preserveIds ? data.metadata.id : crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };

      get().addReusableComponent(component);
      return component;
    },

    exportReusableComponent: async (id: ReusableComponentId, options?: TemplateExportOptions) => {
      const component = get().getReusableComponent(id);
      if (!component) {
        throw new Error('Reusable component not found');
      }

      const exportData = {
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        component: options?.minify ? JSON.stringify(component) : component,
      };

      return exportData;
    },

    // Validation operations
    validateTemplate: (template: Template): TemplateValidationResult => {
      const errors = [];
      const warnings = [];

      // Validate metadata
      if (!template.metadata.id) {
        errors.push({
          code: 'MISSING_ID',
          message: 'Template metadata is missing required field: id',
          severity: 'error' as const,
        });
      }

      if (!template.metadata.name) {
        errors.push({
          code: 'MISSING_NAME',
          message: 'Template metadata is missing required field: name',
          severity: 'error' as const,
        });
      }

      if (!template.metadata.category) {
        errors.push({
          code: 'MISSING_CATEGORY',
          message: 'Template metadata is missing required field: category',
          severity: 'error' as const,
        });
      }

      // Validate content
      if (!template.content) {
        errors.push({
          code: 'MISSING_CONTENT',
          message: 'Template is missing required field: content',
          severity: 'error' as const,
        });
      } else {
        if (!template.content.pages || template.content.pages.length === 0) {
          errors.push({
            code: 'NO_PAGES',
            message: 'Template content must have at least one page',
            severity: 'error' as const,
          });
        }

        if (!template.content.theme) {
          warnings.push({
            code: 'NO_THEME',
            message: 'Template content does not include a theme',
            severity: 'warning' as const,
          });
        }
      }

      return {
        valid: errors.length === 0,
        errors,
        warnings,
      };
    },

    validateSection: (section: Section): TemplateValidationResult => {
      const errors = [];
      const warnings = [];

      // Validate metadata
      if (!section.metadata.id) {
        errors.push({
          code: 'MISSING_ID',
          message: 'Section metadata is missing required field: id',
          severity: 'error' as const,
        });
      }

      if (!section.metadata.name) {
        errors.push({
          code: 'MISSING_NAME',
          message: 'Section metadata is missing required field: name',
          severity: 'error' as const,
        });
      }

      // Validate content
      if (!section.content) {
        errors.push({
          code: 'MISSING_CONTENT',
          message: 'Section is missing required field: content',
          severity: 'error' as const,
        });
      } else if (!section.content.components || section.content.components.length === 0) {
        warnings.push({
          code: 'NO_COMPONENTS',
          message: 'Section content does not include any components',
          severity: 'warning' as const,
        });
      }

      return {
        valid: errors.length === 0,
        errors,
        warnings,
      };
    },

    validateReusableComponent: (component: ReusableComponent): TemplateValidationResult => {
      const errors = [];
      const warnings = [];

      // Validate metadata
      if (!component.metadata.id) {
        errors.push({
          code: 'MISSING_ID',
          message: 'Component metadata is missing required field: id',
          severity: 'error' as const,
        });
      }

      if (!component.metadata.name) {
        errors.push({
          code: 'MISSING_NAME',
          message: 'Component metadata is missing required field: name',
          severity: 'error' as const,
        });
      }

      // Validate content
      if (!component.content) {
        errors.push({
          code: 'MISSING_CONTENT',
          message: 'Component is missing required field: content',
          severity: 'error' as const,
        });
      }

      return {
        valid: errors.length === 0,
        errors,
        warnings,
      };
    },

    // Preview operations
    generateTemplatePreview: async (template: Template): Promise<string> => {
      // In a real implementation, this would generate a screenshot or HTML preview
      // For now, we'll return a placeholder URL
      return template.metadata.thumbnailUrl || '';
    },

    generateSectionPreview: async (section: Section): Promise<string> => {
      // In a real implementation, this would generate a screenshot or HTML preview
      // For now, we'll return a placeholder URL
      return section.metadata.thumbnailUrl || '';
    },

    generateComponentPreview: async (component: ReusableComponent): Promise<string> => {
      // In a real implementation, this would generate a screenshot or HTML preview
      // For now, we'll return a placeholder URL
      return component.metadata.thumbnailUrl || '';
    },
  }))
);
