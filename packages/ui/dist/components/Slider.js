import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Slider Component
 *
 * A reusable slider component for selecting values from a range.
 */
import { useState, useRef, useEffect } from 'react';
export const Slider = ({ value, onChange, min = 0, max = 100, step = 1, disabled = false, showValue = true, showTooltip = true, className = '', color = 'primary', size = 'medium', label, showMarks = false, marksCount = 5 }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [showTooltipValue, setShowTooltipValue] = useState(false);
    const sliderRef = useRef(null);
    const thumbRef = useRef(null);
    const percentage = ((value - min) / (max - min)) * 100;
    const handleMouseDown = (e) => {
        if (disabled)
            return;
        setIsDragging(true);
        updateValue(e);
    };
    const handleMouseMove = (e) => {
        if (!isDragging || disabled)
            return;
        updateValue(e);
    };
    const handleMouseUp = () => {
        setIsDragging(false);
    };
    const updateValue = (e) => {
        if (!sliderRef.current)
            return;
        const rect = sliderRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const width = rect.width;
        const rawValue = (x / width) * (max - min) + min;
        const steppedValue = Math.round(rawValue / step) * step;
        const clampedValue = Math.max(min, Math.min(max, steppedValue));
        onChange(clampedValue);
    };
    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging]);
    const sizeClasses = `slider-${size}`;
    const colorClasses = `slider-${color}`;
    const disabledClasses = disabled ? 'slider-disabled' : '';
    const classes = [
        'slider',
        sizeClasses,
        colorClasses,
        disabledClasses,
        className
    ].filter(Boolean).join(' ');
    const marks = showMarks ? Array.from({ length: marksCount }, (_, i) => {
        const markValue = min + ((max - min) * i) / (marksCount - 1);
        return {
            value: markValue,
            percentage: ((markValue - min) / (max - min)) * 100
        };
    }) : [];
    return (_jsxs("div", { className: "slider-wrapper", children: [label && (_jsx("label", { className: "slider-label", children: label })), _jsx("div", { className: classes, children: _jsxs("div", { ref: sliderRef, className: "slider-track", onMouseDown: handleMouseDown, children: [_jsx("div", { className: "slider-fill", style: { width: `${percentage}%` } }), marks.map((mark, index) => (_jsx("div", { className: "slider-mark", style: { left: `${mark.percentage}%` } }, index))), _jsx("div", { ref: thumbRef, className: "slider-thumb", style: { left: `${percentage}%` }, onMouseEnter: () => setShowTooltipValue(true), onMouseLeave: () => setShowTooltipValue(false), children: showTooltip && (showTooltipValue || isDragging) && (_jsx("div", { className: "slider-tooltip", children: value })) })] }) }), showValue && (_jsx("div", { className: "slider-value", children: value }))] }));
};
export default Slider;
//# sourceMappingURL=Slider.js.map