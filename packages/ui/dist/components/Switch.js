import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const Switch = ({ checked, onChange, disabled = false, label, size = 'medium', color = 'primary', className = '', id, name, labelOnLeft = false }) => {
    const handleChange = (event) => {
        onChange(event.target.checked);
    };
    const sizeClasses = `switch-${size}`;
    const colorClasses = `switch-${color}`;
    const disabledClasses = disabled ? 'switch-disabled' : '';
    const classes = [
        'switch',
        sizeClasses,
        colorClasses,
        disabledClasses,
        className
    ].filter(Boolean).join(' ');
    const switchId = id || `switch-${Math.random().toString(36).substr(2, 9)}`;
    return (_jsxs("div", { className: `switch-wrapper ${labelOnLeft ? 'switch-wrapper-label-left' : ''}`, children: [label && (_jsx("label", { htmlFor: switchId, className: "switch-label", children: label })), _jsxs("label", { className: classes, children: [_jsx("input", { type: "checkbox", id: switchId, name: name, checked: checked, onChange: handleChange, disabled: disabled, className: "switch-input" }), _jsx("span", { className: "switch-slider" })] })] }));
};
export default Switch;
//# sourceMappingURL=Switch.js.map