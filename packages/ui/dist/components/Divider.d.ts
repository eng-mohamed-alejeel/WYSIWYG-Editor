/**
 * Divider Component
 *
 * A reusable divider component for separating content.
 */
import React from 'react';
export interface DividerProps {
    /**
     * Divider orientation
     */
    orientation?: 'horizontal' | 'vertical';
    /**
     * Divider variant
     */
    variant?: 'solid' | 'dashed' | 'dotted';
    /**
     * Divider text
     */
    text?: string;
    /**
     * Divider color
     */
    color?: string;
    /**
     * Custom className
     */
    className?: string;
    /**
     * Divider thickness
     */
    thickness?: number;
    /**
     * Is divider full width
     */
    fullWidth?: boolean;
    /**
     * Divider spacing
     */
    spacing?: 'none' | 'small' | 'medium' | 'large';
}
export declare const Divider: React.FC<DividerProps>;
export default Divider;
//# sourceMappingURL=Divider.d.ts.map