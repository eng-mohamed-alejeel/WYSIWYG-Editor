/**
 * Panel Component
 *
 * A reusable panel component for displaying content in a side panel.
 */
import React from 'react';
export interface PanelProps {
    /**
     * Is panel open
     */
    isOpen: boolean;
    /**
     * Panel position
     */
    position?: 'left' | 'right';
    /**
     * Panel size
     */
    size?: 'small' | 'medium' | 'large';
    /**
     * Panel title
     */
    title?: string;
    /**
     * Panel content
     */
    children?: React.ReactNode;
    /**
     * Panel footer content
     */
    footer?: React.ReactNode;
    /**
     * Close panel callback
     */
    onClose?: () => void;
    /**
     * Is panel closable by clicking outside
     */
    closeOnClickOutside?: boolean;
    /**
     * Is panel closable by pressing ESC
     */
    closeOnEsc?: boolean;
    /**
     * Custom className
     */
    className?: string;
    /**
     * Panel z-index
     */
    zIndex?: number;
    /**
     * Panel width in pixels (overrides size)
     */
    width?: number;
    /**
     * Is panel resizable
     */
    resizable?: boolean;
    /**
     * Minimum panel width
     */
    minWidth?: number;
    /**
     * Maximum panel width
     */
    maxWidth?: number;
}
export declare const Panel: React.FC<PanelProps>;
export default Panel;
//# sourceMappingURL=Panel.d.ts.map