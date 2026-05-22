import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Tabs Component
 *
 * A reusable tabs component for organizing content in tabbed views.
 */
import { useState } from 'react';
export const Tabs = ({ items, activeTab: controlledActiveTab, defaultActiveTab, onChange, variant = 'default', position = 'top', fullWidth = false, className = '', tabListClassName = '', tabPanelClassName = '' }) => {
    const [internalActiveTab, setInternalActiveTab] = useState(defaultActiveTab || (items.length > 0 ? items[0].id : ''));
    const activeTab = controlledActiveTab !== undefined ? controlledActiveTab : internalActiveTab;
    const handleTabClick = (tabId) => {
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
    return (_jsxs("div", { className: classes, children: [_jsx("div", { className: tabListClasses, role: "tablist", children: items.map((item) => (_jsxs("button", { className: `tab-item ${activeTab === item.id ? 'tab-item-active' : ''} ${item.disabled ? 'tab-item-disabled' : ''} ${item.className || ''}`, onClick: () => !item.disabled && handleTabClick(item.id), role: "tab", "aria-selected": activeTab === item.id, "aria-disabled": item.disabled, disabled: item.disabled, children: [item.icon && _jsx("span", { className: "tab-icon", children: item.icon }), _jsx("span", { className: "tab-label", children: item.label })] }, item.id))) }), _jsx("div", { className: tabPanelClasses, role: "tabpanel", children: activeItem && activeItem.content })] }));
};
export default Tabs;
//# sourceMappingURL=Tabs.js.map