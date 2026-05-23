/**
 * Renderer Error Boundary
 *
 * This module provides error boundary components for graceful error handling.
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorBoundaryState as RendererErrorBoundaryState } from './types';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  nodeId?: string;
  mode?: 'editor' | 'preview' | 'runtime' | 'export';
}

/**
 * Default error fallback component
 */
const DefaultErrorFallback: React.FC<{ error: Error; nodeId?: string; mode?: string }> = ({
  error,
  nodeId,
  mode
}) => {
  if (mode === 'export') {
    return null;
  }

  return (
    <div
      style={{
        padding: '16px',
        margin: '8px',
        border: '1px solid #ff4444',
        borderRadius: '4px',
        backgroundColor: '#fff5f5',
        color: '#c53030',
      }}
    >
      <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
        Component Error {nodeId && `(ID: ${nodeId})`}
      </div>
      <div style={{ fontSize: '14px', marginBottom: '8px' }}>{error.message}</div>
      {mode === 'editor' && (
        <details style={{ fontSize: '12px' }}>
          <summary>Stack Trace</summary>
          <pre style={{ marginTop: '8px', whiteSpace: 'pre-wrap' }}>{error.stack}</pre>
        </details>
      )}
    </div>
  );
};

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the component tree
 */
export class RendererErrorBoundary extends Component<
  ErrorBoundaryProps,
  RendererErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      nodeId: props.nodeId,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<RendererErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({
      error,
      errorInfo,
      nodeId: this.props.nodeId,
    });

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    } else {
      console.error('Renderer Error Boundary caught an error:', error, errorInfo);
    }
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    if (this.state.hasError && prevProps.nodeId !== this.props.nodeId) {
      this.setState({
        hasError: false,
        error: undefined,
        errorInfo: undefined,
        nodeId: this.props.nodeId,
      });
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      const fallback = this.props.fallback;
      if (fallback !== undefined) {
        return fallback;
      }

      return (
        <DefaultErrorFallback
          error={this.state.error || new Error('Unknown error')}
          nodeId={this.state.nodeId}
          mode={this.props.mode}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * Higher-order component that wraps a component with error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
): React.ComponentType<P> {
  const WrappedComponent = (props: P) => (
    <RendererErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </RendererErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
}
