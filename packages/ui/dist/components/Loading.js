import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const Loading = ({ size = 'medium', color, className = '', text, fullscreen = false, variant = 'spinner', overlay = false, overlayColor }) => {
    const sizeClasses = `loading-${size}`;
    const variantClasses = `loading-${variant}`;
    const classes = [
        'loading',
        sizeClasses,
        variantClasses,
        fullscreen ? 'loading-fullscreen' : '',
        overlay ? 'loading-overlay' : '',
        className
    ].filter(Boolean).join(' ');
    const style = {
        ...(color && { '--loading-color': color }),
        ...(overlayColor && { '--loading-overlay-color': overlayColor })
    };
    const renderSpinner = () => (_jsx("svg", { className: "loading-spinner", viewBox: "0 0 50 50", children: _jsx("circle", { className: "loading-spinner-circle", cx: "25", cy: "25", r: "20", fill: "none", strokeWidth: "5" }) }));
    const renderDots = () => (_jsxs("div", { className: "loading-dots", children: [_jsx("div", { className: "loading-dot" }), _jsx("div", { className: "loading-dot" }), _jsx("div", { className: "loading-dot" })] }));
    const renderPulse = () => (_jsx("div", { className: "loading-pulse", children: _jsx("div", { className: "loading-pulse-circle" }) }));
    const renderBars = () => (_jsxs("div", { className: "loading-bars", children: [_jsx("div", { className: "loading-bar" }), _jsx("div", { className: "loading-bar" }), _jsx("div", { className: "loading-bar" }), _jsx("div", { className: "loading-bar" })] }));
    const renderVariant = () => {
        switch (variant) {
            case 'dots':
                return renderDots();
            case 'pulse':
                return renderPulse();
            case 'bars':
                return renderBars();
            case 'spinner':
            default:
                return renderSpinner();
        }
    };
    return (_jsx("div", { className: classes, style: style, children: _jsxs("div", { className: "loading-indicator", children: [renderVariant(), text && _jsx("p", { className: "loading-text", children: text })] }) }));
};
export default Loading;
//# sourceMappingURL=Loading.js.map