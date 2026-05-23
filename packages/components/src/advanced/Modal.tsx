/**
 * Modal Component
 *
 * A modal component for displaying content in an overlay.
 * Supports various sizes, positions, and animation options.
 */

import React, { useEffect } from 'react';
import { BaseComponentProps } from '../types';
import { parseInlineStyles, mergeStyles } from '../utils/styleUtils';

export const Modal: React.FC<BaseComponentProps> = ({
  node,
  context,
  children,
  style,
  className = '',
}) => {
  const { isEditable, isPreview } = context;
  const isOpen = node.props.isOpen !== false;
  const size = node.props.size || 'medium';
  const position = node.props.position || 'center';
  const closeOnOverlayClick = node.props.closeOnOverlayClick !== false;
  const closeOnEscape = node.props.closeOnEscape !== false;

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key press
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        node.props.onClose?.();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, node.props.onClose]);

  if (!isOpen) return null;

  const modalSizeStyles = getModalSizeStyles(size);
  const modalPositionStyles = getModalPositionStyles(position);

  return (
    <div
      id={node.id}
      className={`wysiwyg-modal ${className}`.trim()}
      style={mergeStyles({
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        ...(node.styles as Record<string, any>),
        ...modalPositionStyles,
        ...parseInlineStyles(style),
      } as React.CSSProperties)}
      data-component-type={node.type}
      data-editable={isEditable}
      data-preview={isPreview}
    >
      <div
        className="wysiwyg-modal-overlay"
        style={mergeStyles({
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        } as React.CSSProperties)}
        onClick={closeOnOverlayClick ? node.props.onClose : undefined}
      />
      <div
        className="wysiwyg-modal-content"
        style={mergeStyles({
          position: 'relative',
          backgroundColor: node.props.backgroundColor || '#ffffff',
          borderRadius: node.props.borderRadius || '0.5rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          maxHeight: '90vh',
          overflow: 'auto',
          ...modalSizeStyles,
          padding: node.props.padding || '1.5rem',
        } as React.CSSProperties)}
      >
        {node.props.showHeader !== false && (
          <div
            className="wysiwyg-modal-header"
            style={mergeStyles({
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid #e5e7eb',
            } as React.CSSProperties)}
          >
            <h3
              style={mergeStyles({
                margin: 0,
                fontSize: '1.25rem',
                fontWeight: '600',
              } as React.CSSProperties)}
            >
              {node.props.title || 'Modal'}
            </h3>
            {node.props.showCloseButton !== false && (
              <button
                className="wysiwyg-modal-close"
                style={mergeStyles({
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  padding: '0.25rem 0.5rem',
                  lineHeight: 1,
                  color: '#6b7280',
                } as React.CSSProperties)}
                onClick={node.props.onClose}
              >
                ×
              </button>
            )}
          </div>
        )}
        <div className="wysiwyg-modal-body">{children}</div>
        {node.props.showFooter !== false && node.props.footer && (
          <div
            className="wysiwyg-modal-footer"
            style={mergeStyles({
              marginTop: '1rem',
              paddingTop: '1rem',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.5rem',
            } as React.CSSProperties)}
          >
            {node.props.footer}
          </div>
        )}
      </div>
    </div>
  );
};

function getModalSizeStyles(size: string): React.CSSProperties {
  const sizes: Record<string, React.CSSProperties> = {
    small: {
      width: '90%',
      maxWidth: '400px',
    },
    medium: {
      width: '90%',
      maxWidth: '600px',
    },
    large: {
      width: '90%',
      maxWidth: '800px',
    },
    fullscreen: {
      width: '100%',
      height: '100%',
      maxWidth: 'none',
      maxHeight: 'none',
      borderRadius: 0,
    },
  };
  return sizes[size] || sizes.medium;
}

function getModalPositionStyles(position: string): React.CSSProperties {
  const positions: Record<string, React.CSSProperties> = {
    center: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    top: {
      alignItems: 'flex-start',
      justifyContent: 'center',
      paddingTop: '10vh',
    },
    bottom: {
      alignItems: 'flex-end',
      justifyContent: 'center',
      paddingBottom: '10vh',
    },
    left: {
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingLeft: '10vw',
    },
    right: {
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingRight: '10vw',
    },
  };
  return positions[position] || positions.center;
}
