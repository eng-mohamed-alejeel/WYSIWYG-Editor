import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Panel Component
 *
 * A reusable panel component for displaying content in a side panel.
 */
import { useEffect, useRef, useState } from 'react';
export const Panel = ({ isOpen, position = 'right', size = 'medium', title, children, footer, onClose, closeOnClickOutside = true, closeOnEsc = true, className = '', zIndex = 1000, width, resizable = false, minWidth = 200, maxWidth = 800 }) => {
    const panelRef = useRef(null);
    const [panelWidth, setPanelWidth] = useState(width);
    const [isResizing, setIsResizing] = useState(false);
    const startXRef = useRef(0);
    const startWidthRef = useRef(0);
    useEffect(() => {
        const handleEsc = (event) => {
            if (closeOnEsc && event.key === 'Escape' && onClose) {
                onClose();
            }
        };
        const handleClickOutside = (event) => {
            if (closeOnClickOutside &&
                panelRef.current &&
                !panelRef.current.contains(event.target) &&
                onClose) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, closeOnClickOutside, closeOnEsc, onClose]);
    const handleMouseDown = (e) => {
        if (!resizable)
            return;
        setIsResizing(true);
        startXRef.current = e.clientX;
        startWidthRef.current = panelRef.current?.offsetWidth || 0;
        const handleMouseMove = (moveEvent) => {
            const deltaX = position === 'right'
                ? startXRef.current - moveEvent.clientX
                : moveEvent.clientX - startXRef.current;
            const newWidth = Math.max(minWidth, Math.min(maxWidth, startWidthRef.current + deltaX));
            setPanelWidth(newWidth);
        };
        const handleMouseUp = () => {
            setIsResizing(false);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };
    if (!isOpen)
        return null;
    const positionClasses = `panel-${position}`;
    const sizeClasses = `panel-${size}`;
    const classes = ['panel', positionClasses, sizeClasses, className].filter(Boolean).join(' ');
    const panelStyle = {
        zIndex,
        ...(panelWidth ? { width: `${panelWidth}px` } : {})
    };
    return (_jsx("div", { className: "panel-overlay", children: _jsxs("div", { ref: panelRef, className: classes, style: panelStyle, role: "dialog", "aria-modal": "true", "aria-labelledby": title ? 'panel-title' : undefined, children: [title && (_jsxs("div", { className: "panel-header", children: [_jsx("h2", { id: "panel-title", className: "panel-title", children: title }), onClose && (_jsx("button", { className: "panel-close", onClick: onClose, "aria-label": "Close panel", children: "\u00D7" }))] })), _jsx("div", { className: "panel-body", children: children }), footer && (_jsx("div", { className: "panel-footer", children: footer })), resizable && (_jsx("div", { className: `panel-resize-handle panel-resize-handle-${position}`, onMouseDown: handleMouseDown }))] }) }));
};
export default Panel;
//# sourceMappingURL=Panel.js.map