/**
 * Modal Component
 *
 * A reusable modal component with customizable content and actions.
 */
import React from 'react';
export interface ModalProps {
    /**
     * Is modal open
     */
    isOpen: boolean;
    /**
     * Modal title
     */
    title?: string;
    /**
     * Modal content
     */
    children?: React.ReactNode;
    /**
     * Modal footer content
     */
    footer?: React.ReactNode;
    /**
     * Close modal callback
     */
    onClose?: () => void;
    /**
     * Is modal closable by clicking outside
     */
    closeOnClickOutside?: boolean;
    /**
     * Is modal closable by pressing ESC
     */
    closeOnEsc?: boolean;
    /**
     * Modal size
     */
    size?: 'small' | 'medium' | 'large' | 'full';
    /**
     * Custom className
     */
    className?: string;
    /**
     * Modal z-index
     */
    zIndex?: number;
}
export declare const Modal: React.FC<ModalProps>;
export default Modal;
//# sourceMappingURL=Modal.d.ts.map