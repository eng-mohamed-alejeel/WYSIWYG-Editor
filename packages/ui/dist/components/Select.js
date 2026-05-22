import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Select Component
 *
 * A reusable select dropdown component with multiple variants and states.
 */
import { useState, useRef, useEffect } from 'react';
export const Select = ({ options, value, onChange, variant = 'default', size = 'medium', disabled = false, error = false, errorMessage, label, placeholder = 'Select an option', fullWidth = false, className = '' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(options.find(opt => opt.value === value));
    const selectRef = useRef(null);
    useEffect(() => {
        const option = options.find(opt => opt.value === value);
        setSelectedOption(option);
    }, [value, options]);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectRef.current &&
                !selectRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    const handleToggle = () => {
        if (!disabled) {
            setIsOpen(!isOpen);
        }
    };
    const handleOptionClick = (option) => {
        if (!option.disabled) {
            setSelectedOption(option);
            setIsOpen(false);
            onChange?.(option.value, option);
        }
    };
    const baseClasses = 'select';
    const variantClasses = `select-${variant}`;
    const sizeClasses = `select-${size}`;
    const disabledClasses = disabled ? 'select-disabled' : '';
    const errorClasses = error ? 'select-error' : '';
    const fullWidthClasses = fullWidth ? 'select-full-width' : '';
    const openClasses = isOpen ? 'select-open' : '';
    const classes = [
        baseClasses,
        variantClasses,
        sizeClasses,
        disabledClasses,
        errorClasses,
        fullWidthClasses,
        openClasses,
        className
    ].filter(Boolean).join(' ');
    return (_jsxs("div", { className: `select-wrapper ${fullWidth ? 'select-wrapper-full-width' : ''}`, ref: selectRef, children: [label && (_jsx("label", { className: "select-label", children: label })), _jsxs("div", { className: classes, onClick: handleToggle, role: "combobox", "aria-expanded": isOpen, "aria-haspopup": "listbox", "aria-disabled": disabled, children: [_jsx("div", { className: "select-value", children: selectedOption ? (_jsxs(_Fragment, { children: [selectedOption.icon && (_jsx("span", { className: "select-option-icon", children: selectedOption.icon })), _jsx("span", { className: "select-option-label", children: selectedOption.label })] })) : (_jsx("span", { className: "select-placeholder", children: placeholder })) }), _jsx("span", { className: "select-arrow", children: _jsx("svg", { width: "12", height: "12", viewBox: "0 0 12 12", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { d: "M2 4L6 8L10 4", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) }) })] }), isOpen && (_jsx("div", { className: "select-dropdown", role: "listbox", children: options.map((option) => (_jsxs("div", { className: `select-option ${option.disabled ? 'select-option-disabled' : ''} ${selectedOption?.value === option.value
                        ? 'select-option-selected'
                        : ''}`, onClick: () => handleOptionClick(option), role: "option", "aria-selected": selectedOption?.value === option.value, "aria-disabled": option.disabled, children: [option.icon && (_jsx("span", { className: "select-option-icon", children: option.icon })), _jsx("span", { className: "select-option-label", children: option.label })] }, option.value))) })), error && errorMessage && (_jsx("span", { className: "select-error-message", children: errorMessage }))] }));
};
export default Select;
//# sourceMappingURL=Select.js.map