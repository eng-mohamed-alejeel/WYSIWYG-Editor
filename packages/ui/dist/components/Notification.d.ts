/**
 * Notification Component
 *
 * A reusable notification component for displaying alerts and messages.
 */
import React from 'react';
export interface NotificationProps {
    /**
     * Notification type
     */
    type?: 'success' | 'error' | 'warning' | 'info';
    /**
     * Notification title
     */
    title?: string;
    /**
     * Notification message
     */
    message?: string;
    /**
     * Is notification visible
     */
    visible?: boolean;
    /**
     * Close notification callback
     */
    onClose?: () => void;
    /**
     * Auto close delay in milliseconds
     */
    autoClose?: number;
    /**
     * Custom className
     */
    className?: string;
    /**
     * Show close button
     */
    showClose?: boolean;
    /**
     * Custom icon
     */
    icon?: string | React.ReactNode;
    /**
     * Notification position
     */
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
    /**
     * Action button text
     */
    actionText?: string;
    /**
     * Action button callback
     */
    onAction?: () => void;
}
export declare const Notification: React.FC<NotificationProps>;
export default Notification;
//# sourceMappingURL=Notification.d.ts.map