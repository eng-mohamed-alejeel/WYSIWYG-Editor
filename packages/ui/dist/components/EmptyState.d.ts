/**
 * Empty State Component
 *
 * A reusable empty state component for displaying empty content states.
 */
import React from 'react';
export interface EmptyStateProps {
    /**
     * Empty state icon
     */
    icon?: string | React.ReactNode;
    /**
     * Empty state title
     */
    title?: string;
    /**
     * Empty state description
     */
    description?: string;
    /**
     * Action button text
     */
    actionText?: string;
    /**
     * Action button callback
     */
    onAction?: () => void;
    /**
     * Custom className
     */
    className?: string;
    /**
     * Is empty state compact
     */
    compact?: boolean;
    /**
     * Empty state variant
     */
    variant?: 'default' | 'error' | 'warning' | 'info' | 'success';
    /**
     * Custom icon size
     */
    iconSize?: number | 'small' | 'medium' | 'large' | 'xlarge';
    /**
     * Additional content
     */
    children?: React.ReactNode;
}
export declare const EmptyState: React.FC<EmptyStateProps>;
export default EmptyState;
//# sourceMappingURL=EmptyState.d.ts.map