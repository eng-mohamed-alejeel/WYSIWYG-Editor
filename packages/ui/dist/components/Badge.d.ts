import * as React from "react";
type BadgeVariant = "default" | "secondary" | "success" | "warning" | "danger" | "info" | "outline" | "gradient";
type BadgeSize = "sm" | "md" | "lg";
export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: BadgeVariant;
    size?: BadgeSize;
    clickable?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    removable?: boolean;
    onRemove?: () => void;
    pulse?: boolean;
}
export declare const Badge: React.ForwardRefExoticComponent<BadgeProps & React.RefAttributes<HTMLDivElement>>;
export declare function BadgeExamples(): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=Badge.d.ts.map