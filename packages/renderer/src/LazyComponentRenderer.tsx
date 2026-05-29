/**
 * Lazy Component Renderer
 *
 * This module provides lazy loading functionality for components.
 */

import React, { Suspense, memo, useEffect, useState, useRef } from 'react';
import { ComponentNode } from '@wysiwyg/core';
import { RendererContext } from './types';

interface LazyRendererProps {
  node: ComponentNode;
  context: RendererContext;
  renderComponent: (node: ComponentNode, context: RendererContext) => React.ReactNode;
  fallback?: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
}

// IntersectionObserverState removed (unused)

/**
 * Default loading fallback
 */
const DefaultLoadingFallback: React.FC = () => (
  <div
    style={{
      padding: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f5f5f5',
      minHeight: '100px',
    }}
  >
    <div
      style={{
        width: '40px',
        height: '40px',
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #3498db',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }}
    />
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

/**
 * Intersection Observer Hook
 * Detects when component comes into viewport
 */
function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  threshold: number = 0.1,
  rootMargin: string = '50px'
): boolean {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || hasIntersected) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          setHasIntersected(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [elementRef, threshold, rootMargin, hasIntersected]);

  return isIntersecting || hasIntersected;
}

/**
 * Lazy Component Renderer
 * Renders components only when they come into viewport
 */
export const LazyComponentRenderer: React.FC<LazyRendererProps> = memo(
  ({ node, context, renderComponent, fallback, threshold = 0.1, rootMargin = '50px' }) => {
    const elementRef = useRef<HTMLDivElement>(null);
    const isVisible = useIntersectionObserver(elementRef, threshold, rootMargin);
    const [shouldRender, setShouldRender] = useState(false);

    // Determine if component should be lazy loaded
    const shouldLazyLoad = context.mode !== 'export' && context.lazy !== false;

    useEffect(() => {
      if (isVisible && shouldLazyLoad) {
        setShouldRender(true);
      }
    }, [isVisible, shouldLazyLoad]);

    // Don't use lazy loading for export mode or when disabled
    if (!shouldLazyLoad) {
      return <>{renderComponent(node, context)}</>;
    }

    // Render placeholder when not visible
    if (!shouldRender) {
      return (
        <div ref={elementRef} style={{ minHeight: '50px' }}>
          {fallback ?? <DefaultLoadingFallback />}
        </div>
      );
    }

    // Render actual component when visible
    return (
      <Suspense fallback={fallback ?? <DefaultLoadingFallback />}>
        {renderComponent(node, context)}
      </Suspense>
    );
  }
);

LazyComponentRenderer.displayName = 'LazyComponentRenderer';

/**
 * Higher-order component for lazy loading
 */
export function withLazyLoading<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    fallback?: React.ReactNode;
    threshold?: number;
    rootMargin?: string;
  }
): React.ComponentType<P> {
  const WrappedComponent: React.FC<P> = (props) => (
    <Suspense fallback={options?.fallback ?? <DefaultLoadingFallback />}>
      <Component {...props} />
    </Suspense>
  );

  WrappedComponent.displayName = `withLazyLoading(${Component.displayName ?? Component.name ?? 'Component'})`;

  return WrappedComponent;
}

/**
 * Hook for determining if a component should be lazily loaded
 */
export function useLazyLoading(
  node: ComponentNode,
  context: RendererContext,
  depth: number = 0
): boolean {
  return React.useMemo(() => {
    // Don't lazy load in export mode
    if (context.mode === 'export') {
      return false;
    }

    // Don't lazy load if explicitly disabled
    if (context.lazy === false) {
      return false;
    }

    // Don't lazy load root components
    if (depth === 0) {
      return false;
    }

    // Don't lazy load small components
    if (node.children.length === 0 && node.props.lazy !== true) {
      return false;
    }

    // Lazy load if explicitly requested
    if (node.props.lazy === true) {
      return true;
    }

    // Default: lazy load components at depth > 2
    return depth > 2;
  }, [node, context, depth]);
}
