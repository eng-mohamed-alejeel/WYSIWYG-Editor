/**
 * Breadcrumb Component
 *
 * A reusable breadcrumb component for displaying navigation paths.
 */

import React from 'react';
import { Icon } from './Icon';

export interface BreadcrumbItem {
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
   * Item URL
   */
  href?: string;

  /**
   * Is item active
   */
  active?: boolean;

  /**
   * Item callback
   */
  onClick?: () => void;

  /**
   * Custom className
   */
  className?: string;
}

export interface BreadcrumbProps {
  /**
   * Breadcrumb items
   */
  items: BreadcrumbItem[];

  /**
   * Separator between items
   */
  separator?: React.ReactNode;

  /**
   * Custom className
   */
  className?: string;

  /**
   * Show icons
   */
  showIcons?: boolean;

  /**
   * Breadcrumb size
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Max items to display
   */
  maxItems?: number;

  /**
   * Collapsed items label
   */
  collapsedLabel?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  separator = <Icon name="chevron-right" size="small" />,
  className = '',
  showIcons = false,
  size = 'medium',
  maxItems,
  collapsedLabel = '...'
}) => {
  const renderIcon = (icon?: string | React.ReactNode) => {
    if (!icon || !showIcons) return null;

    if (typeof icon === 'string') {
      return <Icon name={icon} size="small" className="breadcrumb-item-icon" />;
    }

    return <span className="breadcrumb-item-icon">{icon}</span>;
  };

  const renderBreadcrumbItem = (item: BreadcrumbItem, index: number, isLast: boolean) => {
    const itemClasses = [
      'breadcrumb-item',
      `breadcrumb-item-${size}`,
      item.active ? 'breadcrumb-item-active' : '',
      item.className || ''
    ].filter(Boolean).join(' ');

    const content = (
      <>
        {renderIcon(item.icon)}
        <span className="breadcrumb-item-label">
          {item.label}
        </span>
      </>
    );

    return (
      <React.Fragment key={item.id}>
        <li className={itemClasses}>
          {item.href ? (
            <a
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                item.onClick?.();
              }}
              className="breadcrumb-item-link"
            >
              {content}
            </a>
          ) : (
            <button
              onClick={item.onClick}
              disabled={item.active}
              className="breadcrumb-item-button"
            >
              {content}
            </button>
          )}
        </li>
        {!isLast && (
          <li className="breadcrumb-separator">
            {separator}
          </li>
        )}
      </React.Fragment>
    );
  };

  const sizeClasses = `breadcrumb-${size}`;
  const classes = ['breadcrumb', sizeClasses, className].filter(Boolean).join(' ');

  let displayItems = items;
  let showCollapsed = false;

  if (maxItems && items.length > maxItems) {
    const firstItems = items.slice(0, 1);
    const lastItems = items.slice(-(maxItems - 1));
    displayItems = [...firstItems, ...lastItems];
    showCollapsed = true;
  }

  return (
    <nav className={classes} aria-label="Breadcrumb">
      <ol className="breadcrumb-list">
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;

          if (showCollapsed && index === 1) {
            return (
              <React.Fragment key="collapsed">
                <li className="breadcrumb-item breadcrumb-item-collapsed">
                  {collapsedLabel}
                </li>
                <li className="breadcrumb-separator">
                  {separator}
                </li>
              </React.Fragment>
            );
          }

          return renderBreadcrumbItem(item, index, isLast);
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
