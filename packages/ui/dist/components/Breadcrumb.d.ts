/**
 * Breadcrumb Component
 *
 * A reusable breadcrumb component for displaying navigation paths.
 */
import React from 'react';
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
export declare const Breadcrumb: React.FC<BreadcrumbProps>;
export default Breadcrumb;
//# sourceMappingURL=Breadcrumb.d.ts.map