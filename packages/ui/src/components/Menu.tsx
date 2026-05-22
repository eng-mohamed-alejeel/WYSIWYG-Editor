/**
 * Menu Component
 *
 * A reusable menu component for displaying navigation menus.
 */

import React, { useState } from 'react';
import { Icon } from './Icon';

export interface MenuItem {
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
   * Is item active
   */
  active?: boolean;

  /**
   * Item callback
   */
  onClick?: () => void;

  /**
   * Submenu items
   */
  submenu?: MenuItem[];

  /**
   * Custom className
   */
  className?: string;

  /**
   * Item badge
   */
  badge?: string | number;

  /**
   * Item URL
   */
  href?: string;

  /**
   * Open in new tab
   */
  external?: boolean;
}

export interface MenuProps {
  /**
   * Menu items
   */
  items: MenuItem[];

  /**
   * Menu variant
   */
  variant?: 'vertical' | 'horizontal' | 'sidebar';

  /**
   * Menu size
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Active item id
   */
  activeItemId?: string;

  /**
   * Item click callback
   */
  onItemClick?: (item: MenuItem) => void;

  /**
   * Custom className
   */
  className?: string;

  /**
   * Show icons
   */
  showIcons?: boolean;

  /**
   * Collapse submenus
   */
  collapseSubmenus?: boolean;

  /**
   * Is menu collapsible
   */
  collapsible?: boolean;

  /**
   * Is menu collapsed
   */
  collapsed?: boolean;

  /**
   * Collapse toggle callback
   */
  onCollapseToggle?: () => void;

  /**
   * Show badges
   */
  showBadges?: boolean;

  /**
   * Menu theme
   */
  theme?: 'light' | 'dark';
}

export const Menu: React.FC<MenuProps> = ({
  items,
  variant = 'vertical',
  size = 'medium',
  activeItemId,
  onItemClick,
  className = '',
  showIcons = true,
  collapseSubmenus = false,
  collapsible = false,
  collapsed = false,
  onCollapseToggle,
  showBadges = true,
  theme = 'light'
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const handleItemClick = (item: MenuItem) => {
    if (item.disabled) return;

    if (item.submenu && !collapseSubmenus) {
      const newExpanded = new Set(expandedItems);
      if (newExpanded.has(item.id)) {
        newExpanded.delete(item.id);
      } else {
        newExpanded.add(item.id);
      }
      setExpandedItems(newExpanded);
    }

    if (!item.submenu || collapseSubmenus) {
      onItemClick?.(item);
      item.onClick?.();
    }
  };

  const handleCollapseToggle = () => {
    onCollapseToggle?.();
  };

  const renderIcon = (icon?: string | React.ReactNode) => {
    if (!icon || !showIcons) return null;

    if (typeof icon === 'string') {
      return <Icon name={icon} size="small" />;
    }

    return icon;
  };

  const renderBadge = (badge?: string | number) => {
    if (!badge || !showBadges) return null;

    return (
      <span className="menu-item-badge">
        {badge}
      </span>
    );
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const isActive = activeItemId === item.id;
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isExpanded = expandedItems.has(item.id);

    const itemClasses = [
      'menu-item',
      `menu-item-${size}`,
      isActive ? 'menu-item-active' : '',
      item.disabled ? 'menu-item-disabled' : '',
      hasSubmenu ? 'menu-item-has-submenu' : '',
      item.className || ''
    ].filter(Boolean).join(' ');

    const submenuClasses = [
      'menu-submenu',
      isExpanded ? 'menu-submenu-expanded' : '',
      `menu-submenu-level-${level + 1}`
    ].filter(Boolean).join(' ');

    const content = (
      <>
        {renderIcon(item.icon)}
        <span className="menu-item-label">
          {item.label}
        </span>
        {renderBadge(item.badge)}
        {hasSubmenu && (
          <Icon
            name="chevron-right"
            size="small"
            className={`menu-item-chevron ${isExpanded ? 'menu-item-chevron-expanded' : ''}`}
          />
        )}
      </>
    );

    return (
      <React.Fragment key={item.id}>
        {item.href ? (
          <a
            href={item.href}
            className={itemClasses}
            onClick={(e) => {
              e.preventDefault();
              handleItemClick(item);
            }}
            target={item.external ? '_blank' : undefined}
            rel={item.external ? 'noopener noreferrer' : undefined}
          >
            {content}
          </a>
        ) : (
          <button
            className={itemClasses}
            onClick={() => handleItemClick(item)}
            disabled={item.disabled}
          >
            {content}
          </button>
        )}
        {hasSubmenu && !collapseSubmenus && (
          <div className={submenuClasses}>
            {item.submenu!.map((subItem) => renderMenuItem(subItem, level + 1))}
          </div>
        )}
      </React.Fragment>
    );
  };

  const variantClasses = `menu-${variant}`;
  const sizeClasses = `menu-${size}`;
  const themeClasses = `menu-${theme}`;
  const collapsedClasses = collapsed ? 'menu-collapsed' : '';
  const classes = [
    'menu',
    variantClasses,
    sizeClasses,
    themeClasses,
    collapsedClasses,
    className
  ].filter(Boolean).join(' ');

  return (
    <nav className={classes}>
      {collapsible && (
        <button
          className="menu-collapse-toggle"
          onClick={handleCollapseToggle}
          aria-label={collapsed ? 'Expand menu' : 'Collapse menu'}
        >
          <Icon name={collapsed ? 'menu' : 'arrow-left'} size="small" />
        </button>
      )}
      <ul className="menu-list">
        {items.map((item) => (
          <li key={item.id} className="menu-list-item">
            {renderMenuItem(item)}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Menu;
