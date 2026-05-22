import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Icon } from './Icon';
export const EmptyState = ({ icon = 'inbox', title = 'No data found', description, actionText, onAction, className = '', compact = false, variant = 'default', iconSize = 'large', children }) => {
    const classes = [
        'empty-state',
        `empty-state-${variant}`,
        compact ? 'empty-state-compact' : '',
        className
    ].filter(Boolean).join(' ');
    const renderIcon = () => {
        if (typeof icon === 'string') {
            return _jsx(Icon, { name: icon, size: iconSize });
        }
        return icon;
    };
    return (_jsxs("div", { className: classes, children: [_jsx("div", { className: "empty-state-icon", children: renderIcon() }), title && (_jsx("h3", { className: "empty-state-title", children: title })), description && (_jsx("p", { className: "empty-state-description", children: description })), children && (_jsx("div", { className: "empty-state-content", children: children })), actionText && onAction && (_jsx("button", { className: "empty-state-action", onClick: onAction, children: actionText }))] }));
};
export default EmptyState;
//# sourceMappingURL=EmptyState.js.map