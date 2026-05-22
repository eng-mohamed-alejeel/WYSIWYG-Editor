import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Modal Component
 *
 * A reusable modal component with customizable content and actions.
 */
import { useEffect, useRef } from 'react';
export const Modal = ({ isOpen, title, children, footer, onClose, closeOnClickOutside = true, closeOnEsc = true, size = 'medium', className = '', zIndex = 1000 }) => {
    const modalRef = useRef(null);
    useEffect(() => {
        const handleEsc = (event) => {
            if (closeOnEsc && event.key === 'Escape' && onClose) {
                onClose();
            }
        };
        const handleClickOutside = (event) => {
            if (closeOnClickOutside &&
                modalRef.current &&
                !modalRef.current.contains(event.target) &&
                onClose) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            document.addEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = '';
        };
    }, [isOpen, closeOnClickOutside, closeOnEsc, onClose]);
    if (!isOpen)
        return null;
    const sizeClasses = `modal-${size}`;
    const classes = ['modal', sizeClasses, className].filter(Boolean).join(' ');
    return (_jsx("div", { className: "modal-overlay", style: { zIndex }, children: _jsxs("div", { ref: modalRef, className: classes, role: "dialog", "aria-modal": "true", "aria-labelledby": title ? 'modal-title' : undefined, children: [title && (_jsxs("div", { className: "modal-header", children: [_jsx("h2", { id: "modal-title", className: "modal-title", children: title }), onClose && (_jsx("button", { className: "modal-close", onClick: onClose, "aria-label": "Close modal", children: "\u00D7" }))] })), _jsx("div", { className: "modal-body", children: children }), footer && (_jsx("div", { className: "modal-footer", children: footer }))] }) }));
};
export default Modal;
//# sourceMappingURL=Modal.js.map