import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Dropdown Component
 *
 * A reusable dropdown component for displaying dropdown menus.
 */
import React, { useState, useRef, useEffect } from 'react';
import { Icon } from './Icon';
export const Dropdown = ({ items, trigger, position = 'bottom-left', isOpen: controlledIsOpen, onOpenChange, className = '', width = 'auto', disabled = false, closeOnClick = true, closeOnClickOutside = true, zIndex = 1000, showArrow = false, animation = 'fade' }) => {
    const [internalIsOpen, setInternalIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
    const handleToggle = () => {
        if (disabled)
            return;
        const newIsOpen = !isOpen;
        setInternalIsOpen(newIsOpen);
        onOpenChange?.(newIsOpen);
    };
    const handleClose = () => {
        setInternalIsOpen(false);
        onOpenChange?.(false);
    };
    const handleItemClick = (item) => {
        if (item.disabled || item.header || item.divider)
            return;
        item.onClick?.();
        if (closeOnClick) {
            handleClose();
        }
    };
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (closeOnClickOutside &&
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)) {
                handleClose();
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, closeOnClickOutside]);
    const positionClasses = `dropdown-${position}`;
    const animationClasses = animation !== 'none' ? `dropdown-animation-${animation}` : '';
    const classes = [
        'dropdown',
        positionClasses,
        animationClasses,
        isOpen ? 'dropdown-open' : '',
        className
    ].filter(Boolean).join(' ');
    const renderIcon = (icon) => {
        if (!icon)
            return null;
        if (typeof icon === 'string') {
            return _jsx(Icon, { name: icon, size: "small" });
        }
        return icon;
    };
    const renderBadge = (badge) => {
        if (badge === undefined || badge === null)
            return null;
        return (_jsx("span", { className: "dropdown-item-badge", children: badge }));
    };
    return (_jsxs("div", { className: "dropdown-wrapper", ref: dropdownRef, children: [_jsx("div", { onClick: handleToggle, children: trigger }), isOpen && (_jsxs("div", { className: classes, style: { width: typeof width === 'number' ? `${width}px` : width, zIndex }, children: [showArrow && _jsx("div", { className: "dropdown-arrow" }), _jsx("div", { className: "dropdown-menu", children: items.map((item, index) => (_jsx(React.Fragment, { children: item.divider ? (_jsx("div", { className: "dropdown-divider" })) : item.header ? (_jsx("div", { className: `dropdown-item dropdown-item-header ${item.className || ''}`, children: item.label })) : (_jsxs("button", { className: `dropdown-item ${item.disabled ? 'dropdown-item-disabled' : ''} ${item.className || ''}`, onClick: () => handleItemClick(item), disabled: item.disabled, children: [renderIcon(item.icon), _jsx("span", { className: "dropdown-item-label", children: item.label }), item.shortcut && (_jsx("span", { className: "dropdown-item-shortcut", children: item.shortcut })), renderBadge(item.badge)] })) }, item.id || index))) })] }))] }));
};
export default Dropdown;
//# sourceMappingURL=Dropdown.js.map