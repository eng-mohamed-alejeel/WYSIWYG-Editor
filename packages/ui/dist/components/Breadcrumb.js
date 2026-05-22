import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Breadcrumb Component
 *
 * A reusable breadcrumb component for displaying navigation paths.
 */
import React from 'react';
import { Icon } from './Icon';
export const Breadcrumb = ({ items, separator = _jsx(Icon, { name: "chevron-right", size: "small" }), className = '', showIcons = false, size = 'medium', maxItems, collapsedLabel = '...' }) => {
    const renderIcon = (icon) => {
        if (!icon || !showIcons)
            return null;
        if (typeof icon === 'string') {
            return _jsx(Icon, { name: icon, size: "small", className: "breadcrumb-item-icon" });
        }
        return _jsx("span", { className: "breadcrumb-item-icon", children: icon });
    };
    const renderBreadcrumbItem = (item, index, isLast) => {
        const itemClasses = [
            'breadcrumb-item',
            `breadcrumb-item-${size}`,
            item.active ? 'breadcrumb-item-active' : '',
            item.className || ''
        ].filter(Boolean).join(' ');
        const content = (_jsxs(_Fragment, { children: [renderIcon(item.icon), _jsx("span", { className: "breadcrumb-item-label", children: item.label })] }));
        return (_jsxs(React.Fragment, { children: [_jsx("li", { className: itemClasses, children: item.href ? (_jsx("a", { href: item.href, onClick: (e) => {
                            e.preventDefault();
                            item.onClick?.();
                        }, className: "breadcrumb-item-link", children: content })) : (_jsx("button", { onClick: item.onClick, disabled: item.active, className: "breadcrumb-item-button", children: content })) }), !isLast && (_jsx("li", { className: "breadcrumb-separator", children: separator }))] }, item.id));
    };
    const sizeClasses = `breadcrumb-${size}`;
    const classes = ['breadcrumb', sizeClasses, className].filter(Boolean).join(' ');
    let displayItems = items;
    let showCollapsed = false;
    if (maxItems && items.length > maxItems) {
        const firstItems = items.slice(0, 1);
        const lastItems = items.slice(-(maxItems - 1));
        displayItems = [...firstItems, ...lastItems];
        showCollapsed = true;
    }
    return (_jsx("nav", { className: classes, "aria-label": "Breadcrumb", children: _jsx("ol", { className: "breadcrumb-list", children: displayItems.map((item, index) => {
                const isLast = index === displayItems.length - 1;
                if (showCollapsed && index === 1) {
                    return (_jsxs(React.Fragment, { children: [_jsx("li", { className: "breadcrumb-item breadcrumb-item-collapsed", children: collapsedLabel }), _jsx("li", { className: "breadcrumb-separator", children: separator })] }, "collapsed"));
                }
                return renderBreadcrumbItem(item, index, isLast);
            }) }) }));
};
export default Breadcrumb;
//# sourceMappingURL=Breadcrumb.js.map