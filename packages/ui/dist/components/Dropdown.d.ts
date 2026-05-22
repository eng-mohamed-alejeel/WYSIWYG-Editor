/**
 * Dropdown Component
 *
 * A reusable dropdown component for displaying dropdown menus.
 */
import React from 'react';
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
export declare const Dropdown: React.FC<DropdownProps>;
export default Dropdown;
//# sourceMappingURL=Dropdown.d.ts.map