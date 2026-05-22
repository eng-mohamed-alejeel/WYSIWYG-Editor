import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Color Picker Component
 *
 * A reusable color picker component for selecting colors.
 */
import { useState, useRef, useEffect } from 'react';
export const ColorPicker = ({ value, onChange, disabled = false, showPreview = true, showInput = true, showPresets = true, presetColors = [
    '#000000',
    '#FFFFFF',
    '#FF0000',
    '#00FF00',
    '#0000FF',
    '#FFFF00',
    '#FF00FF',
    '#00FFFF',
    '#FFA500',
    '#800080',
    '#008080',
    '#FFC0CB'
], size = 'medium', className = '', label, showAlpha = false, format = 'hex', position = 'bottom-right' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentColor, setCurrentColor] = useState(value);
    const pickerRef = useRef(null);
    const inputRef = useRef(null);
    useEffect(() => {
        setCurrentColor(value);
    }, [value]);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (pickerRef.current &&
                !pickerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);
    const handleToggle = () => {
        if (!disabled) {
            setIsOpen(!isOpen);
        }
    };
    const handleColorChange = (newColor) => {
        setCurrentColor(newColor);
        onChange(newColor);
    };
    const handleInputChange = (e) => {
        const newColor = e.target.value;
        setCurrentColor(newColor);
        onChange(newColor);
    };
    const handlePresetClick = (color) => {
        handleColorChange(color);
    };
    const sizeClasses = `color-picker-${size}`;
    const disabledClasses = disabled ? 'color-picker-disabled' : '';
    const positionClasses = `color-picker-${position}`;
    const classes = [
        'color-picker',
        sizeClasses,
        disabledClasses,
        className
    ].filter(Boolean).join(' ');
    const popupClasses = [
        'color-picker-popup',
        positionClasses,
        isOpen ? 'color-picker-popup-open' : ''
    ].filter(Boolean).join(' ');
    return (_jsxs("div", { className: classes, ref: pickerRef, children: [label && (_jsx("label", { className: "color-picker-label", children: label })), _jsxs("div", { className: "color-picker-wrapper", children: [showPreview && (_jsx("div", { className: "color-picker-preview", style: { backgroundColor: currentColor }, onClick: handleToggle })), showInput && (_jsx("input", { ref: inputRef, type: "color", value: currentColor, onChange: handleInputChange, disabled: disabled, className: "color-picker-input" })), _jsx("button", { className: "color-picker-button", onClick: handleToggle, disabled: disabled, children: _jsxs("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [_jsx("path", { d: "M8 8L8 14", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" }), _jsx("path", { d: "M8 2C8 2 10 4 10 6C10 8 8 8 8 8C8 8 6 8 6 6C6 4 8 2 8 2Z", fill: "currentColor" })] }) })] }), isOpen && (_jsxs("div", { className: popupClasses, children: [showPresets && (_jsx("div", { className: "color-picker-presets", children: presetColors.map((color, index) => (_jsx("button", { className: "color-picker-preset", style: { backgroundColor: color }, onClick: () => handlePresetClick(color), "aria-label": `Select color ${color}` }, index))) })), showInput && (_jsx("div", { className: "color-picker-value", children: _jsx("input", { type: "text", value: currentColor, onChange: handleInputChange, disabled: disabled, className: "color-picker-text-input" }) }))] }))] }));
};
export default ColorPicker;
//# sourceMappingURL=ColorPicker.js.map