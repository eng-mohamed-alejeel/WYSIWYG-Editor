import { jsx as _jsx } from "react/jsx-runtime";
export const Divider = ({ orientation = 'horizontal', variant = 'solid', text, color, className = '', thickness = 1, fullWidth = true, spacing = 'medium' }) => {
    const orientationClasses = `divider-${orientation}`;
    const variantClasses = `divider-${variant}`;
    const spacingClasses = `divider-spacing-${spacing}`;
    const fullWidthClasses = fullWidth ? 'divider-full-width' : '';
    const classes = [
        'divider',
        orientationClasses,
        variantClasses,
        spacingClasses,
        fullWidthClasses,
        className
    ].filter(Boolean).join(' ');
    const style = {
        ...(color && { borderColor: color }),
        ...(thickness && { borderWidth: `${thickness}px` })
    };
    return (_jsx("div", { className: classes, style: style, children: text && (_jsx("span", { className: "divider-text", children: text })) }));
};
export default Divider;
//# sourceMappingURL=Divider.js.map