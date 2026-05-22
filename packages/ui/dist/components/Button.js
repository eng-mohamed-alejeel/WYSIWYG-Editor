import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const Button = ({ variant = 'primary', size = 'medium', disabled = false, loading = false, icon, iconPosition = 'left', children, className = '', ...props }) => {
    const baseClasses = 'btn';
    const variantClasses = `btn-${variant}`;
    const sizeClasses = `btn-${size}`;
    const disabledClasses = (disabled || loading) ? 'btn-disabled' : '';
    const loadingClasses = loading ? 'btn-loading' : '';
    const iconClasses = icon ? 'btn-with-icon' : '';
    const classes = [
        baseClasses,
        variantClasses,
        sizeClasses,
        disabledClasses,
        loadingClasses,
        iconClasses,
        className
    ].filter(Boolean).join(' ');
    return (_jsxs("button", { className: classes, disabled: disabled || loading, ...props, children: [loading && _jsx("span", { className: "btn-spinner" }), icon && iconPosition === 'left' && (_jsx("span", { className: "btn-icon btn-icon-left", children: icon })), children && _jsx("span", { className: "btn-content", children: children }), icon && iconPosition === 'right' && (_jsx("span", { className: "btn-icon btn-icon-right", children: icon }))] }));
};
export default Button;
//# sourceMappingURL=Button.js.map