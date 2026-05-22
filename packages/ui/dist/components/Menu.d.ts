/**
 * Menu Component
 *
 * A reusable menu component for displaying navigation menus.
 */
import React from 'react';
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
export declare const Menu: React.FC<MenuProps>;
export default Menu;
//# sourceMappingURL=Menu.d.ts.map