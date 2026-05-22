import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Notification Component
 *
 * A reusable notification component for displaying alerts and messages.
 */
import { useEffect, useState } from 'react';
import { Icon } from './Icon';
export const Notification = ({ type = 'info', title, message, visible = true, onClose, autoClose, className = '', showClose = true, icon, position = 'top-right', actionText, onAction }) => {
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
            return typeof icon === 'string' ? _jsx(Icon, { name: icon }) : icon;
        }
        const defaultIcons = {
            success: 'success',
            error: 'error',
            warning: 'warning',
            info: 'info'
        };
        return _jsx(Icon, { name: defaultIcons[type] });
    };
    if (!isVisible)
        return null;
    const classes = [
        'notification',
        `notification-${type}`,
        `notification-${position}`,
        className
    ].filter(Boolean).join(' ');
    return (_jsxs("div", { className: classes, role: "alert", children: [_jsx("div", { className: "notification-icon", children: getIcon() }), _jsxs("div", { className: "notification-content", children: [title && (_jsx("h4", { className: "notification-title", children: title })), message && (_jsx("p", { className: "notification-message", children: message }))] }), actionText && onAction && (_jsx("button", { className: "notification-action", onClick: onAction, children: actionText })), showClose && (_jsx("button", { className: "notification-close", onClick: handleClose, "aria-label": "Close notification", children: _jsx(Icon, { name: "close", size: "small" }) }))] }));
};
export default Notification;
//# sourceMappingURL=Notification.js.map