/**
 * Loading Component
 *
 * A reusable loading component for displaying loading states.
 */
import React from 'react';
export interface LoadingProps {
    /**
     * Loading size
     */
    size?: 'small' | 'medium' | 'large';
    /**
     * Loading color
     */
    color?: string;
    /**
     * Custom className
     */
    className?: string;
    /**
     * Loading text
     */
    text?: string;
    /**
     * Is loading full screen
     */
    fullscreen?: boolean;
    /**
     * Loading variant
     */
    variant?: 'spinner' | 'dots' | 'pulse' | 'bars';
    /**
     * Is loading overlay
     */
    overlay?: boolean;
    /**
     * Overlay background color
     */
    overlayColor?: string;
}
export declare const Loading: React.FC<LoadingProps>;
export default Loading;
//# sourceMappingURL=Loading.d.ts.map