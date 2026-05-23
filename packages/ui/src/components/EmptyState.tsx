/**
 * Empty State Component
 *
 * A reusable empty state component for displaying empty content states.
 */

import React from 'react';
import { Icon } from './Icon';

export interface EmptyStateProps {
  /**
   * Empty state icon
   */
  icon?: string | React.ReactNode;

  /**
   * Empty state title
   */
  title?: string;

  /**
   * Empty state description
   */
  description?: string;

  /**
   * Action button text
   */
  actionText?: string;

  /**
   * Action button callback
   */
  onAction?: () => void;

  /**
   * Custom className
   */
  className?: string;

  /**
   * Is empty state compact
   */
  compact?: boolean;

  /**
   * Empty state variant
   */
  variant?: 'default' | 'error' | 'warning' | 'info' | 'success';

  /**
   * Custom icon size
   */
  iconSize?: number | 'small' | 'medium' | 'large' | 'xlarge';

  /**
   * Additional content
   */
  children?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'inbox',
  title = 'No data found',
  description,
  actionText,
  onAction,
  className = '',
  compact = false,
  variant = 'default',
  iconSize = 'large',
  children,
}) => {
  const classes = [
    'empty-state',
    `empty-state-${variant}`,
    compact ? 'empty-state-compact' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const renderIcon = () => {
    if (typeof icon === 'string') {
      return <Icon name={icon} size={iconSize} />;
    }
    return icon;
  };

  return (
    <div className={classes}>
      <div className="empty-state-icon">{renderIcon()}</div>
      {title && <h3 className="empty-state-title">{title}</h3>}
      {description && <p className="empty-state-description">{description}</p>}
      {children && <div className="empty-state-content">{children}</div>}
      {actionText && onAction && (
        <button className="empty-state-action" onClick={onAction}>
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
