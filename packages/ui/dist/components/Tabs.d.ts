/**
 * Tabs Component
 *
 * A reusable tabs component for organizing content in tabbed views.
 */
import React, { ReactNode } from 'react';
export interface TabItem {
    /**
     * Tab unique identifier
     */
    id: string;
    /**
     * Tab label
     */
    label: string;
    /**
     * Tab icon
     */
    icon?: ReactNode;
    /**
     * Tab content
     */
    content: ReactNode;
    /**
     * Is tab disabled
     */
    disabled?: boolean;
    /**
     * Custom className
     */
    className?: string;
}
export interface TabsProps {
    /**
     * Tab items
     */
    items: TabItem[];
    /**
     * Active tab id (controlled)
     */
    activeTab?: string;
    /**
     * Default active tab id (uncontrolled)
     */
    defaultActiveTab?: string;
    /**
     * Active tab change callback
     */
    onChange?: (tabId: string) => void;
    /**
     * Tabs variant
     */
    variant?: 'default' | 'pills' | 'underline' | 'enclosed';
    /**
     * Tabs position
     */
    position?: 'top' | 'bottom' | 'left' | 'right';
    /**
     * Is tabs full width
     */
    fullWidth?: boolean;
    /**
     * Custom className
     */
    className?: string;
    /**
     * Custom tab list className
     */
    tabListClassName?: string;
    /**
     * Custom tab panel className
     */
    tabPanelClassName?: string;
}
export declare const Tabs: React.FC<TabsProps>;
export default Tabs;
//# sourceMappingURL=Tabs.d.ts.map