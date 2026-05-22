/**
 * Dropdown Component
 *
 * A reusable dropdown component for displaying dropdown menus.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Icon } from './Icon';

export interface DropdownItem {
  /**
   * Item unique identifier
   */
  id: string;

  /**
   * Item label
   */
  label: string;

  /**
   * Item icon
   */
  icon?: string | React.ReactNode;

  /**
   * Is item disabled
   */
  disabled?: boolean;

  /**
   * Is item a divider
   */
  divider?: boolean;

  /**
   * Is item a header
   */
  header?: boolean;

  /**
   * Item callback
   */
  onClick?: () => void;

  /**
   * Custom className
   */
  className?: string;

  /**
   * Item badge
   */
  badge?: string | number;

  /**
   * Item shortcut
   */
  shortcut?: string;
}

export interface DropdownProps {
  /**
   * Dropdown items
   */
  items: DropdownItem[];

  /**
   * Trigger element
   */
  trigger: React.ReactNode;

  /**
   * Dropdown position
   */
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';

  /**
   * Is dropdown open
   */
  isOpen?: boolean;

  /**
   * Open change callback
   */
  onOpenChange?: (isOpen: boolean) => void;

  /**
   * Custom className
   */
  className?: string;

  /**
   * Dropdown width
   */
  width?: number | string;

  /**
   * Is dropdown disabled
   */
  disabled?: boolean;

  /**
   * Close on item click
   */
  closeOnClick?: boolean;

  /**
   * Close on click outside
   */
  closeOnClickOutside?: boolean;

  /**
   * Dropdown z-index
   */
  zIndex?: number;

  /**
   * Show arrow
   */
  showArrow?: boolean;

  /**
   * Dropdown animation
   */
  animation?: 'fade' | 'slide' | 'scale' | 'none';
}

export const Dropdown: React.FC<DropdownProps> = ({
  items,
  trigger,
  position = 'bottom-left',
  isOpen: controlledIsOpen,
  onOpenChange,
  className = '',
  width = 'auto',
  disabled = false,
  closeOnClick = true,
  closeOnClickOutside = true,
  zIndex = 1000,
  showArrow = false,
  animation = 'fade'
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  const handleToggle = () => {
    if (disabled) return;
    const newIsOpen = !isOpen;
    setInternalIsOpen(newIsOpen);
    onOpenChange?.(newIsOpen);
  };

  const handleClose = () => {
    setInternalIsOpen(false);
    onOpenChange?.(false);
  };

  const handleItemClick = (item: DropdownItem) => {
    if (item.disabled || item.header || item.divider) return;

    item.onClick?.();

    if (closeOnClick) {
      handleClose();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        closeOnClickOutside &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, closeOnClickOutside]);

  const positionClasses = `dropdown-${position}`;
  const animationClasses = animation !== 'none' ? `dropdown-animation-${animation}` : '';
  const classes = [
    'dropdown',
    positionClasses,
    animationClasses,
    isOpen ? 'dropdown-open' : '',
    className
  ].filter(Boolean).join(' ');

  const renderIcon = (icon?: string | React.ReactNode) => {
    if (!icon) return null;

    if (typeof icon === 'string') {
      return <Icon name={icon} size="small" />;
    }

    return icon;
  };

  const renderBadge = (badge?: string | number) => {
    if (badge === undefined || badge === null) return null;

    return (
      <span className="dropdown-item-badge">
        {badge}
      </span>
    );
  };

  return (
    <div className="dropdown-wrapper" ref={dropdownRef}>
      <div onClick={handleToggle}>
        {trigger}
      </div>
      {isOpen && (
        <div
          className={classes}
          style={{ width: typeof width === 'number' ? `${width}px` : width, zIndex }}
        >
          {showArrow && <div className="dropdown-arrow" />}
          <div className="dropdown-menu">
            {items.map((item, index) => (
              <React.Fragment key={item.id || index}>
                {item.divider ? (
                  <div className="dropdown-divider" />
                ) : item.header ? (
                  <div className={`dropdown-item dropdown-item-header ${item.className || ''}`}>
                    {item.label}
                  </div>
                ) : (
                  <button
                    className={`dropdown-item ${item.disabled ? 'dropdown-item-disabled' : ''} ${
                      item.className || ''
                    }`}
                    onClick={() => handleItemClick(item)}
                    disabled={item.disabled}
                  >
                    {renderIcon(item.icon)}
                    <span className="dropdown-item-label">
                      {item.label}
                    </span>
                    {item.shortcut && (
                      <span className="dropdown-item-shortcut">
                        {item.shortcut}
                      </span>
                    )}
                    {renderBadge(item.badge)}
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
