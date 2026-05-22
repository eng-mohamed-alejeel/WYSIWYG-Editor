import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Menu Component
 *
 * A reusable menu component for displaying navigation menus.
 */
import React, { useState } from 'react';
import { Icon } from './Icon';
export const Menu = ({ items, variant = 'vertical', size = 'medium', activeItemId, onItemClick, className = '', showIcons = true, collapseSubmenus = false, collapsible = false, collapsed = false, onCollapseToggle, showBadges = true, theme = 'light' }) => {
    const [expandedItems, setExpandedItems] = useState(new Set());
    const handleItemClick = (item) => {
        if (item.disabled)
            return;
        if (item.submenu && !collapseSubmenus) {
            const newExpanded = new Set(expandedItems);
            if (newExpanded.has(item.id)) {
                newExpanded.delete(item.id);
            }
            else {
                newExpanded.add(item.id);
            }
            setExpandedItems(newExpanded);
        }
        if (!item.submenu || collapseSubmenus) {
            onItemClick?.(item);
            item.onClick?.();
        }
    };
    const handleCollapseToggle = () => {
        onCollapseToggle?.();
    };
    const renderIcon = (icon) => {
        if (!icon || !showIcons)
            return null;
        if (typeof icon === 'string') {
            return _jsx(Icon, { name: icon, size: "small" });
        }
        return icon;
    };
    const renderBadge = (badge) => {
        if (!badge || !showBadges)
            return null;
        return (_jsx("span", { className: "menu-item-badge", children: badge }));
    };
    const renderMenuItem = (item, level = 0) => {
        const isActive = activeItemId === item.id;
        const hasSubmenu = item.submenu && item.submenu.length > 0;
        const isExpanded = expandedItems.has(item.id);
        const itemClasses = [
            'menu-item',
            `menu-item-${size}`,
            isActive ? 'menu-item-active' : '',
            item.disabled ? 'menu-item-disabled' : '',
            hasSubmenu ? 'menu-item-has-submenu' : '',
            item.className || ''
        ].filter(Boolean).join(' ');
        const submenuClasses = [
            'menu-submenu',
            isExpanded ? 'menu-submenu-expanded' : '',
            `menu-submenu-level-${level + 1}`
        ].filter(Boolean).join(' ');
        const content = (_jsxs(_Fragment, { children: [renderIcon(item.icon), _jsx("span", { className: "menu-item-label", children: item.label }), renderBadge(item.badge), hasSubmenu && (_jsx(Icon, { name: "chevron-right", size: "small", className: `menu-item-chevron ${isExpanded ? 'menu-item-chevron-expanded' : ''}` }))] }));
        return (_jsxs(React.Fragment, { children: [item.href ? (_jsx("a", { href: item.href, className: itemClasses, onClick: (e) => {
                        e.preventDefault();
                        handleItemClick(item);
                    }, target: item.external ? '_blank' : undefined, rel: item.external ? 'noopener noreferrer' : undefined, children: content })) : (_jsx("button", { className: itemClasses, onClick: () => handleItemClick(item), disabled: item.disabled, children: content })), hasSubmenu && !collapseSubmenus && (_jsx("div", { className: submenuClasses, children: item.submenu.map((subItem) => renderMenuItem(subItem, level + 1)) }))] }, item.id));
    };
    const variantClasses = `menu-${variant}`;
    const sizeClasses = `menu-${size}`;
    const themeClasses = `menu-${theme}`;
    const collapsedClasses = collapsed ? 'menu-collapsed' : '';
    const classes = [
        'menu',
        variantClasses,
        sizeClasses,
        themeClasses,
        collapsedClasses,
        className
    ].filter(Boolean).join(' ');
    return (_jsxs("nav", { className: classes, children: [collapsible && (_jsx("button", { className: "menu-collapse-toggle", onClick: handleCollapseToggle, "aria-label": collapsed ? 'Expand menu' : 'Collapse menu', children: _jsx(Icon, { name: collapsed ? 'menu' : 'arrow-left', size: "small" }) })), _jsx("ul", { className: "menu-list", children: items.map((item) => (_jsx("li", { className: "menu-list-item", children: renderMenuItem(item) }, item.id))) })] }));
};
export default Menu;
//# sourceMappingURL=Menu.js.map