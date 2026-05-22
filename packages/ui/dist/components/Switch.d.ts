/**
 * Switch Component
 *
 * A reusable switch component for toggling between two states.
 */
import React from 'react';
export interface SwitchProps {
    /**
     * Is switch checked
     */
    checked: boolean;
    /**
     * Change callback
     */
    onChange: (checked: boolean) => void;
    /**
     * Is switch disabled
     */
    disabled?: boolean;
    /**
     * Switch label
     */
    label?: string;
    /**
     * Switch size
     */
    size?: 'small' | 'medium' | 'large';
    /**
     * Switch color
     */
    color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
    /**
     * Custom className
     */
    className?: string;
    /**
     * Switch id
     */
    id?: string;
    /**
     * Switch name
     */
    name?: string;
    /**
     * Show label on left side
     */
    labelOnLeft?: boolean;
}
export declare const Switch: React.FC<SwitchProps>;
export default Switch;
//# sourceMappingURL=Switch.d.ts.map