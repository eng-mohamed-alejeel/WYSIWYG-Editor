/**
 * Modal Component
 *
 * A reusable modal component with customizable content and actions.
 */

import React, { useEffect, useRef } from 'react';

export interface ModalProps {
  /**
   * Is modal open
   */
  isOpen: boolean;

  /**
   * Modal title
   */
  title?: string;

  /**
   * Modal content
   */
  children?: React.ReactNode;

  /**
   * Modal footer content
   */
  footer?: React.ReactNode;

  /**
   * Close modal callback
   */
  onClose?: () => void;

  /**
   * Is modal closable by clicking outside
   */
  closeOnClickOutside?: boolean;

  /**
   * Is modal closable by pressing ESC
   */
  closeOnEsc?: boolean;

  /**
   * Modal size
   */
  size?: 'small' | 'medium' | 'large' | 'full';

  /**
   * Custom className
   */
  className?: string;

  /**
   * Modal z-index
   */
  zIndex?: number;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  children,
  footer,
  onClose,
  closeOnClickOutside = true,
  closeOnEsc = true,
  size = 'medium',
  className = '',
  zIndex = 1000
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (closeOnEsc && event.key === 'Escape' && onClose) {
        onClose();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        closeOnClickOutside &&
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        onClose
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isOpen, closeOnClickOutside, closeOnEsc, onClose]);

  if (!isOpen) return null;

  const sizeClasses = `modal-${size}`;
  const classes = ['modal', sizeClasses, className].filter(Boolean).join(' ');

  return (
    <div className="modal-overlay" style={{ zIndex }}>
      <div
        ref={modalRef}
        className={classes}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        {title && (
          <div className="modal-header">
            <h2 id="modal-title" className="modal-title">
              {title}
            </h2>
            {onClose && (
              <button
                className="modal-close"
                onClick={onClose}
                aria-label="Close modal"
              >
                ×
              </button>
            )}
          </div>
        )}
        <div className="modal-body">
          {children}
        </div>
        {footer && (
          <div className="modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
