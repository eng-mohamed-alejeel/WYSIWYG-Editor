/**
 * Example Reusable Components
 *
 * This file contains example reusable components demonstrating the component system.
 */

import type { ReusableComponent } from '../types';

/**
 * Example CTA Button Component
 */
export const exampleCTAButtonComponent: ReusableComponent = {
  metadata: {
    id: 'component-cta-button-001',
    name: 'Modern CTA Button',
    description: 'A modern call-to-action button with hover effects and multiple variants',
    category: 'forms',
    tags: ['button', 'cta', 'interactive', 'modern'],
    version: '1.0.0',
    author: 'Template Author',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    thumbnailUrl: '/components/cta-button-001/thumbnail.png',
    previewUrls: ['/components/cta-button-001/preview.png'],
    featured: true,
    popularity: 92,
    rating: 4.8,
    ratingCount: 95,
    downloads: 4200,
    pricingModel: 'free',
    status: 'published',
  },
  content: {
    id: 'cta-button-001',
    type: 'Button',
    props: {
      text: 'Get Started',
      variant: 'primary',
      size: 'large',
    },
    styles: {
      padding: '0.875rem 2.5rem',
      fontSize: '1.125rem',
      fontWeight: 600,
      backgroundColor: '#3B82F6',
      color: '#ffffff',
      borderRadius: '0.5rem',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    responsiveStyles: {
      mobile: {
        padding: '0.75rem 2rem',
        fontSize: '1rem',
      },
      tablet: {
        padding: '0.875rem 2.25rem',
        fontSize: '1.125rem',
      },
      desktop: {
        padding: '0.875rem 2.5rem',
        fontSize: '1.125rem',
      },
    },
    children: [],
  },
};

/**
 * Example Feature Card Component
 */
export const exampleFeatureCardComponent: ReusableComponent = {
  metadata: {
    id: 'component-feature-card-001',
    name: 'Feature Card',
    description: 'A feature card with icon, title, and description',
    category: 'layout',
    tags: ['card', 'feature', 'modern', 'responsive'],
    version: '1.0.0',
    author: 'Template Author',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    thumbnailUrl: '/components/feature-card-001/thumbnail.png',
    previewUrls: ['/components/feature-card-001/preview.png'],
    featured: true,
    popularity: 89,
    rating: 4.7,
    ratingCount: 88,
    downloads: 3800,
    pricingModel: 'free',
    status: 'published',
  },
  content: {
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
      transition: 'all 0.3s ease',
    },
    children: [
      {
        id: 'feature-icon-001',
        type: 'Container',
        props: {
          className: 'feature-icon',
        },
        styles: {
          width: '3.5rem',
          height: '3.5rem',
          backgroundColor: '#EFF6FF',
          borderRadius: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.25rem',
        },
        children: [
          {
            id: 'icon-001',
            type: 'Icon',
            props: {
              name: 'zap',
              size: 24,
              color: '#3B82F6',
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
};

/**
 * Example Testimonial Card Component
 */
export const exampleTestimonialCardComponent: ReusableComponent = {
  metadata: {
    id: 'component-testimonial-card-001',
    name: 'Testimonial Card',
    description: 'A testimonial card with avatar, name, and quote',
    category: 'advanced',
    tags: ['testimonial', 'card', 'review', 'modern'],
    version: '1.0.0',
    author: 'Template Author',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    thumbnailUrl: '/components/testimonial-card-001/thumbnail.png',
    previewUrls: ['/components/testimonial-card-001/preview.png'],
    featured: true,
    popularity: 87,
    rating: 4.6,
    ratingCount: 76,
    downloads: 3200,
    pricingModel: 'free',
    status: 'published',
  },
  content: {
    id: 'testimonial-card-001',
    type: 'Container',
    props: {
      className: 'testimonial-card',
    },
    styles: {
      padding: '2rem',
      backgroundColor: '#ffffff',
      borderRadius: '0.75rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    },
    children: [
      {
        id: 'testimonial-quote-001',
        type: 'Container',
        props: {
          className: 'testimonial-quote',
        },
        styles: {
          marginBottom: '1.5rem',
        },
        children: [
          {
            id: 'quote-icon-001',
            type: 'Text',
            props: {
              text: '"',
            },
            styles: {
              fontSize: '4rem',
              fontWeight: 700,
              color: '#3B82F6',
              lineHeight: 1,
              opacity: 0.3,
            },
            children: [],
          },
          {
            id: 'quote-text-001',
            type: 'Text',
            props: {
              text: 'This platform has completely transformed how we build products. The visual builder is intuitive and powerful.',
            },
            styles: {
              fontSize: '1.125rem',
              lineHeight: 1.7,
              color: '#374151',
              marginTop: '-2rem',
              paddingLeft: '1rem',
            },
            children: [],
          },
        ],
      },
      {
        id: 'testimonial-author-001',
        type: 'Flex',
        props: {
          direction: 'row',
          align: 'center',
          gap: '1rem',
        },
        styles: {},
        children: [
          {
            id: 'author-avatar-001',
            type: 'Image',
            props: {
              src: '/avatars/john-doe.jpg',
              alt: 'John Doe',
            },
            styles: {
              width: '3rem',
              height: '3rem',
              borderRadius: '50%',
              objectFit: 'cover',
            },
            children: [],
          },
          {
            id: 'author-info-001',
            type: 'Container',
            props: {
              className: 'author-info',
            },
            styles: {},
            children: [
              {
                id: 'author-name-001',
                type: 'Text',
                props: {
                  text: 'John Doe',
                },
                styles: {
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#1F2937',
                },
                children: [],
              },
              {
                id: 'author-title-001',
                type: 'Text',
                props: {
                  text: 'CEO, Tech Company',
                },
                styles: {
                  fontSize: '0.875rem',
                  color: '#6B7280',
                },
                children: [],
              },
            ],
          },
        ],
      },
    ],
  },
};

/**
 * Example Pricing Card Component
 */
export const examplePricingCardComponent: ReusableComponent = {
  metadata: {
    id: 'component-pricing-card-001',
    name: 'Pricing Card',
    description: 'A pricing card with features list and CTA button',
    category: 'ecommerce',
    tags: ['pricing', 'card', 'ecommerce', 'modern'],
    version: '1.0.0',
    author: 'Template Author',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    thumbnailUrl: '/components/pricing-card-001/thumbnail.png',
    previewUrls: ['/components/pricing-card-001/preview.png'],
    featured: true,
    popularity: 91,
    rating: 4.7,
    ratingCount: 92,
    downloads: 4100,
    pricingModel: 'free',
    status: 'published',
  },
  content: {
    id: 'pricing-card-001',
    type: 'Container',
    props: {
      className: 'pricing-card',
    },
    styles: {
      padding: '2.5rem',
      backgroundColor: '#ffffff',
      borderRadius: '1rem',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      border: '2px solid #E5E7EB',
    },
    children: [
      {
        id: 'pricing-header-001',
        type: 'Container',
        props: {
          className: 'pricing-header',
        },
        styles: {
          textAlign: 'center',
          marginBottom: '2rem',
        },
        children: [
          {
            id: 'pricing-title-001',
            type: 'Heading',
            props: {
              text: 'Pro Plan',
              level: 3,
            },
            styles: {
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#1F2937',
              marginBottom: '0.5rem',
            },
            children: [],
          },
          {
            id: 'pricing-price-001',
            type: 'Container',
            props: {
              className: 'pricing-price',
            },
            styles: {
              marginBottom: '0.5rem',
            },
            children: [
              {
                id: 'price-currency-001',
                type: 'Text',
                props: {
                  text: '$',
                },
                styles: {
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  color: '#3B82F6',
                },
                children: [],
              },
              {
                id: 'price-amount-001',
                type: 'Text',
                props: {
                  text: '29',
                },
                styles: {
                  fontSize: '3.5rem',
                  fontWeight: 700,
                  color: '#3B82F6',
                  lineHeight: 1,
                },
                children: [],
              },
              {
                id: 'price-period-001',
                type: 'Text',
                props: {
                  text: '/month',
                },
                styles: {
                  fontSize: '1rem',
                  color: '#6B7280',
                },
                children: [],
              },
            ],
          },
          {
            id: 'pricing-description-001',
            type: 'Text',
            props: {
              text: 'Perfect for growing teams and businesses',
            },
            styles: {
              fontSize: '0.875rem',
              color: '#6B7280',
            },
            children: [],
          },
        ],
      },
      {
        id: 'pricing-features-001',
        type: 'Container',
        props: {
          className: 'pricing-features',
        },
        styles: {
          marginBottom: '2rem',
        },
        children: [
          {
            id: 'feature-item-001',
            type: 'Flex',
            props: {
              direction: 'row',
              align: 'center',
              gap: '0.75rem',
            },
            styles: {
              marginBottom: '1rem',
            },
            children: [
              {
                id: 'check-icon-001',
                type: 'Icon',
                props: {
                  name: 'check',
                  size: 20,
                  color: '#10B981',
                },
                styles: {},
                children: [],
              },
              {
                id: 'feature-text-001',
                type: 'Text',
                props: {
                  text: 'Unlimited projects',
                },
                styles: {
                  fontSize: '1rem',
                  color: '#374151',
                },
                children: [],
              },
            ],
          },
          {
            id: 'feature-item-002',
            type: 'Flex',
            props: {
              direction: 'row',
              align: 'center',
              gap: '0.75rem',
            },
            styles: {
              marginBottom: '1rem',
            },
            children: [
              {
                id: 'check-icon-002',
                type: 'Icon',
                props: {
                  name: 'check',
                  size: 20,
                  color: '#10B981',
                },
                styles: {},
                children: [],
              },
              {
                id: 'feature-text-002',
                type: 'Text',
                props: {
                  text: 'Advanced analytics',
                },
                styles: {
                  fontSize: '1rem',
                  color: '#374151',
                },
                children: [],
              },
            ],
          },
          {
            id: 'feature-item-003',
            type: 'Flex',
            props: {
              direction: 'row',
              align: 'center',
              gap: '0.75rem',
            },
            styles: {
              marginBottom: '1rem',
            },
            children: [
              {
                id: 'check-icon-003',
                type: 'Icon',
                props: {
                  name: 'check',
                  size: 20,
                  color: '#10B981',
                },
                styles: {},
                children: [],
              },
              {
                id: 'feature-text-003',
                type: 'Text',
                props: {
                  text: 'Priority support',
                },
                styles: {
                  fontSize: '1rem',
                  color: '#374151',
                },
                children: [],
              },
            ],
          },
          {
            id: 'feature-item-004',
            type: 'Flex',
            props: {
              direction: 'row',
              align: 'center',
              gap: '0.75rem',
            },
            styles: {
              marginBottom: '1rem',
            },
            children: [
              {
                id: 'check-icon-004',
                type: 'Icon',
                props: {
                  name: 'check',
                  size: 20,
                  color: '#10B981',
                },
                styles: {},
                children: [],
              },
              {
                id: 'feature-text-004',
                type: 'Text',
                props: {
                  text: 'Custom integrations',
                },
                styles: {
                  fontSize: '1rem',
                  color: '#374151',
                },
                children: [],
              },
            ],
          },
        ],
      },
      {
        id: 'pricing-cta-001',
        type: 'Button',
        props: {
          text: 'Get Started',
          variant: 'primary',
        },
        styles: {
          width: '100%',
          padding: '0.875rem',
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
    ],
  },
};
