/**
 * Notification Component
 *
 * A reusable notification component for displaying alerts and messages.
 */

import React, { useEffect, useState } from 'react';
import { Icon } from './Icon';

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

export const Notification: React.FC<NotificationProps> = ({
  type = 'info',
  title,
  message,
  visible = true,
  onClose,
  autoClose,
  className = '',
  showClose = true,
  icon,
  position = 'top-right',
  actionText,
  onAction
}) => {
  const [isVisible, setIsVisible] = useState(visible);

  useEffect(() => {
    setIsVisible(visible);
  }, [visible]);

  useEffect(() => {
    if (autoClose && isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, autoClose);

      return () => clearTimeout(timer);
    }
  }, [autoClose, isVisible, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  const getIcon = () => {
    if (icon) {
      return typeof icon === 'string' ? <Icon name={icon} /> : icon;
    }

    const defaultIcons = {
      success: 'success',
      error: 'error',
      warning: 'warning',
      info: 'info'
    };

    return <Icon name={defaultIcons[type]} />;
  };

  if (!isVisible) return null;

  const classes = [
    'notification',
    `notification-${type}`,
    `notification-${position}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} role="alert">
      <div className="notification-icon">
        {getIcon()}
      </div>
      <div className="notification-content">
        {title && (
          <h4 className="notification-title">
            {title}
          </h4>
        )}
        {message && (
          <p className="notification-message">
            {message}
          </p>
        )}
      </div>
      {actionText && onAction && (
        <button
          className="notification-action"
          onClick={onAction}
        >
          {actionText}
        </button>
      )}
      {showClose && (
        <button
          className="notification-close"
          onClick={handleClose}
          aria-label="Close notification"
        >
          <Icon name="close" size="small" />
        </button>
      )}
    </div>
  );
};

export default Notification;
