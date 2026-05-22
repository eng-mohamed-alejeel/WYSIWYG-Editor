/**
 * Button Component
 *
 * A reusable button component with multiple variants and sizes.
 */
import React from 'react';
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    /**
     * Button variant
     */
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'link';
    /**
     * Button size
     */
    size?: 'small' | 'medium' | 'large';
    /**
     * Is button disabled
     */
    disabled?: boolean;
    /**
     * Is button loading
     */
    loading?: boolean;
    /**
     * Button icon
     */
    icon?: React.ReactNode;
    /**
     * Icon position
     */
    iconPosition?: 'left' | 'right';
    /**
     * Button children
     */
    children?: React.ReactNode;
}
export declare const Button: React.FC<ButtonProps>;
export default Button;
//# sourceMappingURL=Button.d.ts.map