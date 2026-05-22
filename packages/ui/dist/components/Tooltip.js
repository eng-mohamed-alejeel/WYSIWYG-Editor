import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Tooltip Component
 *
 * A reusable tooltip component for displaying additional information on hover.
 */
import { useState, useRef, useEffect } from 'react';
export const Tooltip = ({ content, position = 'top', children, delay = 200, disabled = false, className = '', arrowClassName = '', contentClassName = '' }) => {
    const [isVisible, setIsVisible] = useState(false);
    const timeoutRef = useRef();
    const tooltipRef = useRef(null);
    const triggerRef = useRef(null);
    const handleMouseEnter = () => {
        if (!disabled) {
            timeoutRef.current = setTimeout(() => {
                setIsVisible(true);
            }, delay);
        }
    };
    const handleMouseLeave = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsVisible(false);
    };
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);
    const positionClasses = `tooltip-${position}`;
    const classes = ['tooltip', positionClasses, className].filter(Boolean).join(' ');
    return (_jsxs("div", { className: "tooltip-wrapper", ref: triggerRef, onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave, children: [children, isVisible && !disabled && (_jsxs("div", { ref: tooltipRef, className: classes, role: "tooltip", children: [_jsx("div", { className: `tooltip-arrow ${arrowClassName}` }), _jsx("div", { className: `tooltip-content ${contentClassName}`, children: content })] }))] }));
};
export default Tooltip;
//# sourceMappingURL=Tooltip.js.map