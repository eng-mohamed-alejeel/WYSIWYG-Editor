/**
 * Tabs Component
 *
 * A reusable tabs component for organizing content in tabbed views.
 */

import React, { useState, ReactNode } from 'react';

export interface TabItem {
  /**
   * Tab unique identifier
   */
  id: string;

  /**
   * Tab label
   */
  label: string;

  /**
   * Tab icon
   */
  icon?: ReactNode;

  /**
   * Tab content
   */
  content: ReactNode;

  /**
   * Is tab disabled
   */
  disabled?: boolean;

  /**
   * Custom className
   */
  className?: string;
}

export interface TabsProps {
  /**
   * Tab items
   */
  items: TabItem[];

  /**
   * Active tab id (controlled)
   */
  activeTab?: string;

  /**
   * Default active tab id (uncontrolled)
   */
  defaultActiveTab?: string;

  /**
   * Active tab change callback
   */
  onChange?: (tabId: string) => void;

  /**
   * Tabs variant
   */
  variant?: 'default' | 'pills' | 'underline' | 'enclosed';

  /**
   * Tabs position
   */
  position?: 'top' | 'bottom' | 'left' | 'right';

  /**
   * Is tabs full width
   */
  fullWidth?: boolean;

  /**
   * Custom className
   */
  className?: string;

  /**
   * Custom tab list className
   */
  tabListClassName?: string;

  /**
   * Custom tab panel className
   */
  tabPanelClassName?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  items,
  activeTab: controlledActiveTab,
  defaultActiveTab,
  onChange,
  variant = 'default',
  position = 'top',
  fullWidth = false,
  className = '',
  tabListClassName = '',
  tabPanelClassName = ''
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState<string>(
    defaultActiveTab || (items.length > 0 ? items[0].id : '')
  );

  const activeTab = controlledActiveTab !== undefined ? controlledActiveTab : internalActiveTab;

  const handleTabClick = (tabId: string) => {
    if (controlledActiveTab === undefined) {
      setInternalActiveTab(tabId);
    }
    onChange?.(tabId);
  };

  const activeItem = items.find(item => item.id === activeTab);

  const classes = ['tabs', `tabs-${variant}`, `tabs-${position}`, className].filter(Boolean).join(' ');
  const tabListClasses = [
    'tabs-list',
    fullWidth ? 'tabs-list-full-width' : '',
    tabListClassName
  ].filter(Boolean).join(' ');
  const tabPanelClasses = ['tabs-panel', tabPanelClassName].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      <div className={tabListClasses} role="tablist">
        {items.map((item) => (
          <button
            key={item.id}
            className={`tab-item ${activeTab === item.id ? 'tab-item-active' : ''} ${
              item.disabled ? 'tab-item-disabled' : ''
            } ${item.className || ''}`}
            onClick={() => !item.disabled && handleTabClick(item.id)}
            role="tab"
            aria-selected={activeTab === item.id}
            aria-disabled={item.disabled}
            disabled={item.disabled}
          >
            {item.icon && <span className="tab-icon">{item.icon}</span>}
            <span className="tab-label">{item.label}</span>
          </button>
        ))}
      </div>
      <div className={tabPanelClasses} role="tabpanel">
        {activeItem && activeItem.content}
      </div>
    </div>
  );
};

export default Tabs;
