/**
 * Core Types for Templates and Marketplace
 *
 * This module defines all types related to templates, sections, components,
 * and marketplace functionality.
 */

import { ComponentNode, Project, Page, Theme, Asset } from '@wysiwyg/core';

/**
 * Template identifier type
 */
export type TemplateId = string;

/**
 * Section identifier type
 */
export type SectionId = string;

/**
 * Reusable component identifier type
 */
export type ReusableComponentId = string;

/**
 * Template categories
 */
export type TemplateCategory =
  | 'landing-page'
  | 'portfolio'
  | 'ecommerce'
  | 'blog'
  | 'business'
  | 'portfolio'
  | 'event'
  | 'product'
  | 'service'
  | 'personal'
  | 'corporate'
  | 'startup'
  | 'saas'
  | 'coming-soon'
  | 'error-page'
  | 'other';

/**
 * Template pricing model
 */
export type TemplatePricingModel = 'free' | 'premium' | 'enterprise';

/**
 * Template status
 */
export type TemplateStatus = 'draft' | 'published' | 'archived';

/**
 * Template metadata
 */
export interface TemplateMetadata {
  id: TemplateId;
  name: string;
  description: string;
  category: TemplateCategory;
  tags: string[];
  version: string;
  author: string;
  authorId?: string;
  createdAt: string;
  updatedAt: string;
  thumbnailUrl?: string;
  previewUrls?: string[];
  featured?: boolean;
  popularity?: number;
  rating?: number;
  ratingCount?: number;
  downloads?: number;
  pricingModel?: TemplatePricingModel;
  price?: number;
  currency?: string;
  status: TemplateStatus;
  customData?: Record<string, any>;
}

/**
 * Template definition
 */
export interface Template {
  metadata: TemplateMetadata;
  content: TemplateContent;
  dependencies?: TemplateDependencies;
}

/**
 * Template content
 */
export interface TemplateContent {
  pages: Page[];
  theme: Theme;
  assets: Asset[];
  globalStyles?: string;
  customScripts?: string[];
}

/**
 * Template dependencies
 */
export interface TemplateDependencies {
  components?: string[];
  plugins?: string[];
  externalLibraries?: ExternalLibrary[];
}

/**
 * External library dependency
 */
export interface ExternalLibrary {
  name: string;
  version: string;
  type: 'script' | 'style';
  url?: string;
  cdn?: string;
}

/**
 * Section metadata
 */
export interface SectionMetadata {
  id: SectionId;
  name: string;
  description: string;
  category: TemplateCategory;
  tags: string[];
  version: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  thumbnailUrl?: string;
  previewUrls?: string[];
  featured?: boolean;
  popularity?: number;
  rating?: number;
  ratingCount?: number;
  downloads?: number;
  pricingModel?: TemplatePricingModel;
  price?: number;
  currency?: string;
  status: TemplateStatus;
  customData?: Record<string, any>;
}

/**
 * Section definition
 */
export interface Section {
  metadata: SectionMetadata;
  content: SectionContent;
  dependencies?: TemplateDependencies;
}

/**
 * Section content
 */
export interface SectionContent {
  components: ComponentNode[];
  styles?: Record<string, any>;
  customStyles?: string;
}

/**
 * Reusable component metadata
 */
export interface ReusableComponentMetadata {
  id: ReusableComponentId;
  name: string;
  description: string;
  category: string;
  tags: string[];
  version: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  thumbnailUrl?: string;
  previewUrls?: string[];
  featured?: boolean;
  popularity?: number;
  rating?: number;
  ratingCount?: number;
  downloads?: number;
  pricingModel?: TemplatePricingModel;
  price?: number;
  currency?: string;
  status: TemplateStatus;
  customData?: Record<string, any>;
}

/**
 * Reusable component definition
 */
export interface ReusableComponent {
  metadata: ReusableComponentMetadata;
  content: ComponentNode;
  dependencies?: TemplateDependencies;
}

/**
 * Marketplace configuration
 */
export interface MarketplaceConfig {
  enabled: boolean;
  apiUrl: string;
  apiKey?: string;
  cacheEnabled?: boolean;
  cacheDuration?: number;
  maxCacheSize?: number;
}

/**
 * Marketplace item type
 */
export type MarketplaceItemType = 'template' | 'section' | 'component';

/**
 * Marketplace item
 */
export interface MarketplaceItem {
  id: string;
  type: MarketplaceItemType;
  metadata: TemplateMetadata | SectionMetadata | ReusableComponentMetadata;
  previewUrl?: string;
  downloadUrl?: string;
  documentationUrl?: string;
  license?: string;
  compatibility?: string[];
}

/**
 * Marketplace filters
 */
export interface MarketplaceFilters {
  category?: TemplateCategory;
  pricingModel?: TemplatePricingModel;
  tags?: string[];
  search?: string;
  minRating?: number;
  featured?: boolean;
  sortBy?: 'popularity' | 'rating' | 'newest' | 'downloads';
  page?: number;
  limit?: number;
}

/**
 * Marketplace response
 */
export interface MarketplaceResponse<T = MarketplaceItem> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

/**
 * Template import options
 */
export interface TemplateImportOptions {
  preserveIds?: boolean;
  mergeTheme?: boolean;
  mergeAssets?: boolean;
  overwriteExisting?: boolean;
  includeDependencies?: boolean;
}

/**
 * Template export options
 */
export interface TemplateExportOptions {
  format: 'json' | 'zip';
  includeAssets?: boolean;
  includeTheme?: boolean;
  minify?: boolean;
  compress?: boolean;
}

/**
 * Template validation result
 */
export interface TemplateValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

/**
 * Validation error
 */
export interface ValidationError {
  code: string;
  message: string;
  path?: string;
  severity: 'error';
}

/**
 * Validation warning
 */
export interface ValidationWarning {
  code: string;
  message: string;
  path?: string;
  severity: 'warning';
}

/**
 * Template store state
 */
export interface TemplateStoreState {
  templates: Map<TemplateId, Template>;
  sections: Map<SectionId, Section>;
  reusableComponents: Map<ReusableComponentId, ReusableComponent>;
  categories: TemplateCategory[];
  marketplaceItems: Map<string, MarketplaceItem>;
  isLoading: boolean;
  error: string | null;
}

/**
 * Template store actions
 */
export interface TemplateStoreActions {
  // Template operations
  addTemplate: (template: Template) => void;
  updateTemplate: (id: TemplateId, template: Partial<Template>) => void;
  deleteTemplate: (id: TemplateId) => void;
  getTemplate: (id: TemplateId) => Template | undefined;
  getAllTemplates: () => Template[];
  getTemplatesByCategory: (category: TemplateCategory) => Template[];
  searchTemplates: (query: string) => Template[];

  // Section operations
  addSection: (section: Section) => void;
  updateSection: (id: SectionId, section: Partial<Section>) => void;
  deleteSection: (id: SectionId) => void;
  getSection: (id: SectionId) => Section | undefined;
  getAllSections: () => Section[];
  getSectionsByCategory: (category: TemplateCategory) => Section[];
  searchSections: (query: string) => Section[];

  // Reusable component operations
  addReusableComponent: (component: ReusableComponent) => void;
  updateReusableComponent: (id: ReusableComponentId, component: Partial<ReusableComponent>) => void;
  deleteReusableComponent: (id: ReusableComponentId) => void;
  getReusableComponent: (id: ReusableComponentId) => ReusableComponent | undefined;
  getAllReusableComponents: () => ReusableComponent[];
  searchReusableComponents: (query: string) => ReusableComponent[];

  // Category operations
  addCategory: (category: TemplateCategory) => void;
  removeCategory: (category: TemplateCategory) => void;
  getAllCategories: () => TemplateCategory[];

  // Marketplace operations
  loadMarketplaceItems: (filters?: MarketplaceFilters) => Promise<void>;
  downloadMarketplaceItem: (itemId: string) => Promise<Template | Section | ReusableComponent>;
  uploadToMarketplace: (item: Template | Section | ReusableComponent) => Promise<void>;

  // Import/Export operations
  importTemplate: (data: any, options?: TemplateImportOptions) => Promise<Template>;
  exportTemplate: (id: TemplateId, options?: TemplateExportOptions) => Promise<any>;
  importSection: (data: any, options?: TemplateImportOptions) => Promise<Section>;
  exportSection: (id: SectionId, options?: TemplateExportOptions) => Promise<any>;
  importReusableComponent: (
    data: any,
    options?: TemplateImportOptions
  ) => Promise<ReusableComponent>;
  exportReusableComponent: (
    id: ReusableComponentId,
    options?: TemplateExportOptions
  ) => Promise<any>;

  // Validation operations
  validateTemplate: (template: Template) => TemplateValidationResult;
  validateSection: (section: Section) => TemplateValidationResult;
  validateReusableComponent: (component: ReusableComponent) => TemplateValidationResult;

  // Preview operations
  generateTemplatePreview: (template: Template) => Promise<string>;
  generateSectionPreview: (section: Section) => Promise<string>;
  generateComponentPreview: (component: ReusableComponent) => Promise<string>;
}

/**
 * Combined template store
 */
export type TemplateStore = TemplateStoreState & TemplateStoreActions;
