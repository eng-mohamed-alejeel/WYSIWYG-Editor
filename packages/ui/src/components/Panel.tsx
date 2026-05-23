/**
 * Panel Component
 *
 * A reusable panel component for displaying content in a side panel.
 */

import React, { useEffect, useRef, useState } from 'react';

export interface PanelProps {
  /**
   * Is panel open
   */
  isOpen: boolean;

  /**
   * Panel position
   */
  position?: 'left' | 'right';

  /**
   * Panel size
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Panel title
   */
  title?: string;

  /**
   * Panel content
   */
  children?: React.ReactNode;

  /**
   * Panel footer content
   */
  footer?: React.ReactNode;

  /**
   * Close panel callback
   */
  onClose?: () => void;

  /**
   * Is panel closable by clicking outside
   */
  closeOnClickOutside?: boolean;

  /**
   * Is panel closable by pressing ESC
   */
  closeOnEsc?: boolean;

  /**
   * Custom className
   */
  className?: string;

  /**
   * Panel z-index
   */
  zIndex?: number;

  /**
   * Panel width in pixels (overrides size)
   */
  width?: number;

  /**
   * Is panel resizable
   */
  resizable?: boolean;

  /**
   * Minimum panel width
   */
  minWidth?: number;

  /**
   * Maximum panel width
   */
  maxWidth?: number;
}

export const Panel: React.FC<PanelProps> = ({
  isOpen,
  position = 'right',
  size = 'medium',
  title,
  children,
  footer,
  onClose,
  closeOnClickOutside = true,
  closeOnEsc = true,
  className = '',
  zIndex = 1000,
  width,
  resizable = false,
  minWidth = 200,
  maxWidth = 800,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [panelWidth, setPanelWidth] = useState<number | undefined>(width);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (closeOnEsc && event.key === 'Escape' && onClose) {
        onClose();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        closeOnClickOutside &&
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        onClose
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, closeOnClickOutside, closeOnEsc, onClose]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!resizable) return;

    startXRef.current = e.clientX;
    startWidthRef.current = panelRef.current?.offsetWidth ?? 0;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX =
        position === 'right'
          ? startXRef.current - moveEvent.clientX
          : moveEvent.clientX - startXRef.current;

      const newWidth = Math.max(minWidth, Math.min(maxWidth, startWidthRef.current + deltaX));

      setPanelWidth(newWidth);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  if (!isOpen) return null;

  const positionClasses = `panel-${position}`;
  const sizeClasses = `panel-${size}`;
  const classes = ['panel', positionClasses, sizeClasses, className].filter(Boolean).join(' ');

  const panelStyle: React.CSSProperties = {
    zIndex,
    ...(panelWidth !== undefined ? { width: `${panelWidth}px` } : {}),
  };

  return (
    <div className="panel-overlay">
      <div
        ref={panelRef}
        className={classes}
        style={panelStyle}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title !== undefined && title !== '' ? 'panel-title' : undefined}
      >
        {title !== undefined && title !== '' && (
          <div className="panel-header">
            <h2 id="panel-title" className="panel-title">
              {title}
            </h2>
            {onClose && (
              <button className="panel-close" onClick={onClose} aria-label="Close panel">
                ×
              </button>
            )}
          </div>
        )}
        <div className="panel-body">{children}</div>
        {footer !== undefined && <div className="panel-footer">{footer}</div>}
        {resizable === true && (
          <div
            role="slider"
            aria-orientation="vertical"
            aria-label="Resize panel"
            aria-valuemin={minWidth}
            aria-valuemax={maxWidth}
            aria-valuenow={panelWidth ?? panelRef.current?.offsetWidth ?? minWidth}
            tabIndex={0}
            className={`panel-resize-handle panel-resize-handle-${position}`}
            onMouseDown={handleMouseDown}
            onKeyDown={(e) => {
              if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                e.preventDefault();
                const delta = e.key === 'ArrowLeft' ? -10 : 10;
                const newWidth = Math.max(
                  minWidth,
                  Math.min(maxWidth, (panelWidth ?? panelRef.current?.offsetWidth ?? 300) + delta)
                );
                setPanelWidth(newWidth);
              }
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Panel;
