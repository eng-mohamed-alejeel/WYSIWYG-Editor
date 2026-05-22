/**
 * Tooltip Component
 *
 * A reusable tooltip component for displaying additional information on hover.
 */
import React from 'react';
export interface TooltipProps {
    /**
     * Tooltip content
     */
    content: React.ReactNode;
    /**
     * Tooltip position
     */
    position?: 'top' | 'bottom' | 'left' | 'right';
    /**
     * Tooltip trigger element
     */
    children: React.ReactElement;
    /**
     * Tooltip delay in milliseconds
     */
    delay?: number;
    /**
     * Is tooltip disabled
     */
    disabled?: boolean;
    /**
     * Custom className
     */
    className?: string;
    /**
     * Custom arrow className
     */
    arrowClassName?: string;
    /**
     * Custom content className
     */
    contentClassName?: string;
}
export declare const Tooltip: React.FC<TooltipProps>;
export default Tooltip;
//# sourceMappingURL=Tooltip.d.ts.map