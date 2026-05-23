/**
 * Example Sections
 *
 * This file contains example sections demonstrating the section system.
 */

import type { Section } from '../types';

/**
 * Example Hero Section
 */
export const exampleHeroSection: Section = {
  metadata: {
    id: 'section-hero-001',
    name: 'Modern Hero Section',
    description: 'A modern hero section with heading, subheading, and CTA button',
    category: 'landing-page',
    tags: ['hero', 'cta', 'modern', 'responsive'],
    version: '1.0.0',
    author: 'Template Author',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    thumbnailUrl: '/sections/hero-001/thumbnail.png',
    previewUrls: [
      '/sections/hero-001/preview-desktop.png',
      '/sections/hero-001/preview-mobile.png',
    ],
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
            id: 'hero-content-001',
            type: 'Flex',
            props: {
              direction: 'column',
              align: 'center',
              justify: 'center',
              gap: '1.5rem',
            },
            styles: {
              minHeight: '60vh',
              textAlign: 'center',
            },
            children: [
              {
                id: 'hero-badge-001',
                type: 'Container',
                props: {
                  className: 'hero-badge',
                },
                styles: {
                  display: 'inline-block',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#3B82F6',
                  color: '#ffffff',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                },
                children: [
                  {
                    id: 'hero-badge-text-001',
                    type: 'Text',
                    props: {
                      text: 'New Feature Available',
                    },
                    styles: {},
                    children: [],
                  },
                ],
              },
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
                  color: '#1F2937',
                },
                children: [],
              },
              {
                id: 'hero-subheading-001',
                type: 'Text',
                props: {
                  text: 'Create stunning websites and applications with our powerful visual builder. No coding required.',
                },
                styles: {
                  fontSize: '1.25rem',
                  lineHeight: 1.6,
                  color: '#6B7280',
                  maxWidth: '600px',
                },
                children: [],
              },
              {
                id: 'hero-cta-group-001',
                type: 'Flex',
                props: {
                  direction: 'row',
                  align: 'center',
                  gap: '1rem',
                },
                styles: {
                  marginTop: '1rem',
                },
                children: [
                  {
                    id: 'hero-cta-primary-001',
                    type: 'Button',
                    props: {
                      text: 'Get Started Free',
                      variant: 'primary',
                    },
                    styles: {
                      padding: '0.75rem 2rem',
                      fontSize: '1.125rem',
                      fontWeight: 600,
                      backgroundColor: '#3B82F6',
                      color: '#ffffff',
                      borderRadius: '0.5rem',
                      border: 'none',
                      cursor: 'pointer',
                    },
                    children: [],
                  },
                  {
                    id: 'hero-cta-secondary-001',
                    type: 'Button',
                    props: {
                      text: 'Watch Demo',
                      variant: 'secondary',
                    },
                    styles: {
                      padding: '0.75rem 2rem',
                      fontSize: '1.125rem',
                      fontWeight: 600,
                      backgroundColor: 'transparent',
                      color: '#3B82F6',
                      borderRadius: '0.5rem',
                      border: '2px solid #3B82F6',
                      cursor: 'pointer',
                    },
                    children: [],
                  },
                ],
              },
              {
                id: 'hero-trust-001',
                type: 'Container',
                props: {
                  className: 'hero-trust',
                },
                styles: {
                  marginTop: '3rem',
                },
                children: [
                  {
                    id: 'hero-trust-text-001',
                    type: 'Text',
                    props: {
                      text: 'Trusted by 10,000+ companies worldwide',
                    },
                    styles: {
                      fontSize: '0.875rem',
                      color: '#9CA3AF',
                      marginBottom: '1rem',
                    },
                    children: [],
                  },
                  {
                    id: 'hero-logos-001',
                    type: 'Flex',
                    props: {
                      direction: 'row',
                      align: 'center',
                      gap: '2rem',
                    },
                    styles: {
                      flexWrap: 'wrap',
                      justifyContent: 'center',
                    },
                    children: [
                      {
                        id: 'hero-logo-001',
                        type: 'Image',
                        props: {
                          src: '/logos/company1.svg',
                          alt: 'Company 1',
                        },
                        styles: {
                          height: '2rem',
                          opacity: 0.5,
                        },
                        children: [],
                      },
                      {
                        id: 'hero-logo-002',
                        type: 'Image',
                        props: {
                          src: '/logos/company2.svg',
                          alt: 'Company 2',
                        },
                        styles: {
                          height: '2rem',
                          opacity: 0.5,
                        },
                        children: [],
                      },
                      {
                        id: 'hero-logo-003',
                        type: 'Image',
                        props: {
                          src: '/logos/company3.svg',
                          alt: 'Company 3',
                        },
                        styles: {
                          height: '2rem',
                          opacity: 0.5,
                        },
                        children: [],
                      },
                      {
                        id: 'hero-logo-004',
                        type: 'Image',
                        props: {
                          src: '/logos/company4.svg',
                          alt: 'Company 4',
                        },
                        styles: {
                          height: '2rem',
                          opacity: 0.5,
                        },
                        children: [],
                      },
                      {
                        id: 'hero-logo-005',
                        type: 'Image',
                        props: {
                          src: '/logos/company5.svg',
                          alt: 'Company 5',
                        },
                        styles: {
                          height: '2rem',
                          opacity: 0.5,
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
      },
    ],
    styles: {
      backgroundColor: '#ffffff',
    },
  },
};

/**
 * Example Features Section
 */
export const exampleFeaturesSection: Section = {
  metadata: {
    id: 'section-features-001',
    name: 'Features Grid Section',
    description: 'A features section with grid layout and feature cards',
    category: 'landing-page',
    tags: ['features', 'grid', 'modern', 'responsive'],
    version: '1.0.0',
    author: 'Template Author',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    thumbnailUrl: '/sections/features-001/thumbnail.png',
    previewUrls: [
      '/sections/features-001/preview-desktop.png',
      '/sections/features-001/preview-mobile.png',
    ],
    featured: true,
    popularity: 88,
    rating: 4.6,
    ratingCount: 72,
    downloads: 2800,
    pricingModel: 'free',
    status: 'published',
  },
  content: {
    components: [
      {
        id: 'features-container-001',
        type: 'Container',
        props: {
          className: 'features-container',
        },
        styles: {
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '5rem 1.5rem',
        },
        children: [
          {
            id: 'features-header-001',
            type: 'Container',
            props: {
              className: 'features-header',
            },
            styles: {
              textAlign: 'center',
              marginBottom: '4rem',
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
                  color: '#1F2937',
                  marginBottom: '1rem',
                },
                children: [],
              },
              {
                id: 'features-subheading-001',
                type: 'Text',
                props: {
                  text: 'Everything you need to build amazing products',
                },
                styles: {
                  fontSize: '1.25rem',
                  color: '#6B7280',
                  maxWidth: '600px',
                  margin: '0 auto',
                },
                children: [],
              },
            ],
          },
          {
            id: 'features-grid-001',
            type: 'Grid',
            props: {
              columns: 3,
              gap: '2rem',
            },
            styles: {},
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
                  borderRadius: '0.75rem',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                },
                children: [
                  {
                    id: 'feature-icon-001',
                    type: 'Container',
                    props: {
                      className: 'feature-icon',
                    },
                    styles: {
                      width: '3rem',
                      height: '3rem',
                      backgroundColor: '#3B82F6',
                      borderRadius: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1.5rem',
                    },
                    children: [
                      {
                        id: 'feature-icon-svg-001',
                        type: 'Icon',
                        props: {
                          name: 'zap',
                          size: 24,
                          color: '#ffffff',
                        },
                        styles: {},
                        children: [],
                      },
                    ],
                  },
                  {
                    id: 'feature-title-001',
                    type: 'Heading',
                    props: {
                      text: 'Lightning Fast',
                      level: 3,
                    },
                    styles: {
                      fontSize: '1.25rem',
                      fontWeight: 600,
                      color: '#1F2937',
                      marginBottom: '0.75rem',
                    },
                    children: [],
                  },
                  {
                    id: 'feature-description-001',
                    type: 'Text',
                    props: {
                      text: 'Optimized for performance with lightning-fast load times and smooth interactions.',
                    },
                    styles: {
                      fontSize: '1rem',
                      lineHeight: 1.6,
                      color: '#6B7280',
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
                  borderRadius: '0.75rem',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                },
                children: [
                  {
                    id: 'feature-icon-002',
                    type: 'Container',
                    props: {
                      className: 'feature-icon',
                    },
                    styles: {
                      width: '3rem',
                      height: '3rem',
                      backgroundColor: '#10B981',
                      borderRadius: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1.5rem',
                    },
                    children: [
                      {
                        id: 'feature-icon-svg-002',
                        type: 'Icon',
                        props: {
                          name: 'shield',
                          size: 24,
                          color: '#ffffff',
                        },
                        styles: {},
                        children: [],
                      },
                    ],
                  },
                  {
                    id: 'feature-title-002',
                    type: 'Heading',
                    props: {
                      text: 'Secure & Reliable',
                      level: 3,
                    },
                    styles: {
                      fontSize: '1.25rem',
                      fontWeight: 600,
                      color: '#1F2937',
                      marginBottom: '0.75rem',
                    },
                    children: [],
                  },
                  {
                    id: 'feature-description-002',
                    type: 'Text',
                    props: {
                      text: 'Built with security best practices and reliable infrastructure you can trust.',
                    },
                    styles: {
                      fontSize: '1rem',
                      lineHeight: 1.6,
                      color: '#6B7280',
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
                  borderRadius: '0.75rem',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                },
                children: [
                  {
                    id: 'feature-icon-003',
                    type: 'Container',
                    props: {
                      className: 'feature-icon',
                    },
                    styles: {
                      width: '3rem',
                      height: '3rem',
                      backgroundColor: '#8B5CF6',
                      borderRadius: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1.5rem',
                    },
                    children: [
                      {
                        id: 'feature-icon-svg-003',
                        type: 'Icon',
                        props: {
                          name: 'smartphone',
                          size: 24,
                          color: '#ffffff',
                        },
                        styles: {},
                        children: [],
                      },
                    ],
                  },
                  {
                    id: 'feature-title-003',
                    type: 'Heading',
                    props: {
                      text: 'Mobile First',
                      level: 3,
                    },
                    styles: {
                      fontSize: '1.25rem',
                      fontWeight: 600,
                      color: '#1F2937',
                      marginBottom: '0.75rem',
                    },
                    children: [],
                  },
                  {
                    id: 'feature-description-003',
                    type: 'Text',
                    props: {
                      text: 'Responsive design that works perfectly on all devices and screen sizes.',
                    },
                    styles: {
                      fontSize: '1rem',
                      lineHeight: 1.6,
                      color: '#6B7280',
                    },
                    children: [],
                  },
                ],
              },
              {
                id: 'feature-card-004',
                type: 'Container',
                props: {
                  className: 'feature-card',
                },
                styles: {
                  padding: '2rem',
                  backgroundColor: '#ffffff',
                  borderRadius: '0.75rem',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                },
                children: [
                  {
                    id: 'feature-icon-004',
                    type: 'Container',
                    props: {
                      className: 'feature-icon',
                    },
                    styles: {
                      width: '3rem',
                      height: '3rem',
                      backgroundColor: '#F59E0B',
                      borderRadius: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1.5rem',
                    },
                    children: [
                      {
                        id: 'feature-icon-svg-004',
                        type: 'Icon',
                        props: {
                          name: 'layout',
                          size: 24,
                          color: '#ffffff',
                        },
                        styles: {},
                        children: [],
                      },
                    ],
                  },
                  {
                    id: 'feature-title-004',
                    type: 'Heading',
                    props: {
                      text: 'Flexible Layouts',
                      level: 3,
                    },
                    styles: {
                      fontSize: '1.25rem',
                      fontWeight: 600,
                      color: '#1F2937',
                      marginBottom: '0.75rem',
                    },
                    children: [],
                  },
                  {
                    id: 'feature-description-004',
                    type: 'Text',
                    props: {
                      text: 'Create any layout you can imagine with our flexible grid and flexbox system.',
                    },
                    styles: {
                      fontSize: '1rem',
                      lineHeight: 1.6,
                      color: '#6B7280',
                    },
                    children: [],
                  },
                ],
              },
              {
                id: 'feature-card-005',
                type: 'Container',
                props: {
                  className: 'feature-card',
                },
                styles: {
                  padding: '2rem',
                  backgroundColor: '#ffffff',
                  borderRadius: '0.75rem',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                },
                children: [
                  {
                    id: 'feature-icon-005',
                    type: 'Container',
                    props: {
                      className: 'feature-icon',
                    },
                    styles: {
                      width: '3rem',
                      height: '3rem',
                      backgroundColor: '#EF4444',
                      borderRadius: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1.5rem',
                    },
                    children: [
                      {
                        id: 'feature-icon-svg-005',
                        type: 'Icon',
                        props: {
                          name: 'code',
                          size: 24,
                          color: '#ffffff',
                        },
                        styles: {},
                        children: [],
                      },
                    ],
                  },
                  {
                    id: 'feature-title-005',
                    type: 'Heading',
                    props: {
                      text: 'Developer Friendly',
                      level: 3,
                    },
                    styles: {
                      fontSize: '1.25rem',
                      fontWeight: 600,
                      color: '#1F2937',
                      marginBottom: '0.75rem',
                    },
                    children: [],
                  },
                  {
                    id: 'feature-description-005',
                    type: 'Text',
                    props: {
                      text: 'Export clean, production-ready code that developers love to work with.',
                    },
                    styles: {
                      fontSize: '1rem',
                      lineHeight: 1.6,
                      color: '#6B7280',
                    },
                    children: [],
                  },
                ],
              },
              {
                id: 'feature-card-006',
                type: 'Container',
                props: {
                  className: 'feature-card',
                },
                styles: {
                  padding: '2rem',
                  backgroundColor: '#ffffff',
                  borderRadius: '0.75rem',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                },
                children: [
                  {
                    id: 'feature-icon-006',
                    type: 'Container',
                    props: {
                      className: 'feature-icon',
                    },
                    styles: {
                      width: '3rem',
                      height: '3rem',
                      backgroundColor: '#6366F1',
                      borderRadius: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1.5rem',
                    },
                    children: [
                      {
                        id: 'feature-icon-svg-006',
                        type: 'Icon',
                        props: {
                          name: 'users',
                          size: 24,
                          color: '#ffffff',
                        },
                        styles: {},
                        children: [],
                      },
                    ],
                  },
                  {
                    id: 'feature-title-006',
                    type: 'Heading',
                    props: {
                      text: 'Team Collaboration',
                      level: 3,
                    },
                    styles: {
                      fontSize: '1.25rem',
                      fontWeight: 600,
                      color: '#1F2937',
                      marginBottom: '0.75rem',
                    },
                    children: [],
                  },
                  {
                    id: 'feature-description-006',
                    type: 'Text',
                    props: {
                      text: 'Work together in real-time with your team to build amazing products faster.',
                    },
                    styles: {
                      fontSize: '1rem',
                      lineHeight: 1.6,
                      color: '#6B7280',
                    },
                    children: [],
                  },
                ],
              },
            ],
          },
        ],
        styles: {
          backgroundColor: '#F9FAFB',
        },
      },
    ],
  },
};
