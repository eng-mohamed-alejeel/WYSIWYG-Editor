import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { X, Sparkles } from "lucide-react";
function cn(...classes) {
    return classes.filter(Boolean).join(" ");
}
const variantClasses = {
    default: "border border-slate-200 bg-slate-900 text-white hover:bg-slate-800",
    secondary: "border border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200",
    success: "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
    warning: "border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100",
    danger: "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100",
    info: "border border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100",
    outline: "border border-slate-300 bg-transparent text-slate-700 hover:bg-slate-100",
    gradient: "bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 text-white border-transparent shadow-lg",
};
const sizeClasses = {
    sm: "h-5 px-2 text-[10px]",
    md: "h-7 px-3 text-xs",
    lg: "h-9 px-4 text-sm",
};
export const Badge = React.forwardRef(({ className, variant = "default", size = "md", clickable = false, leftIcon, rightIcon, removable = false, onRemove, pulse = false, children, ...props }, ref) => {
    return (_jsxs("div", { ref: ref, className: cn("inline-flex items-center justify-center gap-1.5 rounded-full font-semibold tracking-wide whitespace-nowrap transition-all duration-200 select-none", variantClasses[variant], sizeClasses[size], clickable && "cursor-pointer active:scale-95", pulse && "animate-pulse", className), ...props, children: [leftIcon && (_jsx("span", { className: "flex items-center justify-center", children: leftIcon })), _jsx("span", { children: children }), rightIcon && (_jsx("span", { className: "flex items-center justify-center", children: rightIcon })), removable && (_jsx("button", { type: "button", onClick: (e) => {
                    e.stopPropagation();
                    onRemove?.();
                }, className: "ml-1 rounded-full p-0.5 opacity-70 transition hover:bg-black/10 hover:opacity-100", children: _jsx(X, { className: "h-3 w-3" }) }))] }));
});
Badge.displayName = "Badge";
/* -------------------------------------------------------------------------- */
/*                               Usage Examples                               */
/* -------------------------------------------------------------------------- */
export function BadgeExamples() {
    return (_jsxs("div", { className: "flex flex-wrap items-center gap-3 p-6", children: [_jsx(Badge, { children: "Default" }), _jsx(Badge, { variant: "secondary", children: "Secondary" }), _jsx(Badge, { variant: "success", children: "Active" }), _jsx(Badge, { variant: "warning", children: "Pending" }), _jsx(Badge, { variant: "danger", children: "Blocked" }), _jsx(Badge, { variant: "info", children: "Info" }), _jsx(Badge, { variant: "outline", children: "Outline" }), _jsx(Badge, { variant: "gradient", leftIcon: _jsx(Sparkles, { className: "h-3.5 w-3.5" }), children: "Premium" }), _jsx(Badge, { size: "sm", children: "Small" }), _jsx(Badge, { size: "lg", children: "Large Badge" }), _jsx(Badge, { removable: true, onRemove: () => console.log("Removed"), children: "Removable" }), _jsx(Badge, { clickable: true, pulse: true, children: "Live" })] }));
}
//# sourceMappingURL=Badge.js.map