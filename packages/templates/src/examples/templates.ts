/**
 * Example Templates
 *
 * This file contains example templates demonstrating the template system.
 */

import type { Template, Section, ReusableComponent } from '../types';

/**
 * Example Landing Page Template
 */
export const exampleLandingPageTemplate: Template = {
  metadata: {
    id: 'template-landing-page-001',
    name: 'Modern Landing Page',
    description:
      'A modern, responsive landing page template perfect for startups and SaaS products',
    category: 'landing-page',
    tags: ['modern', 'responsive', 'startup', 'saas', 'minimal'],
    version: '1.0.0',
    author: 'Template Author',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    thumbnailUrl: '/templates/landing-page-001/thumbnail.png',
    previewUrls: [
      '/templates/landing-page-001/preview-desktop.png',
      '/templates/landing-page-001/preview-mobile.png',
    ],
    featured: true,
    popularity: 95,
    rating: 4.8,
    ratingCount: 120,
    downloads: 5000,
    pricingModel: 'free',
    status: 'published',
  },
  content: {
    pages: [
      {
        id: 'page-home-001',
        name: 'Home',
        slug: 'home',
        components: [
          {
            id: 'hero-section-001',
            type: 'Section',
            props: {
              className: 'hero-section',
            },
            styles: {
              paddingTop: '80px',
              paddingBottom: '80px',
              backgroundColor: '#ffffff',
            },
            children: [
              {
                id: 'hero-heading-001',
                type: 'Heading',
                props: {
                  text: 'Build Amazing Products',
                  level: 1,
                },
                styles: {
                  fontSize: '3.5rem',
                  fontWeight: 700,
                  lineHeight: 1.2,
                  textAlign: 'center',
                },
                children: [],
              },
              {
                id: 'hero-subheading-001',
                type: 'Text',
                props: {
                  text: 'Create stunning websites and applications with our powerful visual builder',
                },
                styles: {
                  fontSize: '1.25rem',
                  lineHeight: 1.6,
                  textAlign: 'center',
                  marginTop: '1.5rem',
                },
                children: [],
              },
              {
                id: 'hero-cta-001',
                type: 'Button',
                props: {
                  text: 'Get Started',
                  variant: 'primary',
                },
                styles: {
                  marginTop: '2rem',
                  padding: '0.75rem 2rem',
                  fontSize: '1.125rem',
                },
                children: [],
              },
            ],
          },
          {
            id: 'features-section-001',
            type: 'Section',
            props: {
              className: 'features-section',
            },
            styles: {
              paddingTop: '80px',
              paddingBottom: '80px',
              backgroundColor: '#f9fafb',
            },
            children: [
              {
                id: 'features-heading-001',
                type: 'Heading',
                props: {
                  text: 'Powerful Features',
                  level: 2,
                },
                styles: {
                  fontSize: '2.5rem',
                  fontWeight: 700,
                  textAlign: 'center',
                  marginBottom: '3rem',
                },
                children: [],
              },
              {
                id: 'features-grid-001',
                type: 'Grid',
                props: {
                  columns: 3,
                  gap: '2rem',
                },
                children: [
                  {
                    id: 'feature-card-001',
                    type: 'Container',
                    props: {
                      className: 'feature-card',
                    },
                    styles: {
                      padding: '2rem',
                      backgroundColor: '#ffffff',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    },
                    children: [
                      {
                        id: 'feature-icon-001',
                        type: 'Icon',
                        props: {
                          name: 'zap',
                          size: 48,
                        },
                        styles: {
                          marginBottom: '1rem',
                        },
                        children: [],
                      },
                      {
                        id: 'feature-title-001',
                        type: 'Heading',
                        props: {
                          text: 'Lightning Fast',
                          level: 3,
                        },
                        styles: {
                          fontSize: '1.5rem',
                          fontWeight: 600,
                          marginBottom: '0.75rem',
                        },
                        children: [],
                      },
                      {
                        id: 'feature-description-001',
                        type: 'Text',
                        props: {
                          text: 'Optimized for performance with lightning-fast load times',
                        },
                        styles: {
                          fontSize: '1rem',
                          lineHeight: 1.6,
                        },
                        children: [],
                      },
                    ],
                  },
                  {
                    id: 'feature-card-002',
                    type: 'Container',
                    props: {
                      className: 'feature-card',
                    },
                    styles: {
                      padding: '2rem',
                      backgroundColor: '#ffffff',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    },
                    children: [
                      {
                        id: 'feature-icon-002',
                        type: 'Icon',
                        props: {
                          name: 'shield',
                          size: 48,
                        },
                        styles: {
                          marginBottom: '1rem',
                        },
                        children: [],
                      },
                      {
                        id: 'feature-title-002',
                        type: 'Heading',
                        props: {
                          text: 'Secure & Reliable',
                          level: 3,
                        },
                        styles: {
                          fontSize: '1.5rem',
                          fontWeight: 600,
                          marginBottom: '0.75rem',
                        },
                        children: [],
                      },
                      {
                        id: 'feature-description-002',
                        type: 'Text',
                        props: {
                          text: 'Built with security best practices and reliable infrastructure',
                        },
                        styles: {
                          fontSize: '1rem',
                          lineHeight: 1.6,
                        },
                        children: [],
                      },
                    ],
                  },
                  {
                    id: 'feature-card-003',
                    type: 'Container',
                    props: {
                      className: 'feature-card',
                    },
                    styles: {
                      padding: '2rem',
                      backgroundColor: '#ffffff',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    },
                    children: [
                      {
                        id: 'feature-icon-003',
                        type: 'Icon',
                        props: {
                          name: 'smartphone',
                          size: 48,
                        },
                        styles: {
                          marginBottom: '1rem',
                        },
                        children: [],
                      },
                      {
                        id: 'feature-title-003',
                        type: 'Heading',
                        props: {
                          text: 'Mobile First',
                          level: 3,
                        },
                        styles: {
                          fontSize: '1.5rem',
                          fontWeight: 600,
                          marginBottom: '0.75rem',
                        },
                        children: [],
                      },
                      {
                        id: 'feature-description-003',
                        type: 'Text',
                        props: {
                          text: 'Responsive design that works perfectly on all devices',
                        },
                        styles: {
                          fontSize: '1rem',
                          lineHeight: 1.6,
                        },
                        children: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
        metadata: {
          title: 'Modern Landing Page - Home',
          description: 'A modern landing page template for startups and SaaS products',
        },
        settings: {},
      },
    ],
    theme: {
      id: 'theme-landing-page-001',
      name: 'Modern Theme',
      colors: {
        primary: '#3B82F6',
        secondary: '#6366F1',
        accent: '#8B5CF6',
        background: '#FFFFFF',
        foreground: '#1F2937',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
      },
      typography: {
        fontFamily: {
          heading: 'Inter, system-ui, sans-serif',
          body: 'Inter, system-ui, sans-serif',
          mono: 'Fira Code, monospace',
        },
        fontSize: {
          xs: '0.75rem',
          sm: '0.875rem',
          base: '1rem',
          lg: '1.125rem',
          xl: '1.25rem',
          '2xl': '1.5rem',
          '3xl': '1.875rem',
          '4xl': '2.25rem',
        },
        fontWeight: {
          light: 300,
          normal: 400,
          medium: 500,
          semibold: 600,
          bold: 700,
        },
        lineHeight: {
          tight: 1.25,
          normal: 1.5,
          relaxed: 1.75,
        },
      },
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem',
      },
      borderRadius: {
        none: '0',
        sm: '0.125rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        full: '9999px',
      },
      shadows: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      },
      breakpoints: {
        mobile: '640px',
        tablet: '768px',
        desktop: '1024px',
        wide: '1280px',
      },
    },
    assets: [],
  },
  dependencies: {
    components: [],
    plugins: [],
    externalLibraries: [
      {
        name: 'inter-font',
        version: '4.0.0',
        type: 'style',
        url: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
      },
    ],
  },
};

/**
 * Example Hero Section
 */
export const exampleHeroSection: Section = {
  metadata: {
    id: 'section-hero-001',
    name: 'Modern Hero Section',
    description: 'A modern hero section with heading, subheading, and CTA button',
    category: 'landing-page',
    tags: ['hero', 'modern', 'cta'],
    version: '1.0.0',
    author: 'Template Author',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    thumbnailUrl: '/sections/hero-001/thumbnail.png',
    previewUrls: ['/sections/hero-001/preview.png'],
    featured: true,
    popularity: 90,
    rating: 4.7,
    ratingCount: 85,
    downloads: 3500,
    pricingModel: 'free',
    status: 'published',
  },
  content: {
    components: [
      {
        id: 'hero-container-001',
        type: 'Container',
        props: {
          className: 'hero-container',
        },
        styles: {
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1.5rem',
        },
        children: [
          {
            id: 'hero-heading-001',
            type: 'Heading',
            props: {
              text: 'Build Amazing Products',
              level: 1,
            },
            styles: {
              fontSize: '3.5rem',
              fontWeight: 700,
              lineHeight: 1.2,
              textAlign: 'center',
              marginBottom: '1.5rem',
            },
            children: [],
          },
          {
            id: 'hero-subheading-001',
            type: 'Text',
            props: {
              text: 'Create stunning websites and applications with our powerful visual builder',
            },
            styles: {
              fontSize: '1.25rem',
              lineHeight: 1.6,
              textAlign: 'center',
              marginBottom: '2rem',
            },
            children: [],
          },
          {
            id: 'hero-cta-001',
            type: 'Button',
            props: {
              text: 'Get Started',
              variant: 'primary',
            },
            styles: {
              padding: '0.75rem 2rem',
              fontSize: '1.125rem',
              display: 'block',
              margin: '0 auto',
            },
            children: [],
          },
        ],
      },
    ],
    styles: {
      paddingTop: '80px',
      paddingBottom: '80px',
      backgroundColor: '#ffffff',
    },
  },
  dependencies: {
    components: [],
    plugins: [],
    externalLibraries: [],
  },
};

/**
 * Example CTA Button Component
 */
export const exampleCTAButton: ReusableComponent = {
  metadata: {
    id: 'component-cta-button-001',
    name: 'Modern CTA Button',
    description: 'A modern call-to-action button with hover effects',
    category: 'forms',
    tags: ['button', 'cta', 'modern'],
    version: '1.0.0',
    author: 'Template Author',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    thumbnailUrl: '/components/cta-button-001/thumbnail.png',
    previewUrls: ['/components/cta-button-001/preview.png'],
    featured: false,
    popularity: 85,
    rating: 4.6,
    ratingCount: 65,
    downloads: 2500,
    pricingModel: 'free',
    status: 'published',
  },
  content: {
    id: 'cta-button-001',
    type: 'Button',
    props: {
      text: 'Get Started',
      variant: 'primary',
    },
    styles: {
      padding: '0.75rem 2rem',
      fontSize: '1.125rem',
      fontWeight: 600,
      backgroundColor: '#3B82F6',
      color: '#ffffff',
      border: 'none',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    responsiveStyles: {
      mobile: {
        padding: '0.625rem 1.5rem',
        fontSize: '1rem',
      },
    },
    children: [],
  },
  dependencies: {
    components: [],
    plugins: [],
    externalLibraries: [],
  },
};
