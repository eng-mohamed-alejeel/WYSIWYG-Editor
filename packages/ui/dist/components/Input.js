import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const Input = ({ variant = 'default', inputSize = 'medium', disabled = false, error = false, errorMessage, label, icon, prefix, suffix, fullWidth = false, className = '', ...props }) => {
    const baseClasses = 'input';
    const variantClasses = `input-${variant}`;
    const sizeClasses = `input-${inputSize}`;
    const disabledClasses = disabled ? 'input-disabled' : '';
    const errorClasses = error ? 'input-error' : '';
    const fullWidthClasses = fullWidth ? 'input-full-width' : '';
    const iconClasses = icon ? 'input-with-icon' : '';
    const prefixClasses = prefix ? 'input-with-prefix' : '';
    const suffixClasses = suffix ? 'input-with-suffix' : '';
    const classes = [
        baseClasses,
        variantClasses,
        sizeClasses,
        disabledClasses,
        errorClasses,
        fullWidthClasses,
        iconClasses,
        prefixClasses,
        suffixClasses,
        className
    ].filter(Boolean).join(' ');
    return (_jsxs("div", { className: `input-wrapper ${fullWidth ? 'input-wrapper-full-width' : ''}`, children: [label && (_jsx("label", { className: "input-label", children: label })), _jsxs("div", { className: "input-container", children: [icon && _jsx("span", { className: "input-icon", children: icon }), prefix && _jsx("span", { className: "input-prefix", children: prefix }), _jsx("input", { className: classes, disabled: disabled, ...props }), suffix && _jsx("span", { className: "input-suffix", children: suffix })] }), error && errorMessage && (_jsx("span", { className: "input-error-message", children: errorMessage }))] }));
};
export default Input;
//# sourceMappingURL=Input.js.map