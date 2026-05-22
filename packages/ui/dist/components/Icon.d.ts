/**
 * Icon Component
 *
 * A reusable icon component for displaying SVG icons.
 */
import React from 'react';
export interface IconProps {
    /**
     * Icon name
     */
    name: string;
    /**
     * Icon size
     */
    size?: number | 'small' | 'medium' | 'large' | 'xlarge';
    /**
     * Icon color
     */
    color?: string;
    /**
     * Is icon clickable
     */
    clickable?: boolean;
    /**
     * Click callback
     */
    onClick?: () => void;
    /**
     * Custom className
     */
    className?: string;
    /**
     * Icon viewBox
     */
    viewBox?: string;
    /**
     * Custom SVG path
     */
    path?: string;
}
export declare const Icon: React.FC<IconProps>;
export default Icon;
//# sourceMappingURL=Icon.d.ts.map