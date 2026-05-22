/**
 * Validation Schemas using Zod
 *
 * This module provides validation schemas for all data structures
 * used throughout the platform.
 */
import { z } from 'zod';
/**
 * Component ID validation
 */
export declare const ComponentIdSchema: z.ZodString;
/**
 * Component Type validation
 */
export declare const ComponentTypeSchema: z.ZodString;
/**
 * Breakpoint validation
 */
export declare const BreakpointSchema: z.ZodEnum<["mobile", "tablet", "desktop", "wide"]>;
/**
 * Style Property validation
 */
export declare const StylePropertySchema: z.ZodEnum<["paddingTop", "paddingBottom", "paddingLeft", "paddingRight", "marginTop", "marginBottom", "marginLeft", "marginRight", "backgroundColor", "color", "fontSize", "fontWeight", "lineHeight", "textAlign", "borderRadius", "borderWidth", "borderColor", "borderStyle", "boxShadow", "opacity", "display", "flexDirection", "justifyContent", "alignItems", "gap", "gridTemplateColumns", "gridTemplateRows", "width", "height", "maxWidth", "minWidth", "maxHeight", "minHeight", "position", "top", "right", "bottom", "left", "zIndex"]>;
/**
 * Style Value validation
 */
export declare const StyleValueSchema: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
/**
 * Style Object validation
 */
export declare const StyleObjectSchema: z.ZodRecord<z.ZodEnum<["paddingTop", "paddingBottom", "paddingLeft", "paddingRight", "marginTop", "marginBottom", "marginLeft", "marginRight", "backgroundColor", "color", "fontSize", "fontWeight", "lineHeight", "textAlign", "borderRadius", "borderWidth", "borderColor", "borderStyle", "boxShadow", "opacity", "display", "flexDirection", "justifyContent", "alignItems", "gap", "gridTemplateColumns", "gridTemplateRows", "width", "height", "maxWidth", "minWidth", "maxHeight", "minHeight", "position", "top", "right", "bottom", "left", "zIndex"]>, z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
/**
 * Responsive Styles validation
 */
export declare const ResponsiveStylesSchema: z.ZodOptional<z.ZodRecord<z.ZodEnum<["mobile", "tablet", "desktop", "wide"]>, z.ZodRecord<z.ZodEnum<["paddingTop", "paddingBottom", "paddingLeft", "paddingRight", "marginTop", "marginBottom", "marginLeft", "marginRight", "backgroundColor", "color", "fontSize", "fontWeight", "lineHeight", "textAlign", "borderRadius", "borderWidth", "borderColor", "borderStyle", "boxShadow", "opacity", "display", "flexDirection", "justifyContent", "alignItems", "gap", "gridTemplateColumns", "gridTemplateRows", "width", "height", "maxWidth", "minWidth", "maxHeight", "minHeight", "position", "top", "right", "bottom", "left", "zIndex"]>, z.ZodUnion<[z.ZodString, z.ZodNumber]>>>>;
/**
 * Component Props validation
 */
export declare const ComponentPropsSchema: z.ZodRecord<z.ZodString, z.ZodAny>;
/**
 * Component Metadata validation
 */
export declare const ComponentMetadataSchema: z.ZodOptional<z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    category: z.ZodOptional<z.ZodString>;
    locked: z.ZodOptional<z.ZodBoolean>;
    visible: z.ZodOptional<z.ZodBoolean>;
    customData: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    name?: string;
    description?: string;
    tags?: string[];
    category?: string;
    locked?: boolean;
    visible?: boolean;
    customData?: Record<string, any>;
}, {
    name?: string;
    description?: string;
    tags?: string[];
    category?: string;
    locked?: boolean;
    visible?: boolean;
    customData?: Record<string, any>;
}>>;
/**
 * Component Node validation
 */
export declare const ComponentNodeSchema: any;
export type ComponentNodeValidation = z.infer<typeof ComponentNodeSchema>;
/**
 * Inspector Field Type validation
 */
export declare const InspectorFieldTypeSchema: z.ZodEnum<["text", "number", "color", "select", "multiselect", "boolean", "image", "link", "richtext", "code", "array", "object", "style"]>;
/**
 * Validation Rule validation
 */
export declare const ValidationRuleSchema: z.ZodObject<{
    type: z.ZodEnum<["required", "min", "max", "pattern", "custom"]>;
    value: z.ZodOptional<z.ZodAny>;
    message: z.ZodString;
    validator: z.ZodOptional<z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    type?: "required" | "min" | "max" | "pattern" | "custom";
    value?: any;
    message?: string;
    validator?: (...args: unknown[]) => unknown;
}, {
    type?: "required" | "min" | "max" | "pattern" | "custom";
    value?: any;
    message?: string;
    validator?: (...args: unknown[]) => unknown;
}>;
/**
 * Inspector Field validation
 */
export declare const InspectorFieldSchema: z.ZodObject<{
    name: z.ZodString;
    label: z.ZodString;
    type: z.ZodEnum<["text", "number", "color", "select", "multiselect", "boolean", "image", "link", "richtext", "code", "array", "object", "style"]>;
    defaultValue: z.ZodOptional<z.ZodAny>;
    options: z.ZodOptional<z.ZodArray<z.ZodObject<{
        label: z.ZodString;
        value: z.ZodAny;
    }, "strip", z.ZodTypeAny, {
        label?: string;
        value?: any;
    }, {
        label?: string;
        value?: any;
    }>, "many">>;
    validation: z.ZodOptional<z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<["required", "min", "max", "pattern", "custom"]>;
        value: z.ZodOptional<z.ZodAny>;
        message: z.ZodString;
        validator: z.ZodOptional<z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>>;
    }, "strip", z.ZodTypeAny, {
        type?: "required" | "min" | "max" | "pattern" | "custom";
        value?: any;
        message?: string;
        validator?: (...args: unknown[]) => unknown;
    }, {
        type?: "required" | "min" | "max" | "pattern" | "custom";
        value?: any;
        message?: string;
        validator?: (...args: unknown[]) => unknown;
    }>, "many">>;
    group: z.ZodOptional<z.ZodString>;
    visible: z.ZodOptional<z.ZodBoolean>;
    disabled: z.ZodOptional<z.ZodBoolean>;
    placeholder: z.ZodOptional<z.ZodString>;
    helpText: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type?: "number" | "boolean" | "object" | "color" | "text" | "select" | "multiselect" | "image" | "link" | "richtext" | "code" | "array" | "style";
    label?: string;
    options?: {
        label?: string;
        value?: any;
    }[];
    validation?: {
        type?: "required" | "min" | "max" | "pattern" | "custom";
        value?: any;
        message?: string;
        validator?: (...args: unknown[]) => unknown;
    }[];
    name?: string;
    visible?: boolean;
    defaultValue?: any;
    group?: string;
    disabled?: boolean;
    placeholder?: string;
    helpText?: string;
}, {
    type?: "number" | "boolean" | "object" | "color" | "text" | "select" | "multiselect" | "image" | "link" | "richtext" | "code" | "array" | "style";
    label?: string;
    options?: {
        label?: string;
        value?: any;
    }[];
    validation?: {
        type?: "required" | "min" | "max" | "pattern" | "custom";
        value?: any;
        message?: string;
        validator?: (...args: unknown[]) => unknown;
    }[];
    name?: string;
    visible?: boolean;
    defaultValue?: any;
    group?: string;
    disabled?: boolean;
    placeholder?: string;
    helpText?: string;
}>;
/**
 * Component Definition validation
 */
export declare const ComponentDefinitionSchema: z.ZodObject<{
    type: z.ZodString;
    label: z.ZodString;
    icon: z.ZodString;
    category: z.ZodString;
    defaultProps: z.ZodRecord<z.ZodString, z.ZodAny>;
    defaultStyles: z.ZodRecord<z.ZodEnum<["paddingTop", "paddingBottom", "paddingLeft", "paddingRight", "marginTop", "marginBottom", "marginLeft", "marginRight", "backgroundColor", "color", "fontSize", "fontWeight", "lineHeight", "textAlign", "borderRadius", "borderWidth", "borderColor", "borderStyle", "boxShadow", "opacity", "display", "flexDirection", "justifyContent", "alignItems", "gap", "gridTemplateColumns", "gridTemplateRows", "width", "height", "maxWidth", "minWidth", "maxHeight", "minHeight", "position", "top", "right", "bottom", "left", "zIndex"]>, z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
    defaultResponsiveStyles: z.ZodOptional<z.ZodRecord<z.ZodEnum<["mobile", "tablet", "desktop", "wide"]>, z.ZodRecord<z.ZodEnum<["paddingTop", "paddingBottom", "paddingLeft", "paddingRight", "marginTop", "marginBottom", "marginLeft", "marginRight", "backgroundColor", "color", "fontSize", "fontWeight", "lineHeight", "textAlign", "borderRadius", "borderWidth", "borderColor", "borderStyle", "boxShadow", "opacity", "display", "flexDirection", "justifyContent", "alignItems", "gap", "gridTemplateColumns", "gridTemplateRows", "width", "height", "maxWidth", "minWidth", "maxHeight", "minHeight", "position", "top", "right", "bottom", "left", "zIndex"]>, z.ZodUnion<[z.ZodString, z.ZodNumber]>>>>;
    allowedChildren: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    allowedParents: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    inspector: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        label: z.ZodString;
        type: z.ZodEnum<["text", "number", "color", "select", "multiselect", "boolean", "image", "link", "richtext", "code", "array", "object", "style"]>;
        defaultValue: z.ZodOptional<z.ZodAny>;
        options: z.ZodOptional<z.ZodArray<z.ZodObject<{
            label: z.ZodString;
            value: z.ZodAny;
        }, "strip", z.ZodTypeAny, {
            label?: string;
            value?: any;
        }, {
            label?: string;
            value?: any;
        }>, "many">>;
        validation: z.ZodOptional<z.ZodArray<z.ZodObject<{
            type: z.ZodEnum<["required", "min", "max", "pattern", "custom"]>;
            value: z.ZodOptional<z.ZodAny>;
            message: z.ZodString;
            validator: z.ZodOptional<z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>>;
        }, "strip", z.ZodTypeAny, {
            type?: "required" | "min" | "max" | "pattern" | "custom";
            value?: any;
            message?: string;
            validator?: (...args: unknown[]) => unknown;
        }, {
            type?: "required" | "min" | "max" | "pattern" | "custom";
            value?: any;
            message?: string;
            validator?: (...args: unknown[]) => unknown;
        }>, "many">>;
        group: z.ZodOptional<z.ZodString>;
        visible: z.ZodOptional<z.ZodBoolean>;
        disabled: z.ZodOptional<z.ZodBoolean>;
        placeholder: z.ZodOptional<z.ZodString>;
        helpText: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type?: "number" | "boolean" | "object" | "color" | "text" | "select" | "multiselect" | "image" | "link" | "richtext" | "code" | "array" | "style";
        label?: string;
        options?: {
            label?: string;
            value?: any;
        }[];
        validation?: {
            type?: "required" | "min" | "max" | "pattern" | "custom";
            value?: any;
            message?: string;
            validator?: (...args: unknown[]) => unknown;
        }[];
        name?: string;
        visible?: boolean;
        defaultValue?: any;
        group?: string;
        disabled?: boolean;
        placeholder?: string;
        helpText?: string;
    }, {
        type?: "number" | "boolean" | "object" | "color" | "text" | "select" | "multiselect" | "image" | "link" | "richtext" | "code" | "array" | "style";
        label?: string;
        options?: {
            label?: string;
            value?: any;
        }[];
        validation?: {
            type?: "required" | "min" | "max" | "pattern" | "custom";
            value?: any;
            message?: string;
            validator?: (...args: unknown[]) => unknown;
        }[];
        name?: string;
        visible?: boolean;
        defaultValue?: any;
        group?: string;
        disabled?: boolean;
        placeholder?: string;
        helpText?: string;
    }>, "many">;
    isContainer: z.ZodOptional<z.ZodBoolean>;
    isVoid: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    type?: string;
    label?: string;
    category?: string;
    icon?: string;
    defaultProps?: Record<string, any>;
    defaultStyles?: Partial<Record<"paddingTop" | "paddingBottom" | "paddingLeft" | "paddingRight" | "marginTop" | "marginBottom" | "marginLeft" | "marginRight" | "backgroundColor" | "color" | "fontSize" | "fontWeight" | "lineHeight" | "textAlign" | "borderRadius" | "borderWidth" | "borderColor" | "borderStyle" | "boxShadow" | "opacity" | "display" | "flexDirection" | "justifyContent" | "alignItems" | "gap" | "gridTemplateColumns" | "gridTemplateRows" | "width" | "height" | "maxWidth" | "minWidth" | "maxHeight" | "minHeight" | "position" | "top" | "right" | "bottom" | "left" | "zIndex", string | number>>;
    defaultResponsiveStyles?: Partial<Record<"mobile" | "tablet" | "desktop" | "wide", Partial<Record<"paddingTop" | "paddingBottom" | "paddingLeft" | "paddingRight" | "marginTop" | "marginBottom" | "marginLeft" | "marginRight" | "backgroundColor" | "color" | "fontSize" | "fontWeight" | "lineHeight" | "textAlign" | "borderRadius" | "borderWidth" | "borderColor" | "borderStyle" | "boxShadow" | "opacity" | "display" | "flexDirection" | "justifyContent" | "alignItems" | "gap" | "gridTemplateColumns" | "gridTemplateRows" | "width" | "height" | "maxWidth" | "minWidth" | "maxHeight" | "minHeight" | "position" | "top" | "right" | "bottom" | "left" | "zIndex", string | number>>>>;
    allowedChildren?: string[];
    allowedParents?: string[];
    inspector?: {
        type?: "number" | "boolean" | "object" | "color" | "text" | "select" | "multiselect" | "image" | "link" | "richtext" | "code" | "array" | "style";
        label?: string;
        options?: {
            label?: string;
            value?: any;
        }[];
        validation?: {
            type?: "required" | "min" | "max" | "pattern" | "custom";
            value?: any;
            message?: string;
            validator?: (...args: unknown[]) => unknown;
        }[];
        name?: string;
        visible?: boolean;
        defaultValue?: any;
        group?: string;
        disabled?: boolean;
        placeholder?: string;
        helpText?: string;
    }[];
    isContainer?: boolean;
    isVoid?: boolean;
}, {
    type?: string;
    label?: string;
    category?: string;
    icon?: string;
    defaultProps?: Record<string, any>;
    defaultStyles?: Partial<Record<"paddingTop" | "paddingBottom" | "paddingLeft" | "paddingRight" | "marginTop" | "marginBottom" | "marginLeft" | "marginRight" | "backgroundColor" | "color" | "fontSize" | "fontWeight" | "lineHeight" | "textAlign" | "borderRadius" | "borderWidth" | "borderColor" | "borderStyle" | "boxShadow" | "opacity" | "display" | "flexDirection" | "justifyContent" | "alignItems" | "gap" | "gridTemplateColumns" | "gridTemplateRows" | "width" | "height" | "maxWidth" | "minWidth" | "maxHeight" | "minHeight" | "position" | "top" | "right" | "bottom" | "left" | "zIndex", string | number>>;
    defaultResponsiveStyles?: Partial<Record<"mobile" | "tablet" | "desktop" | "wide", Partial<Record<"paddingTop" | "paddingBottom" | "paddingLeft" | "paddingRight" | "marginTop" | "marginBottom" | "marginLeft" | "marginRight" | "backgroundColor" | "color" | "fontSize" | "fontWeight" | "lineHeight" | "textAlign" | "borderRadius" | "borderWidth" | "borderColor" | "borderStyle" | "boxShadow" | "opacity" | "display" | "flexDirection" | "justifyContent" | "alignItems" | "gap" | "gridTemplateColumns" | "gridTemplateRows" | "width" | "height" | "maxWidth" | "minWidth" | "maxHeight" | "minHeight" | "position" | "top" | "right" | "bottom" | "left" | "zIndex", string | number>>>>;
    allowedChildren?: string[];
    allowedParents?: string[];
    inspector?: {
        type?: "number" | "boolean" | "object" | "color" | "text" | "select" | "multiselect" | "image" | "link" | "richtext" | "code" | "array" | "style";
        label?: string;
        options?: {
            label?: string;
            value?: any;
        }[];
        validation?: {
            type?: "required" | "min" | "max" | "pattern" | "custom";
            value?: any;
            message?: string;
            validator?: (...args: unknown[]) => unknown;
        }[];
        name?: string;
        visible?: boolean;
        defaultValue?: any;
        group?: string;
        disabled?: boolean;
        placeholder?: string;
        helpText?: string;
    }[];
    isContainer?: boolean;
    isVoid?: boolean;
}>;
/**
 * Page Metadata validation
 */
export declare const PageMetadataSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    keywords: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    author: z.ZodOptional<z.ZodString>;
    customData: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    title?: string;
    description?: string;
    customData?: Record<string, any>;
    keywords?: string[];
    author?: string;
}, {
    title?: string;
    description?: string;
    customData?: Record<string, any>;
    keywords?: string[];
    author?: string;
}>;
/**
 * Page Settings validation
 */
export declare const PageSettingsSchema: z.ZodObject<{
    seo: z.ZodOptional<z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        ogImage: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        title?: string;
        description?: string;
        ogImage?: string;
    }, {
        title?: string;
        description?: string;
        ogImage?: string;
    }>>;
    customHead: z.ZodOptional<z.ZodString>;
    customBody: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    seo?: {
        title?: string;
        description?: string;
        ogImage?: string;
    };
    customHead?: string;
    customBody?: string;
}, {
    seo?: {
        title?: string;
        description?: string;
        ogImage?: string;
    };
    customHead?: string;
    customBody?: string;
}>;
/**
 * Page validation
 */
export declare const PageSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    slug: z.ZodString;
    components: z.ZodArray<z.ZodLazy<any>, "many">;
    metadata: z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        keywords: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        author: z.ZodOptional<z.ZodString>;
        customData: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
        title?: string;
        description?: string;
        customData?: Record<string, any>;
        keywords?: string[];
        author?: string;
    }, {
        title?: string;
        description?: string;
        customData?: Record<string, any>;
        keywords?: string[];
        author?: string;
    }>;
    settings: z.ZodObject<{
        seo: z.ZodOptional<z.ZodObject<{
            title: z.ZodOptional<z.ZodString>;
            description: z.ZodOptional<z.ZodString>;
            ogImage: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            title?: string;
            description?: string;
            ogImage?: string;
        }, {
            title?: string;
            description?: string;
            ogImage?: string;
        }>>;
        customHead: z.ZodOptional<z.ZodString>;
        customBody: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        seo?: {
            title?: string;
            description?: string;
            ogImage?: string;
        };
        customHead?: string;
        customBody?: string;
    }, {
        seo?: {
            title?: string;
            description?: string;
            ogImage?: string;
        };
        customHead?: string;
        customBody?: string;
    }>;
}, "strip", z.ZodTypeAny, {
    id?: string;
    metadata?: {
        title?: string;
        description?: string;
        customData?: Record<string, any>;
        keywords?: string[];
        author?: string;
    };
    name?: string;
    slug?: string;
    components?: any[];
    settings?: {
        seo?: {
            title?: string;
            description?: string;
            ogImage?: string;
        };
        customHead?: string;
        customBody?: string;
    };
}, {
    id?: string;
    metadata?: {
        title?: string;
        description?: string;
        customData?: Record<string, any>;
        keywords?: string[];
        author?: string;
    };
    name?: string;
    slug?: string;
    components?: any[];
    settings?: {
        seo?: {
            title?: string;
            description?: string;
            ogImage?: string;
        };
        customHead?: string;
        customBody?: string;
    };
}>;
/**
 * Theme Colors validation
 */
export declare const ThemeColorsSchema: z.ZodObject<{
    primary: z.ZodString;
    secondary: z.ZodString;
    accent: z.ZodString;
    background: z.ZodString;
    foreground: z.ZodString;
    success: z.ZodString;
    warning: z.ZodString;
    error: z.ZodString;
    info: z.ZodString;
    custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    custom?: Record<string, string>;
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    foreground?: string;
    success?: string;
    warning?: string;
    error?: string;
    info?: string;
}, {
    custom?: Record<string, string>;
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    foreground?: string;
    success?: string;
    warning?: string;
    error?: string;
    info?: string;
}>;
/**
 * Theme Typography validation
 */
export declare const ThemeTypographySchema: z.ZodObject<{
    fontFamily: z.ZodObject<{
        heading: z.ZodString;
        body: z.ZodString;
        mono: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        body?: string;
        heading?: string;
        mono?: string;
    }, {
        body?: string;
        heading?: string;
        mono?: string;
    }>;
    fontSize: z.ZodObject<{
        xs: z.ZodString;
        sm: z.ZodString;
        base: z.ZodString;
        lg: z.ZodString;
        xl: z.ZodString;
        '2xl': z.ZodString;
        '3xl': z.ZodString;
        '4xl': z.ZodString;
    }, "strip", z.ZodTypeAny, {
        base?: string;
        xs?: string;
        sm?: string;
        lg?: string;
        xl?: string;
        '2xl'?: string;
        '3xl'?: string;
        '4xl'?: string;
    }, {
        base?: string;
        xs?: string;
        sm?: string;
        lg?: string;
        xl?: string;
        '2xl'?: string;
        '3xl'?: string;
        '4xl'?: string;
    }>;
    fontWeight: z.ZodObject<{
        light: z.ZodNumber;
        normal: z.ZodNumber;
        medium: z.ZodNumber;
        semibold: z.ZodNumber;
        bold: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        bold?: number;
        light?: number;
        normal?: number;
        medium?: number;
        semibold?: number;
    }, {
        bold?: number;
        light?: number;
        normal?: number;
        medium?: number;
        semibold?: number;
    }>;
    lineHeight: z.ZodObject<{
        tight: z.ZodNumber;
        normal: z.ZodNumber;
        relaxed: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        normal?: number;
        tight?: number;
        relaxed?: number;
    }, {
        normal?: number;
        tight?: number;
        relaxed?: number;
    }>;
}, "strip", z.ZodTypeAny, {
    fontSize?: {
        base?: string;
        xs?: string;
        sm?: string;
        lg?: string;
        xl?: string;
        '2xl'?: string;
        '3xl'?: string;
        '4xl'?: string;
    };
    fontWeight?: {
        bold?: number;
        light?: number;
        normal?: number;
        medium?: number;
        semibold?: number;
    };
    lineHeight?: {
        normal?: number;
        tight?: number;
        relaxed?: number;
    };
    fontFamily?: {
        body?: string;
        heading?: string;
        mono?: string;
    };
}, {
    fontSize?: {
        base?: string;
        xs?: string;
        sm?: string;
        lg?: string;
        xl?: string;
        '2xl'?: string;
        '3xl'?: string;
        '4xl'?: string;
    };
    fontWeight?: {
        bold?: number;
        light?: number;
        normal?: number;
        medium?: number;
        semibold?: number;
    };
    lineHeight?: {
        normal?: number;
        tight?: number;
        relaxed?: number;
    };
    fontFamily?: {
        body?: string;
        heading?: string;
        mono?: string;
    };
}>;
/**
 * Theme Spacing validation
 */
export declare const ThemeSpacingSchema: z.ZodObject<{
    xs: z.ZodString;
    sm: z.ZodString;
    md: z.ZodString;
    lg: z.ZodString;
    xl: z.ZodString;
    '2xl': z.ZodString;
}, "strip", z.ZodTypeAny, {
    xs?: string;
    sm?: string;
    lg?: string;
    xl?: string;
    '2xl'?: string;
    md?: string;
}, {
    xs?: string;
    sm?: string;
    lg?: string;
    xl?: string;
    '2xl'?: string;
    md?: string;
}>;
/**
 * Theme Border Radius validation
 */
export declare const ThemeBorderRadiusSchema: z.ZodObject<{
    none: z.ZodString;
    sm: z.ZodString;
    md: z.ZodString;
    lg: z.ZodString;
    xl: z.ZodString;
    full: z.ZodString;
}, "strip", z.ZodTypeAny, {
    sm?: string;
    lg?: string;
    xl?: string;
    md?: string;
    none?: string;
    full?: string;
}, {
    sm?: string;
    lg?: string;
    xl?: string;
    md?: string;
    none?: string;
    full?: string;
}>;
/**
 * Theme Shadows validation
 */
export declare const ThemeShadowsSchema: z.ZodObject<{
    sm: z.ZodString;
    md: z.ZodString;
    lg: z.ZodString;
    xl: z.ZodString;
}, "strip", z.ZodTypeAny, {
    sm?: string;
    lg?: string;
    xl?: string;
    md?: string;
}, {
    sm?: string;
    lg?: string;
    xl?: string;
    md?: string;
}>;
/**
 * Theme Breakpoints validation
 */
export declare const ThemeBreakpointsSchema: z.ZodObject<{
    mobile: z.ZodString;
    tablet: z.ZodString;
    desktop: z.ZodString;
    wide: z.ZodString;
}, "strip", z.ZodTypeAny, {
    mobile?: string;
    tablet?: string;
    desktop?: string;
    wide?: string;
}, {
    mobile?: string;
    tablet?: string;
    desktop?: string;
    wide?: string;
}>;
/**
 * Theme validation
 */
export declare const ThemeSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    colors: z.ZodObject<{
        primary: z.ZodString;
        secondary: z.ZodString;
        accent: z.ZodString;
        background: z.ZodString;
        foreground: z.ZodString;
        success: z.ZodString;
        warning: z.ZodString;
        error: z.ZodString;
        info: z.ZodString;
        custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        custom?: Record<string, string>;
        primary?: string;
        secondary?: string;
        accent?: string;
        background?: string;
        foreground?: string;
        success?: string;
        warning?: string;
        error?: string;
        info?: string;
    }, {
        custom?: Record<string, string>;
        primary?: string;
        secondary?: string;
        accent?: string;
        background?: string;
        foreground?: string;
        success?: string;
        warning?: string;
        error?: string;
        info?: string;
    }>;
    typography: z.ZodObject<{
        fontFamily: z.ZodObject<{
            heading: z.ZodString;
            body: z.ZodString;
            mono: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            body?: string;
            heading?: string;
            mono?: string;
        }, {
            body?: string;
            heading?: string;
            mono?: string;
        }>;
        fontSize: z.ZodObject<{
            xs: z.ZodString;
            sm: z.ZodString;
            base: z.ZodString;
            lg: z.ZodString;
            xl: z.ZodString;
            '2xl': z.ZodString;
            '3xl': z.ZodString;
            '4xl': z.ZodString;
        }, "strip", z.ZodTypeAny, {
            base?: string;
            xs?: string;
            sm?: string;
            lg?: string;
            xl?: string;
            '2xl'?: string;
            '3xl'?: string;
            '4xl'?: string;
        }, {
            base?: string;
            xs?: string;
            sm?: string;
            lg?: string;
            xl?: string;
            '2xl'?: string;
            '3xl'?: string;
            '4xl'?: string;
        }>;
        fontWeight: z.ZodObject<{
            light: z.ZodNumber;
            normal: z.ZodNumber;
            medium: z.ZodNumber;
            semibold: z.ZodNumber;
            bold: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            bold?: number;
            light?: number;
            normal?: number;
            medium?: number;
            semibold?: number;
        }, {
            bold?: number;
            light?: number;
            normal?: number;
            medium?: number;
            semibold?: number;
        }>;
        lineHeight: z.ZodObject<{
            tight: z.ZodNumber;
            normal: z.ZodNumber;
            relaxed: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            normal?: number;
            tight?: number;
            relaxed?: number;
        }, {
            normal?: number;
            tight?: number;
            relaxed?: number;
        }>;
    }, "strip", z.ZodTypeAny, {
        fontSize?: {
            base?: string;
            xs?: string;
            sm?: string;
            lg?: string;
            xl?: string;
            '2xl'?: string;
            '3xl'?: string;
            '4xl'?: string;
        };
        fontWeight?: {
            bold?: number;
            light?: number;
            normal?: number;
            medium?: number;
            semibold?: number;
        };
        lineHeight?: {
            normal?: number;
            tight?: number;
            relaxed?: number;
        };
        fontFamily?: {
            body?: string;
            heading?: string;
            mono?: string;
        };
    }, {
        fontSize?: {
            base?: string;
            xs?: string;
            sm?: string;
            lg?: string;
            xl?: string;
            '2xl'?: string;
            '3xl'?: string;
            '4xl'?: string;
        };
        fontWeight?: {
            bold?: number;
            light?: number;
            normal?: number;
            medium?: number;
            semibold?: number;
        };
        lineHeight?: {
            normal?: number;
            tight?: number;
            relaxed?: number;
        };
        fontFamily?: {
            body?: string;
            heading?: string;
            mono?: string;
        };
    }>;
    spacing: z.ZodObject<{
        xs: z.ZodString;
        sm: z.ZodString;
        md: z.ZodString;
        lg: z.ZodString;
        xl: z.ZodString;
        '2xl': z.ZodString;
    }, "strip", z.ZodTypeAny, {
        xs?: string;
        sm?: string;
        lg?: string;
        xl?: string;
        '2xl'?: string;
        md?: string;
    }, {
        xs?: string;
        sm?: string;
        lg?: string;
        xl?: string;
        '2xl'?: string;
        md?: string;
    }>;
    borderRadius: z.ZodObject<{
        none: z.ZodString;
        sm: z.ZodString;
        md: z.ZodString;
        lg: z.ZodString;
        xl: z.ZodString;
        full: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        sm?: string;
        lg?: string;
        xl?: string;
        md?: string;
        none?: string;
        full?: string;
    }, {
        sm?: string;
        lg?: string;
        xl?: string;
        md?: string;
        none?: string;
        full?: string;
    }>;
    shadows: z.ZodObject<{
        sm: z.ZodString;
        md: z.ZodString;
        lg: z.ZodString;
        xl: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        sm?: string;
        lg?: string;
        xl?: string;
        md?: string;
    }, {
        sm?: string;
        lg?: string;
        xl?: string;
        md?: string;
    }>;
    breakpoints: z.ZodObject<{
        mobile: z.ZodString;
        tablet: z.ZodString;
        desktop: z.ZodString;
        wide: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        mobile?: string;
        tablet?: string;
        desktop?: string;
        wide?: string;
    }, {
        mobile?: string;
        tablet?: string;
        desktop?: string;
        wide?: string;
    }>;
    customTokens: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    borderRadius?: {
        sm?: string;
        lg?: string;
        xl?: string;
        md?: string;
        none?: string;
        full?: string;
    };
    id?: string;
    name?: string;
    colors?: {
        custom?: Record<string, string>;
        primary?: string;
        secondary?: string;
        accent?: string;
        background?: string;
        foreground?: string;
        success?: string;
        warning?: string;
        error?: string;
        info?: string;
    };
    typography?: {
        fontSize?: {
            base?: string;
            xs?: string;
            sm?: string;
            lg?: string;
            xl?: string;
            '2xl'?: string;
            '3xl'?: string;
            '4xl'?: string;
        };
        fontWeight?: {
            bold?: number;
            light?: number;
            normal?: number;
            medium?: number;
            semibold?: number;
        };
        lineHeight?: {
            normal?: number;
            tight?: number;
            relaxed?: number;
        };
        fontFamily?: {
            body?: string;
            heading?: string;
            mono?: string;
        };
    };
    spacing?: {
        xs?: string;
        sm?: string;
        lg?: string;
        xl?: string;
        '2xl'?: string;
        md?: string;
    };
    shadows?: {
        sm?: string;
        lg?: string;
        xl?: string;
        md?: string;
    };
    breakpoints?: {
        mobile?: string;
        tablet?: string;
        desktop?: string;
        wide?: string;
    };
    customTokens?: Record<string, any>;
}, {
    borderRadius?: {
        sm?: string;
        lg?: string;
        xl?: string;
        md?: string;
        none?: string;
        full?: string;
    };
    id?: string;
    name?: string;
    colors?: {
        custom?: Record<string, string>;
        primary?: string;
        secondary?: string;
        accent?: string;
        background?: string;
        foreground?: string;
        success?: string;
        warning?: string;
        error?: string;
        info?: string;
    };
    typography?: {
        fontSize?: {
            base?: string;
            xs?: string;
            sm?: string;
            lg?: string;
            xl?: string;
            '2xl'?: string;
            '3xl'?: string;
            '4xl'?: string;
        };
        fontWeight?: {
            bold?: number;
            light?: number;
            normal?: number;
            medium?: number;
            semibold?: number;
        };
        lineHeight?: {
            normal?: number;
            tight?: number;
            relaxed?: number;
        };
        fontFamily?: {
            body?: string;
            heading?: string;
            mono?: string;
        };
    };
    spacing?: {
        xs?: string;
        sm?: string;
        lg?: string;
        xl?: string;
        '2xl'?: string;
        md?: string;
    };
    shadows?: {
        sm?: string;
        lg?: string;
        xl?: string;
        md?: string;
    };
    breakpoints?: {
        mobile?: string;
        tablet?: string;
        desktop?: string;
        wide?: string;
    };
    customTokens?: Record<string, any>;
}>;
/**
 * Asset Type validation
 */
export declare const AssetTypeSchema: z.ZodEnum<["image", "video", "audio", "font", "file", "code"]>;
/**
 * Asset Metadata validation
 */
export declare const AssetMetadataSchema: z.ZodOptional<z.ZodObject<{
    width: z.ZodOptional<z.ZodNumber>;
    height: z.ZodOptional<z.ZodNumber>;
    alt: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    customData: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    width?: number;
    height?: number;
    title?: string;
    customData?: Record<string, any>;
    alt?: string;
}, {
    width?: number;
    height?: number;
    title?: string;
    customData?: Record<string, any>;
    alt?: string;
}>>;
/**
 * Asset validation
 */
export declare const AssetSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    type: z.ZodEnum<["image", "video", "audio", "font", "file", "code"]>;
    url: z.ZodString;
    size: z.ZodNumber;
    mimeType: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodObject<{
        width: z.ZodOptional<z.ZodNumber>;
        height: z.ZodOptional<z.ZodNumber>;
        alt: z.ZodOptional<z.ZodString>;
        title: z.ZodOptional<z.ZodString>;
        customData: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
        width?: number;
        height?: number;
        title?: string;
        customData?: Record<string, any>;
        alt?: string;
    }, {
        width?: number;
        height?: number;
        title?: string;
        customData?: Record<string, any>;
        alt?: string;
    }>>;
}, "strip", z.ZodTypeAny, {
    id?: string;
    type?: "image" | "code" | "video" | "audio" | "font" | "file";
    metadata?: {
        width?: number;
        height?: number;
        title?: string;
        customData?: Record<string, any>;
        alt?: string;
    };
    name?: string;
    url?: string;
    size?: number;
    mimeType?: string;
}, {
    id?: string;
    type?: "image" | "code" | "video" | "audio" | "font" | "file";
    metadata?: {
        width?: number;
        height?: number;
        title?: string;
        customData?: Record<string, any>;
        alt?: string;
    };
    name?: string;
    url?: string;
    size?: number;
    mimeType?: string;
}>;
/**
 * Project Settings validation
 */
export declare const ProjectSettingsSchema: z.ZodObject<{
    defaultBreakpoint: z.ZodEnum<["mobile", "tablet", "desktop", "wide"]>;
    enableAiFeatures: z.ZodBoolean;
    enableAnalytics: z.ZodBoolean;
    customScripts: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    customStyles: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    defaultBreakpoint?: "mobile" | "tablet" | "desktop" | "wide";
    enableAiFeatures?: boolean;
    enableAnalytics?: boolean;
    customScripts?: string[];
    customStyles?: string;
}, {
    defaultBreakpoint?: "mobile" | "tablet" | "desktop" | "wide";
    enableAiFeatures?: boolean;
    enableAnalytics?: boolean;
    customScripts?: string[];
    customStyles?: string;
}>;
/**
 * Project Metadata validation
 */
export declare const ProjectMetadataSchema: z.ZodObject<{
    version: z.ZodString;
    platform: z.ZodOptional<z.ZodEnum<["odoo", "wordpress", "nextjs", "html"]>>;
    exportSettings: z.ZodOptional<z.ZodObject<{
        format: z.ZodEnum<["html", "react", "wordpress", "odoo"]>;
        optimizeAssets: z.ZodBoolean;
        minify: z.ZodBoolean;
        includeSourceMaps: z.ZodBoolean;
        customExportPath: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        format?: "odoo" | "wordpress" | "html" | "react";
        optimizeAssets?: boolean;
        minify?: boolean;
        includeSourceMaps?: boolean;
        customExportPath?: string;
    }, {
        format?: "odoo" | "wordpress" | "html" | "react";
        optimizeAssets?: boolean;
        minify?: boolean;
        includeSourceMaps?: boolean;
        customExportPath?: string;
    }>>;
}, "strip", z.ZodTypeAny, {
    version?: string;
    platform?: "odoo" | "wordpress" | "nextjs" | "html";
    exportSettings?: {
        format?: "odoo" | "wordpress" | "html" | "react";
        optimizeAssets?: boolean;
        minify?: boolean;
        includeSourceMaps?: boolean;
        customExportPath?: string;
    };
}, {
    version?: string;
    platform?: "odoo" | "wordpress" | "nextjs" | "html";
    exportSettings?: {
        format?: "odoo" | "wordpress" | "html" | "react";
        optimizeAssets?: boolean;
        minify?: boolean;
        includeSourceMaps?: boolean;
        customExportPath?: string;
    };
}>;
/**
 * Project validation
 */
export declare const ProjectSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    pages: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        slug: z.ZodString;
        components: z.ZodArray<z.ZodLazy<any>, "many">;
        metadata: z.ZodObject<{
            title: z.ZodOptional<z.ZodString>;
            description: z.ZodOptional<z.ZodString>;
            keywords: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            author: z.ZodOptional<z.ZodString>;
            customData: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
        }, "strip", z.ZodTypeAny, {
            title?: string;
            description?: string;
            customData?: Record<string, any>;
            keywords?: string[];
            author?: string;
        }, {
            title?: string;
            description?: string;
            customData?: Record<string, any>;
            keywords?: string[];
            author?: string;
        }>;
        settings: z.ZodObject<{
            seo: z.ZodOptional<z.ZodObject<{
                title: z.ZodOptional<z.ZodString>;
                description: z.ZodOptional<z.ZodString>;
                ogImage: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                title?: string;
                description?: string;
                ogImage?: string;
            }, {
                title?: string;
                description?: string;
                ogImage?: string;
            }>>;
            customHead: z.ZodOptional<z.ZodString>;
            customBody: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            seo?: {
                title?: string;
                description?: string;
                ogImage?: string;
            };
            customHead?: string;
            customBody?: string;
        }, {
            seo?: {
                title?: string;
                description?: string;
                ogImage?: string;
            };
            customHead?: string;
            customBody?: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        id?: string;
        metadata?: {
            title?: string;
            description?: string;
            customData?: Record<string, any>;
            keywords?: string[];
            author?: string;
        };
        name?: string;
        slug?: string;
        components?: any[];
        settings?: {
            seo?: {
                title?: string;
                description?: string;
                ogImage?: string;
            };
            customHead?: string;
            customBody?: string;
        };
    }, {
        id?: string;
        metadata?: {
            title?: string;
            description?: string;
            customData?: Record<string, any>;
            keywords?: string[];
            author?: string;
        };
        name?: string;
        slug?: string;
        components?: any[];
        settings?: {
            seo?: {
                title?: string;
                description?: string;
                ogImage?: string;
            };
            customHead?: string;
            customBody?: string;
        };
    }>, "many">;
    theme: z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        colors: z.ZodObject<{
            primary: z.ZodString;
            secondary: z.ZodString;
            accent: z.ZodString;
            background: z.ZodString;
            foreground: z.ZodString;
            success: z.ZodString;
            warning: z.ZodString;
            error: z.ZodString;
            info: z.ZodString;
            custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        }, "strip", z.ZodTypeAny, {
            custom?: Record<string, string>;
            primary?: string;
            secondary?: string;
            accent?: string;
            background?: string;
            foreground?: string;
            success?: string;
            warning?: string;
            error?: string;
            info?: string;
        }, {
            custom?: Record<string, string>;
            primary?: string;
            secondary?: string;
            accent?: string;
            background?: string;
            foreground?: string;
            success?: string;
            warning?: string;
            error?: string;
            info?: string;
        }>;
        typography: z.ZodObject<{
            fontFamily: z.ZodObject<{
                heading: z.ZodString;
                body: z.ZodString;
                mono: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                body?: string;
                heading?: string;
                mono?: string;
            }, {
                body?: string;
                heading?: string;
                mono?: string;
            }>;
            fontSize: z.ZodObject<{
                xs: z.ZodString;
                sm: z.ZodString;
                base: z.ZodString;
                lg: z.ZodString;
                xl: z.ZodString;
                '2xl': z.ZodString;
                '3xl': z.ZodString;
                '4xl': z.ZodString;
            }, "strip", z.ZodTypeAny, {
                base?: string;
                xs?: string;
                sm?: string;
                lg?: string;
                xl?: string;
                '2xl'?: string;
                '3xl'?: string;
                '4xl'?: string;
            }, {
                base?: string;
                xs?: string;
                sm?: string;
                lg?: string;
                xl?: string;
                '2xl'?: string;
                '3xl'?: string;
                '4xl'?: string;
            }>;
            fontWeight: z.ZodObject<{
                light: z.ZodNumber;
                normal: z.ZodNumber;
                medium: z.ZodNumber;
                semibold: z.ZodNumber;
                bold: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                bold?: number;
                light?: number;
                normal?: number;
                medium?: number;
                semibold?: number;
            }, {
                bold?: number;
                light?: number;
                normal?: number;
                medium?: number;
                semibold?: number;
            }>;
            lineHeight: z.ZodObject<{
                tight: z.ZodNumber;
                normal: z.ZodNumber;
                relaxed: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                normal?: number;
                tight?: number;
                relaxed?: number;
            }, {
                normal?: number;
                tight?: number;
                relaxed?: number;
            }>;
        }, "strip", z.ZodTypeAny, {
            fontSize?: {
                base?: string;
                xs?: string;
                sm?: string;
                lg?: string;
                xl?: string;
                '2xl'?: string;
                '3xl'?: string;
                '4xl'?: string;
            };
            fontWeight?: {
                bold?: number;
                light?: number;
                normal?: number;
                medium?: number;
                semibold?: number;
            };
            lineHeight?: {
                normal?: number;
                tight?: number;
                relaxed?: number;
            };
            fontFamily?: {
                body?: string;
                heading?: string;
                mono?: string;
            };
        }, {
            fontSize?: {
                base?: string;
                xs?: string;
                sm?: string;
                lg?: string;
                xl?: string;
                '2xl'?: string;
                '3xl'?: string;
                '4xl'?: string;
            };
            fontWeight?: {
                bold?: number;
                light?: number;
                normal?: number;
                medium?: number;
                semibold?: number;
            };
            lineHeight?: {
                normal?: number;
                tight?: number;
                relaxed?: number;
            };
            fontFamily?: {
                body?: string;
                heading?: string;
                mono?: string;
            };
        }>;
        spacing: z.ZodObject<{
            xs: z.ZodString;
            sm: z.ZodString;
            md: z.ZodString;
            lg: z.ZodString;
            xl: z.ZodString;
            '2xl': z.ZodString;
        }, "strip", z.ZodTypeAny, {
            xs?: string;
            sm?: string;
            lg?: string;
            xl?: string;
            '2xl'?: string;
            md?: string;
        }, {
            xs?: string;
            sm?: string;
            lg?: string;
            xl?: string;
            '2xl'?: string;
            md?: string;
        }>;
        borderRadius: z.ZodObject<{
            none: z.ZodString;
            sm: z.ZodString;
            md: z.ZodString;
            lg: z.ZodString;
            xl: z.ZodString;
            full: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            sm?: string;
            lg?: string;
            xl?: string;
            md?: string;
            none?: string;
            full?: string;
        }, {
            sm?: string;
            lg?: string;
            xl?: string;
            md?: string;
            none?: string;
            full?: string;
        }>;
        shadows: z.ZodObject<{
            sm: z.ZodString;
            md: z.ZodString;
            lg: z.ZodString;
            xl: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            sm?: string;
            lg?: string;
            xl?: string;
            md?: string;
        }, {
            sm?: string;
            lg?: string;
            xl?: string;
            md?: string;
        }>;
        breakpoints: z.ZodObject<{
            mobile: z.ZodString;
            tablet: z.ZodString;
            desktop: z.ZodString;
            wide: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            mobile?: string;
            tablet?: string;
            desktop?: string;
            wide?: string;
        }, {
            mobile?: string;
            tablet?: string;
            desktop?: string;
            wide?: string;
        }>;
        customTokens: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
        borderRadius?: {
            sm?: string;
            lg?: string;
            xl?: string;
            md?: string;
            none?: string;
            full?: string;
        };
        id?: string;
        name?: string;
        colors?: {
            custom?: Record<string, string>;
            primary?: string;
            secondary?: string;
            accent?: string;
            background?: string;
            foreground?: string;
            success?: string;
            warning?: string;
            error?: string;
            info?: string;
        };
        typography?: {
            fontSize?: {
                base?: string;
                xs?: string;
                sm?: string;
                lg?: string;
                xl?: string;
                '2xl'?: string;
                '3xl'?: string;
                '4xl'?: string;
            };
            fontWeight?: {
                bold?: number;
                light?: number;
                normal?: number;
                medium?: number;
                semibold?: number;
            };
            lineHeight?: {
                normal?: number;
                tight?: number;
                relaxed?: number;
            };
            fontFamily?: {
                body?: string;
                heading?: string;
                mono?: string;
            };
        };
        spacing?: {
            xs?: string;
            sm?: string;
            lg?: string;
            xl?: string;
            '2xl'?: string;
            md?: string;
        };
        shadows?: {
            sm?: string;
            lg?: string;
            xl?: string;
            md?: string;
        };
        breakpoints?: {
            mobile?: string;
            tablet?: string;
            desktop?: string;
            wide?: string;
        };
        customTokens?: Record<string, any>;
    }, {
        borderRadius?: {
            sm?: string;
            lg?: string;
            xl?: string;
            md?: string;
            none?: string;
            full?: string;
        };
        id?: string;
        name?: string;
        colors?: {
            custom?: Record<string, string>;
            primary?: string;
            secondary?: string;
            accent?: string;
            background?: string;
            foreground?: string;
            success?: string;
            warning?: string;
            error?: string;
            info?: string;
        };
        typography?: {
            fontSize?: {
                base?: string;
                xs?: string;
                sm?: string;
                lg?: string;
                xl?: string;
                '2xl'?: string;
                '3xl'?: string;
                '4xl'?: string;
            };
            fontWeight?: {
                bold?: number;
                light?: number;
                normal?: number;
                medium?: number;
                semibold?: number;
            };
            lineHeight?: {
                normal?: number;
                tight?: number;
                relaxed?: number;
            };
            fontFamily?: {
                body?: string;
                heading?: string;
                mono?: string;
            };
        };
        spacing?: {
            xs?: string;
            sm?: string;
            lg?: string;
            xl?: string;
            '2xl'?: string;
            md?: string;
        };
        shadows?: {
            sm?: string;
            lg?: string;
            xl?: string;
            md?: string;
        };
        breakpoints?: {
            mobile?: string;
            tablet?: string;
            desktop?: string;
            wide?: string;
        };
        customTokens?: Record<string, any>;
    }>;
    assets: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        type: z.ZodEnum<["image", "video", "audio", "font", "file", "code"]>;
        url: z.ZodString;
        size: z.ZodNumber;
        mimeType: z.ZodOptional<z.ZodString>;
        metadata: z.ZodOptional<z.ZodObject<{
            width: z.ZodOptional<z.ZodNumber>;
            height: z.ZodOptional<z.ZodNumber>;
            alt: z.ZodOptional<z.ZodString>;
            title: z.ZodOptional<z.ZodString>;
            customData: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
        }, "strip", z.ZodTypeAny, {
            width?: number;
            height?: number;
            title?: string;
            customData?: Record<string, any>;
            alt?: string;
        }, {
            width?: number;
            height?: number;
            title?: string;
            customData?: Record<string, any>;
            alt?: string;
        }>>;
    }, "strip", z.ZodTypeAny, {
        id?: string;
        type?: "image" | "code" | "video" | "audio" | "font" | "file";
        metadata?: {
            width?: number;
            height?: number;
            title?: string;
            customData?: Record<string, any>;
            alt?: string;
        };
        name?: string;
        url?: string;
        size?: number;
        mimeType?: string;
    }, {
        id?: string;
        type?: "image" | "code" | "video" | "audio" | "font" | "file";
        metadata?: {
            width?: number;
            height?: number;
            title?: string;
            customData?: Record<string, any>;
            alt?: string;
        };
        name?: string;
        url?: string;
        size?: number;
        mimeType?: string;
    }>, "many">;
    settings: z.ZodObject<{
        defaultBreakpoint: z.ZodEnum<["mobile", "tablet", "desktop", "wide"]>;
        enableAiFeatures: z.ZodBoolean;
        enableAnalytics: z.ZodBoolean;
        customScripts: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        customStyles: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        defaultBreakpoint?: "mobile" | "tablet" | "desktop" | "wide";
        enableAiFeatures?: boolean;
        enableAnalytics?: boolean;
        customScripts?: string[];
        customStyles?: string;
    }, {
        defaultBreakpoint?: "mobile" | "tablet" | "desktop" | "wide";
        enableAiFeatures?: boolean;
        enableAnalytics?: boolean;
        customScripts?: string[];
        customStyles?: string;
    }>;
    metadata: z.ZodObject<{
        version: z.ZodString;
        platform: z.ZodOptional<z.ZodEnum<["odoo", "wordpress", "nextjs", "html"]>>;
        exportSettings: z.ZodOptional<z.ZodObject<{
            format: z.ZodEnum<["html", "react", "wordpress", "odoo"]>;
            optimizeAssets: z.ZodBoolean;
            minify: z.ZodBoolean;
            includeSourceMaps: z.ZodBoolean;
            customExportPath: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            format?: "odoo" | "wordpress" | "html" | "react";
            optimizeAssets?: boolean;
            minify?: boolean;
            includeSourceMaps?: boolean;
            customExportPath?: string;
        }, {
            format?: "odoo" | "wordpress" | "html" | "react";
            optimizeAssets?: boolean;
            minify?: boolean;
            includeSourceMaps?: boolean;
            customExportPath?: string;
        }>>;
    }, "strip", z.ZodTypeAny, {
        version?: string;
        platform?: "odoo" | "wordpress" | "nextjs" | "html";
        exportSettings?: {
            format?: "odoo" | "wordpress" | "html" | "react";
            optimizeAssets?: boolean;
            minify?: boolean;
            includeSourceMaps?: boolean;
            customExportPath?: string;
        };
    }, {
        version?: string;
        platform?: "odoo" | "wordpress" | "nextjs" | "html";
        exportSettings?: {
            format?: "odoo" | "wordpress" | "html" | "react";
            optimizeAssets?: boolean;
            minify?: boolean;
            includeSourceMaps?: boolean;
            customExportPath?: string;
        };
    }>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id?: string;
    metadata?: {
        version?: string;
        platform?: "odoo" | "wordpress" | "nextjs" | "html";
        exportSettings?: {
            format?: "odoo" | "wordpress" | "html" | "react";
            optimizeAssets?: boolean;
            minify?: boolean;
            includeSourceMaps?: boolean;
            customExportPath?: string;
        };
    };
    name?: string;
    description?: string;
    settings?: {
        defaultBreakpoint?: "mobile" | "tablet" | "desktop" | "wide";
        enableAiFeatures?: boolean;
        enableAnalytics?: boolean;
        customScripts?: string[];
        customStyles?: string;
    };
    pages?: {
        id?: string;
        metadata?: {
            title?: string;
            description?: string;
            customData?: Record<string, any>;
            keywords?: string[];
            author?: string;
        };
        name?: string;
        slug?: string;
        components?: any[];
        settings?: {
            seo?: {
                title?: string;
                description?: string;
                ogImage?: string;
            };
            customHead?: string;
            customBody?: string;
        };
    }[];
    theme?: {
        borderRadius?: {
            sm?: string;
            lg?: string;
            xl?: string;
            md?: string;
            none?: string;
            full?: string;
        };
        id?: string;
        name?: string;
        colors?: {
            custom?: Record<string, string>;
            primary?: string;
            secondary?: string;
            accent?: string;
            background?: string;
            foreground?: string;
            success?: string;
            warning?: string;
            error?: string;
            info?: string;
        };
        typography?: {
            fontSize?: {
                base?: string;
                xs?: string;
                sm?: string;
                lg?: string;
                xl?: string;
                '2xl'?: string;
                '3xl'?: string;
                '4xl'?: string;
            };
            fontWeight?: {
                bold?: number;
                light?: number;
                normal?: number;
                medium?: number;
                semibold?: number;
            };
            lineHeight?: {
                normal?: number;
                tight?: number;
                relaxed?: number;
            };
            fontFamily?: {
                body?: string;
                heading?: string;
                mono?: string;
            };
        };
        spacing?: {
            xs?: string;
            sm?: string;
            lg?: string;
            xl?: string;
            '2xl'?: string;
            md?: string;
        };
        shadows?: {
            sm?: string;
            lg?: string;
            xl?: string;
            md?: string;
        };
        breakpoints?: {
            mobile?: string;
            tablet?: string;
            desktop?: string;
            wide?: string;
        };
        customTokens?: Record<string, any>;
    };
    assets?: {
        id?: string;
        type?: "image" | "code" | "video" | "audio" | "font" | "file";
        metadata?: {
            width?: number;
            height?: number;
            title?: string;
            customData?: Record<string, any>;
            alt?: string;
        };
        name?: string;
        url?: string;
        size?: number;
        mimeType?: string;
    }[];
    createdAt?: string;
    updatedAt?: string;
}, {
    id?: string;
    metadata?: {
        version?: string;
        platform?: "odoo" | "wordpress" | "nextjs" | "html";
        exportSettings?: {
            format?: "odoo" | "wordpress" | "html" | "react";
            optimizeAssets?: boolean;
            minify?: boolean;
            includeSourceMaps?: boolean;
            customExportPath?: string;
        };
    };
    name?: string;
    description?: string;
    settings?: {
        defaultBreakpoint?: "mobile" | "tablet" | "desktop" | "wide";
        enableAiFeatures?: boolean;
        enableAnalytics?: boolean;
        customScripts?: string[];
        customStyles?: string;
    };
    pages?: {
        id?: string;
        metadata?: {
            title?: string;
            description?: string;
            customData?: Record<string, any>;
            keywords?: string[];
            author?: string;
        };
        name?: string;
        slug?: string;
        components?: any[];
        settings?: {
            seo?: {
                title?: string;
                description?: string;
                ogImage?: string;
            };
            customHead?: string;
            customBody?: string;
        };
    }[];
    theme?: {
        borderRadius?: {
            sm?: string;
            lg?: string;
            xl?: string;
            md?: string;
            none?: string;
            full?: string;
        };
        id?: string;
        name?: string;
        colors?: {
            custom?: Record<string, string>;
            primary?: string;
            secondary?: string;
            accent?: string;
            background?: string;
            foreground?: string;
            success?: string;
            warning?: string;
            error?: string;
            info?: string;
        };
        typography?: {
            fontSize?: {
                base?: string;
                xs?: string;
                sm?: string;
                lg?: string;
                xl?: string;
                '2xl'?: string;
                '3xl'?: string;
                '4xl'?: string;
            };
            fontWeight?: {
                bold?: number;
                light?: number;
                normal?: number;
                medium?: number;
                semibold?: number;
            };
            lineHeight?: {
                normal?: number;
                tight?: number;
                relaxed?: number;
            };
            fontFamily?: {
                body?: string;
                heading?: string;
                mono?: string;
            };
        };
        spacing?: {
            xs?: string;
            sm?: string;
            lg?: string;
            xl?: string;
            '2xl'?: string;
            md?: string;
        };
        shadows?: {
            sm?: string;
            lg?: string;
            xl?: string;
            md?: string;
        };
        breakpoints?: {
            mobile?: string;
            tablet?: string;
            desktop?: string;
            wide?: string;
        };
        customTokens?: Record<string, any>;
    };
    assets?: {
        id?: string;
        type?: "image" | "code" | "video" | "audio" | "font" | "file";
        metadata?: {
            width?: number;
            height?: number;
            title?: string;
            customData?: Record<string, any>;
            alt?: string;
        };
        name?: string;
        url?: string;
        size?: number;
        mimeType?: string;
    }[];
    createdAt?: string;
    updatedAt?: string;
}>;
/**
 * Command validation
 */
export declare const CommandSchema: z.ZodObject<{
    type: z.ZodString;
    execute: z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>;
    undo: z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>;
    description: z.ZodOptional<z.ZodString>;
    timestamp: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    type?: string;
    description?: string;
    execute?: (...args: unknown[]) => unknown;
    undo?: (...args: unknown[]) => unknown;
    timestamp?: number;
}, {
    type?: string;
    description?: string;
    execute?: (...args: unknown[]) => unknown;
    undo?: (...args: unknown[]) => unknown;
    timestamp?: number;
}>;
/**
 * History State validation
 */
export declare const HistoryStateSchema: z.ZodObject<{
    past: z.ZodArray<z.ZodObject<{
        type: z.ZodString;
        execute: z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>;
        undo: z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>;
        description: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        type?: string;
        description?: string;
        execute?: (...args: unknown[]) => unknown;
        undo?: (...args: unknown[]) => unknown;
        timestamp?: number;
    }, {
        type?: string;
        description?: string;
        execute?: (...args: unknown[]) => unknown;
        undo?: (...args: unknown[]) => unknown;
        timestamp?: number;
    }>, "many">;
    present: z.ZodNullable<z.ZodObject<{
        type: z.ZodString;
        execute: z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>;
        undo: z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>;
        description: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        type?: string;
        description?: string;
        execute?: (...args: unknown[]) => unknown;
        undo?: (...args: unknown[]) => unknown;
        timestamp?: number;
    }, {
        type?: string;
        description?: string;
        execute?: (...args: unknown[]) => unknown;
        undo?: (...args: unknown[]) => unknown;
        timestamp?: number;
    }>>;
    future: z.ZodArray<z.ZodObject<{
        type: z.ZodString;
        execute: z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>;
        undo: z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>;
        description: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        type?: string;
        description?: string;
        execute?: (...args: unknown[]) => unknown;
        undo?: (...args: unknown[]) => unknown;
        timestamp?: number;
    }, {
        type?: string;
        description?: string;
        execute?: (...args: unknown[]) => unknown;
        undo?: (...args: unknown[]) => unknown;
        timestamp?: number;
    }>, "many">;
    maxSize: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    past?: {
        type?: string;
        description?: string;
        execute?: (...args: unknown[]) => unknown;
        undo?: (...args: unknown[]) => unknown;
        timestamp?: number;
    }[];
    present?: {
        type?: string;
        description?: string;
        execute?: (...args: unknown[]) => unknown;
        undo?: (...args: unknown[]) => unknown;
        timestamp?: number;
    };
    future?: {
        type?: string;
        description?: string;
        execute?: (...args: unknown[]) => unknown;
        undo?: (...args: unknown[]) => unknown;
        timestamp?: number;
    }[];
    maxSize?: number;
}, {
    past?: {
        type?: string;
        description?: string;
        execute?: (...args: unknown[]) => unknown;
        undo?: (...args: unknown[]) => unknown;
        timestamp?: number;
    }[];
    present?: {
        type?: string;
        description?: string;
        execute?: (...args: unknown[]) => unknown;
        undo?: (...args: unknown[]) => unknown;
        timestamp?: number;
    };
    future?: {
        type?: string;
        description?: string;
        execute?: (...args: unknown[]) => unknown;
        undo?: (...args: unknown[]) => unknown;
        timestamp?: number;
    }[];
    maxSize?: number;
}>;
/**
 * Selection State validation
 */
export declare const SelectionStateSchema: z.ZodObject<{
    selectedIds: z.ZodArray<z.ZodString, "many">;
    hoveredId: z.ZodNullable<z.ZodString>;
    focusedId: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    selectedIds?: string[];
    hoveredId?: string;
    focusedId?: string;
}, {
    selectedIds?: string[];
    hoveredId?: string;
    focusedId?: string;
}>;
/**
 * Editor State validation
 */
export declare const EditorStateSchema: z.ZodObject<{
    project: z.ZodNullable<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        pages: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            slug: z.ZodString;
            components: z.ZodArray<z.ZodLazy<any>, "many">;
            metadata: z.ZodObject<{
                title: z.ZodOptional<z.ZodString>;
                description: z.ZodOptional<z.ZodString>;
                keywords: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                author: z.ZodOptional<z.ZodString>;
                customData: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
            }, "strip", z.ZodTypeAny, {
                title?: string;
                description?: string;
                customData?: Record<string, any>;
                keywords?: string[];
                author?: string;
            }, {
                title?: string;
                description?: string;
                customData?: Record<string, any>;
                keywords?: string[];
                author?: string;
            }>;
            settings: z.ZodObject<{
                seo: z.ZodOptional<z.ZodObject<{
                    title: z.ZodOptional<z.ZodString>;
                    description: z.ZodOptional<z.ZodString>;
                    ogImage: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    title?: string;
                    description?: string;
                    ogImage?: string;
                }, {
                    title?: string;
                    description?: string;
                    ogImage?: string;
                }>>;
                customHead: z.ZodOptional<z.ZodString>;
                customBody: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                seo?: {
                    title?: string;
                    description?: string;
                    ogImage?: string;
                };
                customHead?: string;
                customBody?: string;
            }, {
                seo?: {
                    title?: string;
                    description?: string;
                    ogImage?: string;
                };
                customHead?: string;
                customBody?: string;
            }>;
        }, "strip", z.ZodTypeAny, {
            id?: string;
            metadata?: {
                title?: string;
                description?: string;
                customData?: Record<string, any>;
                keywords?: string[];
                author?: string;
            };
            name?: string;
            slug?: string;
            components?: any[];
            settings?: {
                seo?: {
                    title?: string;
                    description?: string;
                    ogImage?: string;
                };
                customHead?: string;
                customBody?: string;
            };
        }, {
            id?: string;
            metadata?: {
                title?: string;
                description?: string;
                customData?: Record<string, any>;
                keywords?: string[];
                author?: string;
            };
            name?: string;
            slug?: string;
            components?: any[];
            settings?: {
                seo?: {
                    title?: string;
                    description?: string;
                    ogImage?: string;
                };
                customHead?: string;
                customBody?: string;
            };
        }>, "many">;
        theme: z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            colors: z.ZodObject<{
                primary: z.ZodString;
                secondary: z.ZodString;
                accent: z.ZodString;
                background: z.ZodString;
                foreground: z.ZodString;
                success: z.ZodString;
                warning: z.ZodString;
                error: z.ZodString;
                info: z.ZodString;
                custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            }, "strip", z.ZodTypeAny, {
                custom?: Record<string, string>;
                primary?: string;
                secondary?: string;
                accent?: string;
                background?: string;
                foreground?: string;
                success?: string;
                warning?: string;
                error?: string;
                info?: string;
            }, {
                custom?: Record<string, string>;
                primary?: string;
                secondary?: string;
                accent?: string;
                background?: string;
                foreground?: string;
                success?: string;
                warning?: string;
                error?: string;
                info?: string;
            }>;
            typography: z.ZodObject<{
                fontFamily: z.ZodObject<{
                    heading: z.ZodString;
                    body: z.ZodString;
                    mono: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    body?: string;
                    heading?: string;
                    mono?: string;
                }, {
                    body?: string;
                    heading?: string;
                    mono?: string;
                }>;
                fontSize: z.ZodObject<{
                    xs: z.ZodString;
                    sm: z.ZodString;
                    base: z.ZodString;
                    lg: z.ZodString;
                    xl: z.ZodString;
                    '2xl': z.ZodString;
                    '3xl': z.ZodString;
                    '4xl': z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    base?: string;
                    xs?: string;
                    sm?: string;
                    lg?: string;
                    xl?: string;
                    '2xl'?: string;
                    '3xl'?: string;
                    '4xl'?: string;
                }, {
                    base?: string;
                    xs?: string;
                    sm?: string;
                    lg?: string;
                    xl?: string;
                    '2xl'?: string;
                    '3xl'?: string;
                    '4xl'?: string;
                }>;
                fontWeight: z.ZodObject<{
                    light: z.ZodNumber;
                    normal: z.ZodNumber;
                    medium: z.ZodNumber;
                    semibold: z.ZodNumber;
                    bold: z.ZodNumber;
                }, "strip", z.ZodTypeAny, {
                    bold?: number;
                    light?: number;
                    normal?: number;
                    medium?: number;
                    semibold?: number;
                }, {
                    bold?: number;
                    light?: number;
                    normal?: number;
                    medium?: number;
                    semibold?: number;
                }>;
                lineHeight: z.ZodObject<{
                    tight: z.ZodNumber;
                    normal: z.ZodNumber;
                    relaxed: z.ZodNumber;
                }, "strip", z.ZodTypeAny, {
                    normal?: number;
                    tight?: number;
                    relaxed?: number;
                }, {
                    normal?: number;
                    tight?: number;
                    relaxed?: number;
                }>;
            }, "strip", z.ZodTypeAny, {
                fontSize?: {
                    base?: string;
                    xs?: string;
                    sm?: string;
                    lg?: string;
                    xl?: string;
                    '2xl'?: string;
                    '3xl'?: string;
                    '4xl'?: string;
                };
                fontWeight?: {
                    bold?: number;
                    light?: number;
                    normal?: number;
                    medium?: number;
                    semibold?: number;
                };
                lineHeight?: {
                    normal?: number;
                    tight?: number;
                    relaxed?: number;
                };
                fontFamily?: {
                    body?: string;
                    heading?: string;
                    mono?: string;
                };
            }, {
                fontSize?: {
                    base?: string;
                    xs?: string;
                    sm?: string;
                    lg?: string;
                    xl?: string;
                    '2xl'?: string;
                    '3xl'?: string;
                    '4xl'?: string;
                };
                fontWeight?: {
                    bold?: number;
                    light?: number;
                    normal?: number;
                    medium?: number;
                    semibold?: number;
                };
                lineHeight?: {
                    normal?: number;
                    tight?: number;
                    relaxed?: number;
                };
                fontFamily?: {
                    body?: string;
                    heading?: string;
                    mono?: string;
                };
            }>;
            spacing: z.ZodObject<{
                xs: z.ZodString;
                sm: z.ZodString;
                md: z.ZodString;
                lg: z.ZodString;
                xl: z.ZodString;
                '2xl': z.ZodString;
            }, "strip", z.ZodTypeAny, {
                xs?: string;
                sm?: string;
                lg?: string;
                xl?: string;
                '2xl'?: string;
                md?: string;
            }, {
                xs?: string;
                sm?: string;
                lg?: string;
                xl?: string;
                '2xl'?: string;
                md?: string;
            }>;
            borderRadius: z.ZodObject<{
                none: z.ZodString;
                sm: z.ZodString;
                md: z.ZodString;
                lg: z.ZodString;
                xl: z.ZodString;
                full: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                sm?: string;
                lg?: string;
                xl?: string;
                md?: string;
                none?: string;
                full?: string;
            }, {
                sm?: string;
                lg?: string;
                xl?: string;
                md?: string;
                none?: string;
                full?: string;
            }>;
            shadows: z.ZodObject<{
                sm: z.ZodString;
                md: z.ZodString;
                lg: z.ZodString;
                xl: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                sm?: string;
                lg?: string;
                xl?: string;
                md?: string;
            }, {
                sm?: string;
                lg?: string;
                xl?: string;
                md?: string;
            }>;
            breakpoints: z.ZodObject<{
                mobile: z.ZodString;
                tablet: z.ZodString;
                desktop: z.ZodString;
                wide: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                mobile?: string;
                tablet?: string;
                desktop?: string;
                wide?: string;
            }, {
                mobile?: string;
                tablet?: string;
                desktop?: string;
                wide?: string;
            }>;
            customTokens: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
        }, "strip", z.ZodTypeAny, {
            borderRadius?: {
                sm?: string;
                lg?: string;
                xl?: string;
                md?: string;
                none?: string;
                full?: string;
            };
            id?: string;
            name?: string;
            colors?: {
                custom?: Record<string, string>;
                primary?: string;
                secondary?: string;
                accent?: string;
                background?: string;
                foreground?: string;
                success?: string;
                warning?: string;
                error?: string;
                info?: string;
            };
            typography?: {
                fontSize?: {
                    base?: string;
                    xs?: string;
                    sm?: string;
                    lg?: string;
                    xl?: string;
                    '2xl'?: string;
                    '3xl'?: string;
                    '4xl'?: string;
                };
                fontWeight?: {
                    bold?: number;
                    light?: number;
                    normal?: number;
                    medium?: number;
                    semibold?: number;
                };
                lineHeight?: {
                    normal?: number;
                    tight?: number;
                    relaxed?: number;
                };
                fontFamily?: {
                    body?: string;
                    heading?: string;
                    mono?: string;
                };
            };
            spacing?: {
                xs?: string;
                sm?: string;
                lg?: string;
                xl?: string;
                '2xl'?: string;
                md?: string;
            };
            shadows?: {
                sm?: string;
                lg?: string;
                xl?: string;
                md?: string;
            };
            breakpoints?: {
                mobile?: string;
                tablet?: string;
                desktop?: string;
                wide?: string;
            };
            customTokens?: Record<string, any>;
        }, {
            borderRadius?: {
                sm?: string;
                lg?: string;
                xl?: string;
                md?: string;
                none?: string;
                full?: string;
            };
            id?: string;
            name?: string;
            colors?: {
                custom?: Record<string, string>;
                primary?: string;
                secondary?: string;
                accent?: string;
                background?: string;
                foreground?: string;
                success?: string;
                warning?: string;
                error?: string;
                info?: string;
            };
            typography?: {
                fontSize?: {
                    base?: string;
                    xs?: string;
                    sm?: string;
                    lg?: string;
                    xl?: string;
                    '2xl'?: string;
                    '3xl'?: string;
                    '4xl'?: string;
                };
                fontWeight?: {
                    bold?: number;
                    light?: number;
                    normal?: number;
                    medium?: number;
                    semibold?: number;
                };
                lineHeight?: {
                    normal?: number;
                    tight?: number;
                    relaxed?: number;
                };
                fontFamily?: {
                    body?: string;
                    heading?: string;
                    mono?: string;
                };
            };
            spacing?: {
                xs?: string;
                sm?: string;
                lg?: string;
                xl?: string;
                '2xl'?: string;
                md?: string;
            };
            shadows?: {
                sm?: string;
                lg?: string;
                xl?: string;
                md?: string;
            };
            breakpoints?: {
                mobile?: string;
                tablet?: string;
                desktop?: string;
                wide?: string;
            };
            customTokens?: Record<string, any>;
        }>;
        assets: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            type: z.ZodEnum<["image", "video", "audio", "font", "file", "code"]>;
            url: z.ZodString;
            size: z.ZodNumber;
            mimeType: z.ZodOptional<z.ZodString>;
            metadata: z.ZodOptional<z.ZodObject<{
                width: z.ZodOptional<z.ZodNumber>;
                height: z.ZodOptional<z.ZodNumber>;
                alt: z.ZodOptional<z.ZodString>;
                title: z.ZodOptional<z.ZodString>;
                customData: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
            }, "strip", z.ZodTypeAny, {
                width?: number;
                height?: number;
                title?: string;
                customData?: Record<string, any>;
                alt?: string;
            }, {
                width?: number;
                height?: number;
                title?: string;
                customData?: Record<string, any>;
                alt?: string;
            }>>;
        }, "strip", z.ZodTypeAny, {
            id?: string;
            type?: "image" | "code" | "video" | "audio" | "font" | "file";
            metadata?: {
                width?: number;
                height?: number;
                title?: string;
                customData?: Record<string, any>;
                alt?: string;
            };
            name?: string;
            url?: string;
            size?: number;
            mimeType?: string;
        }, {
            id?: string;
            type?: "image" | "code" | "video" | "audio" | "font" | "file";
            metadata?: {
                width?: number;
                height?: number;
                title?: string;
                customData?: Record<string, any>;
                alt?: string;
            };
            name?: string;
            url?: string;
            size?: number;
            mimeType?: string;
        }>, "many">;
        settings: z.ZodObject<{
            defaultBreakpoint: z.ZodEnum<["mobile", "tablet", "desktop", "wide"]>;
            enableAiFeatures: z.ZodBoolean;
            enableAnalytics: z.ZodBoolean;
            customScripts: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            customStyles: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            defaultBreakpoint?: "mobile" | "tablet" | "desktop" | "wide";
            enableAiFeatures?: boolean;
            enableAnalytics?: boolean;
            customScripts?: string[];
            customStyles?: string;
        }, {
            defaultBreakpoint?: "mobile" | "tablet" | "desktop" | "wide";
            enableAiFeatures?: boolean;
            enableAnalytics?: boolean;
            customScripts?: string[];
            customStyles?: string;
        }>;
        metadata: z.ZodObject<{
            version: z.ZodString;
            platform: z.ZodOptional<z.ZodEnum<["odoo", "wordpress", "nextjs", "html"]>>;
            exportSettings: z.ZodOptional<z.ZodObject<{
                format: z.ZodEnum<["html", "react", "wordpress", "odoo"]>;
                optimizeAssets: z.ZodBoolean;
                minify: z.ZodBoolean;
                includeSourceMaps: z.ZodBoolean;
                customExportPath: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                format?: "odoo" | "wordpress" | "html" | "react";
                optimizeAssets?: boolean;
                minify?: boolean;
                includeSourceMaps?: boolean;
                customExportPath?: string;
            }, {
                format?: "odoo" | "wordpress" | "html" | "react";
                optimizeAssets?: boolean;
                minify?: boolean;
                includeSourceMaps?: boolean;
                customExportPath?: string;
            }>>;
        }, "strip", z.ZodTypeAny, {
            version?: string;
            platform?: "odoo" | "wordpress" | "nextjs" | "html";
            exportSettings?: {
                format?: "odoo" | "wordpress" | "html" | "react";
                optimizeAssets?: boolean;
                minify?: boolean;
                includeSourceMaps?: boolean;
                customExportPath?: string;
            };
        }, {
            version?: string;
            platform?: "odoo" | "wordpress" | "nextjs" | "html";
            exportSettings?: {
                format?: "odoo" | "wordpress" | "html" | "react";
                optimizeAssets?: boolean;
                minify?: boolean;
                includeSourceMaps?: boolean;
                customExportPath?: string;
            };
        }>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id?: string;
        metadata?: {
            version?: string;
            platform?: "odoo" | "wordpress" | "nextjs" | "html";
            exportSettings?: {
                format?: "odoo" | "wordpress" | "html" | "react";
                optimizeAssets?: boolean;
                minify?: boolean;
                includeSourceMaps?: boolean;
                customExportPath?: string;
            };
        };
        name?: string;
        description?: string;
        settings?: {
            defaultBreakpoint?: "mobile" | "tablet" | "desktop" | "wide";
            enableAiFeatures?: boolean;
            enableAnalytics?: boolean;
            customScripts?: string[];
            customStyles?: string;
        };
        pages?: {
            id?: string;
            metadata?: {
                title?: string;
                description?: string;
                customData?: Record<string, any>;
                keywords?: string[];
                author?: string;
            };
            name?: string;
            slug?: string;
            components?: any[];
            settings?: {
                seo?: {
                    title?: string;
                    description?: string;
                    ogImage?: string;
                };
                customHead?: string;
                customBody?: string;
            };
        }[];
        theme?: {
            borderRadius?: {
                sm?: string;
                lg?: string;
                xl?: string;
                md?: string;
                none?: string;
                full?: string;
            };
            id?: string;
            name?: string;
            colors?: {
                custom?: Record<string, string>;
                primary?: string;
                secondary?: string;
                accent?: string;
                background?: string;
                foreground?: string;
                success?: string;
                warning?: string;
                error?: string;
                info?: string;
            };
            typography?: {
                fontSize?: {
                    base?: string;
                    xs?: string;
                    sm?: string;
                    lg?: string;
                    xl?: string;
                    '2xl'?: string;
                    '3xl'?: string;
                    '4xl'?: string;
                };
                fontWeight?: {
                    bold?: number;
                    light?: number;
                    normal?: number;
                    medium?: number;
                    semibold?: number;
                };
                lineHeight?: {
                    normal?: number;
                    tight?: number;
                    relaxed?: number;
                };
                fontFamily?: {
                    body?: string;
                    heading?: string;
                    mono?: string;
                };
            };
            spacing?: {
                xs?: string;
                sm?: string;
                lg?: string;
                xl?: string;
                '2xl'?: string;
                md?: string;
            };
            shadows?: {
                sm?: string;
                lg?: string;
                xl?: string;
                md?: string;
            };
            breakpoints?: {
                mobile?: string;
                tablet?: string;
                desktop?: string;
                wide?: string;
            };
            customTokens?: Record<string, any>;
        };
        assets?: {
            id?: string;
            type?: "image" | "code" | "video" | "audio" | "font" | "file";
            metadata?: {
                width?: number;
                height?: number;
                title?: string;
                customData?: Record<string, any>;
                alt?: string;
            };
            name?: string;
            url?: string;
            size?: number;
            mimeType?: string;
        }[];
        createdAt?: string;
        updatedAt?: string;
    }, {
        id?: string;
        metadata?: {
            version?: string;
            platform?: "odoo" | "wordpress" | "nextjs" | "html";
            exportSettings?: {
                format?: "odoo" | "wordpress" | "html" | "react";
                optimizeAssets?: boolean;
                minify?: boolean;
                includeSourceMaps?: boolean;
                customExportPath?: string;
            };
        };
        name?: string;
        description?: string;
        settings?: {
            defaultBreakpoint?: "mobile" | "tablet" | "desktop" | "wide";
            enableAiFeatures?: boolean;
            enableAnalytics?: boolean;
            customScripts?: string[];
            customStyles?: string;
        };
        pages?: {
            id?: string;
            metadata?: {
                title?: string;
                description?: string;
                customData?: Record<string, any>;
                keywords?: string[];
                author?: string;
            };
            name?: string;
            slug?: string;
            components?: any[];
            settings?: {
                seo?: {
                    title?: string;
                    description?: string;
                    ogImage?: string;
                };
                customHead?: string;
                customBody?: string;
            };
        }[];
        theme?: {
            borderRadius?: {
                sm?: string;
                lg?: string;
                xl?: string;
                md?: string;
                none?: string;
                full?: string;
            };
            id?: string;
            name?: string;
            colors?: {
                custom?: Record<string, string>;
                primary?: string;
                secondary?: string;
                accent?: string;
                background?: string;
                foreground?: string;
                success?: string;
                warning?: string;
                error?: string;
                info?: string;
            };
            typography?: {
                fontSize?: {
                    base?: string;
                    xs?: string;
                    sm?: string;
                    lg?: string;
                    xl?: string;
                    '2xl'?: string;
                    '3xl'?: string;
                    '4xl'?: string;
                };
                fontWeight?: {
                    bold?: number;
                    light?: number;
                    normal?: number;
                    medium?: number;
                    semibold?: number;
                };
                lineHeight?: {
                    normal?: number;
                    tight?: number;
                    relaxed?: number;
                };
                fontFamily?: {
                    body?: string;
                    heading?: string;
                    mono?: string;
                };
            };
            spacing?: {
                xs?: string;
                sm?: string;
                lg?: string;
                xl?: string;
                '2xl'?: string;
                md?: string;
            };
            shadows?: {
                sm?: string;
                lg?: string;
                xl?: string;
                md?: string;
            };
            breakpoints?: {
                mobile?: string;
                tablet?: string;
                desktop?: string;
                wide?: string;
            };
            customTokens?: Record<string, any>;
        };
        assets?: {
            id?: string;
            type?: "image" | "code" | "video" | "audio" | "font" | "file";
            metadata?: {
                width?: number;
                height?: number;
                title?: string;
                customData?: Record<string, any>;
                alt?: string;
            };
            name?: string;
            url?: string;
            size?: number;
            mimeType?: string;
        }[];
        createdAt?: string;
        updatedAt?: string;
    }>>;
    currentPageId: z.ZodNullable<z.ZodString>;
    selection: z.ZodObject<{
        selectedIds: z.ZodArray<z.ZodString, "many">;
        hoveredId: z.ZodNullable<z.ZodString>;
        focusedId: z.ZodNullable<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        selectedIds?: string[];
        hoveredId?: string;
        focusedId?: string;
    }, {
        selectedIds?: string[];
        hoveredId?: string;
        focusedId?: string;
    }>;
    history: z.ZodObject<{
        past: z.ZodArray<z.ZodObject<{
            type: z.ZodString;
            execute: z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>;
            undo: z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>;
            description: z.ZodOptional<z.ZodString>;
            timestamp: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            type?: string;
            description?: string;
            execute?: (...args: unknown[]) => unknown;
            undo?: (...args: unknown[]) => unknown;
            timestamp?: number;
        }, {
            type?: string;
            description?: string;
            execute?: (...args: unknown[]) => unknown;
            undo?: (...args: unknown[]) => unknown;
            timestamp?: number;
        }>, "many">;
        present: z.ZodNullable<z.ZodObject<{
            type: z.ZodString;
            execute: z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>;
            undo: z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>;
            description: z.ZodOptional<z.ZodString>;
            timestamp: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            type?: string;
            description?: string;
            execute?: (...args: unknown[]) => unknown;
            undo?: (...args: unknown[]) => unknown;
            timestamp?: number;
        }, {
            type?: string;
            description?: string;
            execute?: (...args: unknown[]) => unknown;
            undo?: (...args: unknown[]) => unknown;
            timestamp?: number;
        }>>;
        future: z.ZodArray<z.ZodObject<{
            type: z.ZodString;
            execute: z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>;
            undo: z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>;
            description: z.ZodOptional<z.ZodString>;
            timestamp: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            type?: string;
            description?: string;
            execute?: (...args: unknown[]) => unknown;
            undo?: (...args: unknown[]) => unknown;
            timestamp?: number;
        }, {
            type?: string;
            description?: string;
            execute?: (...args: unknown[]) => unknown;
            undo?: (...args: unknown[]) => unknown;
            timestamp?: number;
        }>, "many">;
        maxSize: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        past?: {
            type?: string;
            description?: string;
            execute?: (...args: unknown[]) => unknown;
            undo?: (...args: unknown[]) => unknown;
            timestamp?: number;
        }[];
        present?: {
            type?: string;
            description?: string;
            execute?: (...args: unknown[]) => unknown;
            undo?: (...args: unknown[]) => unknown;
            timestamp?: number;
        };
        future?: {
            type?: string;
            description?: string;
            execute?: (...args: unknown[]) => unknown;
            undo?: (...args: unknown[]) => unknown;
            timestamp?: number;
        }[];
        maxSize?: number;
    }, {
        past?: {
            type?: string;
            description?: string;
            execute?: (...args: unknown[]) => unknown;
            undo?: (...args: unknown[]) => unknown;
            timestamp?: number;
        }[];
        present?: {
            type?: string;
            description?: string;
            execute?: (...args: unknown[]) => unknown;
            undo?: (...args: unknown[]) => unknown;
            timestamp?: number;
        };
        future?: {
            type?: string;
            description?: string;
            execute?: (...args: unknown[]) => unknown;
            undo?: (...args: unknown[]) => unknown;
            timestamp?: number;
        }[];
        maxSize?: number;
    }>;
    isDirty: z.ZodBoolean;
    isPreviewMode: z.ZodBoolean;
    currentBreakpoint: z.ZodEnum<["mobile", "tablet", "desktop", "wide"]>;
    zoom: z.ZodNumber;
    clipboard: z.ZodArray<any, "many">;
}, "strip", z.ZodTypeAny, {
    project?: {
        id?: string;
        metadata?: {
            version?: string;
            platform?: "odoo" | "wordpress" | "nextjs" | "html";
            exportSettings?: {
                format?: "odoo" | "wordpress" | "html" | "react";
                optimizeAssets?: boolean;
                minify?: boolean;
                includeSourceMaps?: boolean;
                customExportPath?: string;
            };
        };
        name?: string;
        description?: string;
        settings?: {
            defaultBreakpoint?: "mobile" | "tablet" | "desktop" | "wide";
            enableAiFeatures?: boolean;
            enableAnalytics?: boolean;
            customScripts?: string[];
            customStyles?: string;
        };
        pages?: {
            id?: string;
            metadata?: {
                title?: string;
                description?: string;
                customData?: Record<string, any>;
                keywords?: string[];
                author?: string;
            };
            name?: string;
            slug?: string;
            components?: any[];
            settings?: {
                seo?: {
                    title?: string;
                    description?: string;
                    ogImage?: string;
                };
                customHead?: string;
                customBody?: string;
            };
        }[];
        theme?: {
            borderRadius?: {
                sm?: string;
                lg?: string;
                xl?: string;
                md?: string;
                none?: string;
                full?: string;
            };
            id?: string;
            name?: string;
            colors?: {
                custom?: Record<string, string>;
                primary?: string;
                secondary?: string;
                accent?: string;
                background?: string;
                foreground?: string;
                success?: string;
                warning?: string;
                error?: string;
                info?: string;
            };
            typography?: {
                fontSize?: {
                    base?: string;
                    xs?: string;
                    sm?: string;
                    lg?: string;
                    xl?: string;
                    '2xl'?: string;
                    '3xl'?: string;
                    '4xl'?: string;
                };
                fontWeight?: {
                    bold?: number;
                    light?: number;
                    normal?: number;
                    medium?: number;
                    semibold?: number;
                };
                lineHeight?: {
                    normal?: number;
                    tight?: number;
                    relaxed?: number;
                };
                fontFamily?: {
                    body?: string;
                    heading?: string;
                    mono?: string;
                };
            };
            spacing?: {
                xs?: string;
                sm?: string;
                lg?: string;
                xl?: string;
                '2xl'?: string;
                md?: string;
            };
            shadows?: {
                sm?: string;
                lg?: string;
                xl?: string;
                md?: string;
            };
            breakpoints?: {
                mobile?: string;
                tablet?: string;
                desktop?: string;
                wide?: string;
            };
            customTokens?: Record<string, any>;
        };
        assets?: {
            id?: string;
            type?: "image" | "code" | "video" | "audio" | "font" | "file";
            metadata?: {
                width?: number;
                height?: number;
                title?: string;
                customData?: Record<string, any>;
                alt?: string;
            };
            name?: string;
            url?: string;
            size?: number;
            mimeType?: string;
        }[];
        createdAt?: string;
        updatedAt?: string;
    };
    currentPageId?: string;
    selection?: {
        selectedIds?: string[];
        hoveredId?: string;
        focusedId?: string;
    };
    history?: {
        past?: {
            type?: string;
            description?: string;
            execute?: (...args: unknown[]) => unknown;
            undo?: (...args: unknown[]) => unknown;
            timestamp?: number;
        }[];
        present?: {
            type?: string;
            description?: string;
            execute?: (...args: unknown[]) => unknown;
            undo?: (...args: unknown[]) => unknown;
            timestamp?: number;
        };
        future?: {
            type?: string;
            description?: string;
            execute?: (...args: unknown[]) => unknown;
            undo?: (...args: unknown[]) => unknown;
            timestamp?: number;
        }[];
        maxSize?: number;
    };
    isDirty?: boolean;
    isPreviewMode?: boolean;
    currentBreakpoint?: "mobile" | "tablet" | "desktop" | "wide";
    zoom?: number;
    clipboard?: any[];
}, {
    project?: {
        id?: string;
        metadata?: {
            version?: string;
            platform?: "odoo" | "wordpress" | "nextjs" | "html";
            exportSettings?: {
                format?: "odoo" | "wordpress" | "html" | "react";
                optimizeAssets?: boolean;
                minify?: boolean;
                includeSourceMaps?: boolean;
                customExportPath?: string;
            };
        };
        name?: string;
        description?: string;
        settings?: {
            defaultBreakpoint?: "mobile" | "tablet" | "desktop" | "wide";
            enableAiFeatures?: boolean;
            enableAnalytics?: boolean;
            customScripts?: string[];
            customStyles?: string;
        };
        pages?: {
            id?: string;
            metadata?: {
                title?: string;
                description?: string;
                customData?: Record<string, any>;
                keywords?: string[];
                author?: string;
            };
            name?: string;
            slug?: string;
            components?: any[];
            settings?: {
                seo?: {
                    title?: string;
                    description?: string;
                    ogImage?: string;
                };
                customHead?: string;
                customBody?: string;
            };
        }[];
        theme?: {
            borderRadius?: {
                sm?: string;
                lg?: string;
                xl?: string;
                md?: string;
                none?: string;
                full?: string;
            };
            id?: string;
            name?: string;
            colors?: {
                custom?: Record<string, string>;
                primary?: string;
                secondary?: string;
                accent?: string;
                background?: string;
                foreground?: string;
                success?: string;
                warning?: string;
                error?: string;
                info?: string;
            };
            typography?: {
                fontSize?: {
                    base?: string;
                    xs?: string;
                    sm?: string;
                    lg?: string;
                    xl?: string;
                    '2xl'?: string;
                    '3xl'?: string;
                    '4xl'?: string;
                };
                fontWeight?: {
                    bold?: number;
                    light?: number;
                    normal?: number;
                    medium?: number;
                    semibold?: number;
                };
                lineHeight?: {
                    normal?: number;
                    tight?: number;
                    relaxed?: number;
                };
                fontFamily?: {
                    body?: string;
                    heading?: string;
                    mono?: string;
                };
            };
            spacing?: {
                xs?: string;
                sm?: string;
                lg?: string;
                xl?: string;
                '2xl'?: string;
                md?: string;
            };
            shadows?: {
                sm?: string;
                lg?: string;
                xl?: string;
                md?: string;
            };
            breakpoints?: {
                mobile?: string;
                tablet?: string;
                desktop?: string;
                wide?: string;
            };
            customTokens?: Record<string, any>;
        };
        assets?: {
            id?: string;
            type?: "image" | "code" | "video" | "audio" | "font" | "file";
            metadata?: {
                width?: number;
                height?: number;
                title?: string;
                customData?: Record<string, any>;
                alt?: string;
            };
            name?: string;
            url?: string;
            size?: number;
            mimeType?: string;
        }[];
        createdAt?: string;
        updatedAt?: string;
    };
    currentPageId?: string;
    selection?: {
        selectedIds?: string[];
        hoveredId?: string;
        focusedId?: string;
    };
    history?: {
        past?: {
            type?: string;
            description?: string;
            execute?: (...args: unknown[]) => unknown;
            undo?: (...args: unknown[]) => unknown;
            timestamp?: number;
        }[];
        present?: {
            type?: string;
            description?: string;
            execute?: (...args: unknown[]) => unknown;
            undo?: (...args: unknown[]) => unknown;
            timestamp?: number;
        };
        future?: {
            type?: string;
            description?: string;
            execute?: (...args: unknown[]) => unknown;
            undo?: (...args: unknown[]) => unknown;
            timestamp?: number;
        }[];
        maxSize?: number;
    };
    isDirty?: boolean;
    isPreviewMode?: boolean;
    currentBreakpoint?: "mobile" | "tablet" | "desktop" | "wide";
    zoom?: number;
    clipboard?: any[];
}>;
/**
 * Plugin Hooks validation
 */
export declare const PluginHooksSchema: z.ZodOptional<z.ZodObject<{
    onProjectLoad: z.ZodOptional<z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>>;
    onProjectSave: z.ZodOptional<z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>>;
    onComponentSelect: z.ZodOptional<z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>>;
    onComponentUpdate: z.ZodOptional<z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>>;
    onComponentDelete: z.ZodOptional<z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>>;
    onExport: z.ZodOptional<z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    onProjectLoad?: (...args: unknown[]) => unknown;
    onProjectSave?: (...args: unknown[]) => unknown;
    onComponentSelect?: (...args: unknown[]) => unknown;
    onComponentUpdate?: (...args: unknown[]) => unknown;
    onComponentDelete?: (...args: unknown[]) => unknown;
    onExport?: (...args: unknown[]) => unknown;
}, {
    onProjectLoad?: (...args: unknown[]) => unknown;
    onProjectSave?: (...args: unknown[]) => unknown;
    onComponentSelect?: (...args: unknown[]) => unknown;
    onComponentUpdate?: (...args: unknown[]) => unknown;
    onComponentDelete?: (...args: unknown[]) => unknown;
    onExport?: (...args: unknown[]) => unknown;
}>>;
/**
 * Plugin Context validation
 */
export declare const PluginContextSchema: z.ZodObject<{
    registerComponent: z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>;
    registerCommand: z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>;
    getProject: z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>;
    updateProject: z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>;
    getSelection: z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>;
    updateSelection: z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>;
    executeCommand: z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>;
    undo: z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>;
    redo: z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>;
}, "strip", z.ZodTypeAny, {
    undo?: (...args: unknown[]) => unknown;
    registerComponent?: (...args: unknown[]) => unknown;
    registerCommand?: (...args: unknown[]) => unknown;
    getProject?: (...args: unknown[]) => unknown;
    updateProject?: (...args: unknown[]) => unknown;
    getSelection?: (...args: unknown[]) => unknown;
    updateSelection?: (...args: unknown[]) => unknown;
    executeCommand?: (...args: unknown[]) => unknown;
    redo?: (...args: unknown[]) => unknown;
}, {
    undo?: (...args: unknown[]) => unknown;
    registerComponent?: (...args: unknown[]) => unknown;
    registerCommand?: (...args: unknown[]) => unknown;
    getProject?: (...args: unknown[]) => unknown;
    updateProject?: (...args: unknown[]) => unknown;
    getSelection?: (...args: unknown[]) => unknown;
    updateSelection?: (...args: unknown[]) => unknown;
    executeCommand?: (...args: unknown[]) => unknown;
    redo?: (...args: unknown[]) => unknown;
}>;
/**
 * Plugin validation
 */
export declare const PluginSchema: z.ZodObject<{
    name: z.ZodString;
    version: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    initialize: z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>;
    destroy: z.ZodOptional<z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>>;
    components: z.ZodOptional<z.ZodArray<z.ZodObject<{
        type: z.ZodString;
        label: z.ZodString;
        icon: z.ZodString;
        category: z.ZodString;
        defaultProps: z.ZodRecord<z.ZodString, z.ZodAny>;
        defaultStyles: z.ZodRecord<z.ZodEnum<["paddingTop", "paddingBottom", "paddingLeft", "paddingRight", "marginTop", "marginBottom", "marginLeft", "marginRight", "backgroundColor", "color", "fontSize", "fontWeight", "lineHeight", "textAlign", "borderRadius", "borderWidth", "borderColor", "borderStyle", "boxShadow", "opacity", "display", "flexDirection", "justifyContent", "alignItems", "gap", "gridTemplateColumns", "gridTemplateRows", "width", "height", "maxWidth", "minWidth", "maxHeight", "minHeight", "position", "top", "right", "bottom", "left", "zIndex"]>, z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        defaultResponsiveStyles: z.ZodOptional<z.ZodRecord<z.ZodEnum<["mobile", "tablet", "desktop", "wide"]>, z.ZodRecord<z.ZodEnum<["paddingTop", "paddingBottom", "paddingLeft", "paddingRight", "marginTop", "marginBottom", "marginLeft", "marginRight", "backgroundColor", "color", "fontSize", "fontWeight", "lineHeight", "textAlign", "borderRadius", "borderWidth", "borderColor", "borderStyle", "boxShadow", "opacity", "display", "flexDirection", "justifyContent", "alignItems", "gap", "gridTemplateColumns", "gridTemplateRows", "width", "height", "maxWidth", "minWidth", "maxHeight", "minHeight", "position", "top", "right", "bottom", "left", "zIndex"]>, z.ZodUnion<[z.ZodString, z.ZodNumber]>>>>;
        allowedChildren: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        allowedParents: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        inspector: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            label: z.ZodString;
            type: z.ZodEnum<["text", "number", "color", "select", "multiselect", "boolean", "image", "link", "richtext", "code", "array", "object", "style"]>;
            defaultValue: z.ZodOptional<z.ZodAny>;
            options: z.ZodOptional<z.ZodArray<z.ZodObject<{
                label: z.ZodString;
                value: z.ZodAny;
            }, "strip", z.ZodTypeAny, {
                label?: string;
                value?: any;
            }, {
                label?: string;
                value?: any;
            }>, "many">>;
            validation: z.ZodOptional<z.ZodArray<z.ZodObject<{
                type: z.ZodEnum<["required", "min", "max", "pattern", "custom"]>;
                value: z.ZodOptional<z.ZodAny>;
                message: z.ZodString;
                validator: z.ZodOptional<z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>>;
            }, "strip", z.ZodTypeAny, {
                type?: "required" | "min" | "max" | "pattern" | "custom";
                value?: any;
                message?: string;
                validator?: (...args: unknown[]) => unknown;
            }, {
                type?: "required" | "min" | "max" | "pattern" | "custom";
                value?: any;
                message?: string;
                validator?: (...args: unknown[]) => unknown;
            }>, "many">>;
            group: z.ZodOptional<z.ZodString>;
            visible: z.ZodOptional<z.ZodBoolean>;
            disabled: z.ZodOptional<z.ZodBoolean>;
            placeholder: z.ZodOptional<z.ZodString>;
            helpText: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            type?: "number" | "boolean" | "object" | "color" | "text" | "select" | "multiselect" | "image" | "link" | "richtext" | "code" | "array" | "style";
            label?: string;
            options?: {
                label?: string;
                value?: any;
            }[];
            validation?: {
                type?: "required" | "min" | "max" | "pattern" | "custom";
                value?: any;
                message?: string;
                validator?: (...args: unknown[]) => unknown;
            }[];
            name?: string;
            visible?: boolean;
            defaultValue?: any;
            group?: string;
            disabled?: boolean;
            placeholder?: string;
            helpText?: string;
        }, {
            type?: "number" | "boolean" | "object" | "color" | "text" | "select" | "multiselect" | "image" | "link" | "richtext" | "code" | "array" | "style";
            label?: string;
            options?: {
                label?: string;
                value?: any;
            }[];
            validation?: {
                type?: "required" | "min" | "max" | "pattern" | "custom";
                value?: any;
                message?: string;
                validator?: (...args: unknown[]) => unknown;
            }[];
            name?: string;
            visible?: boolean;
            defaultValue?: any;
            group?: string;
            disabled?: boolean;
            placeholder?: string;
            helpText?: string;
        }>, "many">;
        isContainer: z.ZodOptional<z.ZodBoolean>;
        isVoid: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        type?: string;
        label?: string;
        category?: string;
        icon?: string;
        defaultProps?: Record<string, any>;
        defaultStyles?: Partial<Record<"paddingTop" | "paddingBottom" | "paddingLeft" | "paddingRight" | "marginTop" | "marginBottom" | "marginLeft" | "marginRight" | "backgroundColor" | "color" | "fontSize" | "fontWeight" | "lineHeight" | "textAlign" | "borderRadius" | "borderWidth" | "borderColor" | "borderStyle" | "boxShadow" | "opacity" | "display" | "flexDirection" | "justifyContent" | "alignItems" | "gap" | "gridTemplateColumns" | "gridTemplateRows" | "width" | "height" | "maxWidth" | "minWidth" | "maxHeight" | "minHeight" | "position" | "top" | "right" | "bottom" | "left" | "zIndex", string | number>>;
        defaultResponsiveStyles?: Partial<Record<"mobile" | "tablet" | "desktop" | "wide", Partial<Record<"paddingTop" | "paddingBottom" | "paddingLeft" | "paddingRight" | "marginTop" | "marginBottom" | "marginLeft" | "marginRight" | "backgroundColor" | "color" | "fontSize" | "fontWeight" | "lineHeight" | "textAlign" | "borderRadius" | "borderWidth" | "borderColor" | "borderStyle" | "boxShadow" | "opacity" | "display" | "flexDirection" | "justifyContent" | "alignItems" | "gap" | "gridTemplateColumns" | "gridTemplateRows" | "width" | "height" | "maxWidth" | "minWidth" | "maxHeight" | "minHeight" | "position" | "top" | "right" | "bottom" | "left" | "zIndex", string | number>>>>;
        allowedChildren?: string[];
        allowedParents?: string[];
        inspector?: {
            type?: "number" | "boolean" | "object" | "color" | "text" | "select" | "multiselect" | "image" | "link" | "richtext" | "code" | "array" | "style";
            label?: string;
            options?: {
                label?: string;
                value?: any;
            }[];
            validation?: {
                type?: "required" | "min" | "max" | "pattern" | "custom";
                value?: any;
                message?: string;
                validator?: (...args: unknown[]) => unknown;
            }[];
            name?: string;
            visible?: boolean;
            defaultValue?: any;
            group?: string;
            disabled?: boolean;
            placeholder?: string;
            helpText?: string;
        }[];
        isContainer?: boolean;
        isVoid?: boolean;
    }, {
        type?: string;
        label?: string;
        category?: string;
        icon?: string;
        defaultProps?: Record<string, any>;
        defaultStyles?: Partial<Record<"paddingTop" | "paddingBottom" | "paddingLeft" | "paddingRight" | "marginTop" | "marginBottom" | "marginLeft" | "marginRight" | "backgroundColor" | "color" | "fontSize" | "fontWeight" | "lineHeight" | "textAlign" | "borderRadius" | "borderWidth" | "borderColor" | "borderStyle" | "boxShadow" | "opacity" | "display" | "flexDirection" | "justifyContent" | "alignItems" | "gap" | "gridTemplateColumns" | "gridTemplateRows" | "width" | "height" | "maxWidth" | "minWidth" | "maxHeight" | "minHeight" | "position" | "top" | "right" | "bottom" | "left" | "zIndex", string | number>>;
        defaultResponsiveStyles?: Partial<Record<"mobile" | "tablet" | "desktop" | "wide", Partial<Record<"paddingTop" | "paddingBottom" | "paddingLeft" | "paddingRight" | "marginTop" | "marginBottom" | "marginLeft" | "marginRight" | "backgroundColor" | "color" | "fontSize" | "fontWeight" | "lineHeight" | "textAlign" | "borderRadius" | "borderWidth" | "borderColor" | "borderStyle" | "boxShadow" | "opacity" | "display" | "flexDirection" | "justifyContent" | "alignItems" | "gap" | "gridTemplateColumns" | "gridTemplateRows" | "width" | "height" | "maxWidth" | "minWidth" | "maxHeight" | "minHeight" | "position" | "top" | "right" | "bottom" | "left" | "zIndex", string | number>>>>;
        allowedChildren?: string[];
        allowedParents?: string[];
        inspector?: {
            type?: "number" | "boolean" | "object" | "color" | "text" | "select" | "multiselect" | "image" | "link" | "richtext" | "code" | "array" | "style";
            label?: string;
            options?: {
                label?: string;
                value?: any;
            }[];
            validation?: {
                type?: "required" | "min" | "max" | "pattern" | "custom";
                value?: any;
                message?: string;
                validator?: (...args: unknown[]) => unknown;
            }[];
            name?: string;
            visible?: boolean;
            defaultValue?: any;
            group?: string;
            disabled?: boolean;
            placeholder?: string;
            helpText?: string;
        }[];
        isContainer?: boolean;
        isVoid?: boolean;
    }>, "many">>;
    commands: z.ZodOptional<z.ZodArray<z.ZodObject<{
        type: z.ZodString;
        execute: z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>;
        undo: z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>;
        description: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        type?: string;
        description?: string;
        execute?: (...args: unknown[]) => unknown;
        undo?: (...args: unknown[]) => unknown;
        timestamp?: number;
    }, {
        type?: string;
        description?: string;
        execute?: (...args: unknown[]) => unknown;
        undo?: (...args: unknown[]) => unknown;
        timestamp?: number;
    }>, "many">>;
    hooks: z.ZodOptional<z.ZodObject<{
        onProjectLoad: z.ZodOptional<z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>>;
        onProjectSave: z.ZodOptional<z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>>;
        onComponentSelect: z.ZodOptional<z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>>;
        onComponentUpdate: z.ZodOptional<z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>>;
        onComponentDelete: z.ZodOptional<z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>>;
        onExport: z.ZodOptional<z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>>;
    }, "strip", z.ZodTypeAny, {
        onProjectLoad?: (...args: unknown[]) => unknown;
        onProjectSave?: (...args: unknown[]) => unknown;
        onComponentSelect?: (...args: unknown[]) => unknown;
        onComponentUpdate?: (...args: unknown[]) => unknown;
        onComponentDelete?: (...args: unknown[]) => unknown;
        onExport?: (...args: unknown[]) => unknown;
    }, {
        onProjectLoad?: (...args: unknown[]) => unknown;
        onProjectSave?: (...args: unknown[]) => unknown;
        onComponentSelect?: (...args: unknown[]) => unknown;
        onComponentUpdate?: (...args: unknown[]) => unknown;
        onComponentDelete?: (...args: unknown[]) => unknown;
        onExport?: (...args: unknown[]) => unknown;
    }>>;
}, "strip", z.ZodTypeAny, {
    name?: string;
    description?: string;
    components?: {
        type?: string;
        label?: string;
        category?: string;
        icon?: string;
        defaultProps?: Record<string, any>;
        defaultStyles?: Partial<Record<"paddingTop" | "paddingBottom" | "paddingLeft" | "paddingRight" | "marginTop" | "marginBottom" | "marginLeft" | "marginRight" | "backgroundColor" | "color" | "fontSize" | "fontWeight" | "lineHeight" | "textAlign" | "borderRadius" | "borderWidth" | "borderColor" | "borderStyle" | "boxShadow" | "opacity" | "display" | "flexDirection" | "justifyContent" | "alignItems" | "gap" | "gridTemplateColumns" | "gridTemplateRows" | "width" | "height" | "maxWidth" | "minWidth" | "maxHeight" | "minHeight" | "position" | "top" | "right" | "bottom" | "left" | "zIndex", string | number>>;
        defaultResponsiveStyles?: Partial<Record<"mobile" | "tablet" | "desktop" | "wide", Partial<Record<"paddingTop" | "paddingBottom" | "paddingLeft" | "paddingRight" | "marginTop" | "marginBottom" | "marginLeft" | "marginRight" | "backgroundColor" | "color" | "fontSize" | "fontWeight" | "lineHeight" | "textAlign" | "borderRadius" | "borderWidth" | "borderColor" | "borderStyle" | "boxShadow" | "opacity" | "display" | "flexDirection" | "justifyContent" | "alignItems" | "gap" | "gridTemplateColumns" | "gridTemplateRows" | "width" | "height" | "maxWidth" | "minWidth" | "maxHeight" | "minHeight" | "position" | "top" | "right" | "bottom" | "left" | "zIndex", string | number>>>>;
        allowedChildren?: string[];
        allowedParents?: string[];
        inspector?: {
            type?: "number" | "boolean" | "object" | "color" | "text" | "select" | "multiselect" | "image" | "link" | "richtext" | "code" | "array" | "style";
            label?: string;
            options?: {
                label?: string;
                value?: any;
            }[];
            validation?: {
                type?: "required" | "min" | "max" | "pattern" | "custom";
                value?: any;
                message?: string;
                validator?: (...args: unknown[]) => unknown;
            }[];
            name?: string;
            visible?: boolean;
            defaultValue?: any;
            group?: string;
            disabled?: boolean;
            placeholder?: string;
            helpText?: string;
        }[];
        isContainer?: boolean;
        isVoid?: boolean;
    }[];
    version?: string;
    initialize?: (...args: unknown[]) => unknown;
    destroy?: (...args: unknown[]) => unknown;
    commands?: {
        type?: string;
        description?: string;
        execute?: (...args: unknown[]) => unknown;
        undo?: (...args: unknown[]) => unknown;
        timestamp?: number;
    }[];
    hooks?: {
        onProjectLoad?: (...args: unknown[]) => unknown;
        onProjectSave?: (...args: unknown[]) => unknown;
        onComponentSelect?: (...args: unknown[]) => unknown;
        onComponentUpdate?: (...args: unknown[]) => unknown;
        onComponentDelete?: (...args: unknown[]) => unknown;
        onExport?: (...args: unknown[]) => unknown;
    };
}, {
    name?: string;
    description?: string;
    components?: {
        type?: string;
        label?: string;
        category?: string;
        icon?: string;
        defaultProps?: Record<string, any>;
        defaultStyles?: Partial<Record<"paddingTop" | "paddingBottom" | "paddingLeft" | "paddingRight" | "marginTop" | "marginBottom" | "marginLeft" | "marginRight" | "backgroundColor" | "color" | "fontSize" | "fontWeight" | "lineHeight" | "textAlign" | "borderRadius" | "borderWidth" | "borderColor" | "borderStyle" | "boxShadow" | "opacity" | "display" | "flexDirection" | "justifyContent" | "alignItems" | "gap" | "gridTemplateColumns" | "gridTemplateRows" | "width" | "height" | "maxWidth" | "minWidth" | "maxHeight" | "minHeight" | "position" | "top" | "right" | "bottom" | "left" | "zIndex", string | number>>;
        defaultResponsiveStyles?: Partial<Record<"mobile" | "tablet" | "desktop" | "wide", Partial<Record<"paddingTop" | "paddingBottom" | "paddingLeft" | "paddingRight" | "marginTop" | "marginBottom" | "marginLeft" | "marginRight" | "backgroundColor" | "color" | "fontSize" | "fontWeight" | "lineHeight" | "textAlign" | "borderRadius" | "borderWidth" | "borderColor" | "borderStyle" | "boxShadow" | "opacity" | "display" | "flexDirection" | "justifyContent" | "alignItems" | "gap" | "gridTemplateColumns" | "gridTemplateRows" | "width" | "height" | "maxWidth" | "minWidth" | "maxHeight" | "minHeight" | "position" | "top" | "right" | "bottom" | "left" | "zIndex", string | number>>>>;
        allowedChildren?: string[];
        allowedParents?: string[];
        inspector?: {
            type?: "number" | "boolean" | "object" | "color" | "text" | "select" | "multiselect" | "image" | "link" | "richtext" | "code" | "array" | "style";
            label?: string;
            options?: {
                label?: string;
                value?: any;
            }[];
            validation?: {
                type?: "required" | "min" | "max" | "pattern" | "custom";
                value?: any;
                message?: string;
                validator?: (...args: unknown[]) => unknown;
            }[];
            name?: string;
            visible?: boolean;
            defaultValue?: any;
            group?: string;
            disabled?: boolean;
            placeholder?: string;
            helpText?: string;
        }[];
        isContainer?: boolean;
        isVoid?: boolean;
    }[];
    version?: string;
    initialize?: (...args: unknown[]) => unknown;
    destroy?: (...args: unknown[]) => unknown;
    commands?: {
        type?: string;
        description?: string;
        execute?: (...args: unknown[]) => unknown;
        undo?: (...args: unknown[]) => unknown;
        timestamp?: number;
    }[];
    hooks?: {
        onProjectLoad?: (...args: unknown[]) => unknown;
        onProjectSave?: (...args: unknown[]) => unknown;
        onComponentSelect?: (...args: unknown[]) => unknown;
        onComponentUpdate?: (...args: unknown[]) => unknown;
        onComponentDelete?: (...args: unknown[]) => unknown;
        onExport?: (...args: unknown[]) => unknown;
    };
}>;
/**
 * Export Options validation
 */
export declare const ExportOptionsSchema: z.ZodObject<{
    format: z.ZodEnum<["html", "react", "wordpress", "odoo"]>;
    optimizeAssets: z.ZodBoolean;
    minify: z.ZodBoolean;
    includeSourceMaps: z.ZodBoolean;
    customOptions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    format?: "odoo" | "wordpress" | "html" | "react";
    optimizeAssets?: boolean;
    minify?: boolean;
    includeSourceMaps?: boolean;
    customOptions?: Record<string, any>;
}, {
    format?: "odoo" | "wordpress" | "html" | "react";
    optimizeAssets?: boolean;
    minify?: boolean;
    includeSourceMaps?: boolean;
    customOptions?: Record<string, any>;
}>;
/**
 * Export Result validation
 */
export declare const ExportResultSchema: z.ZodObject<{
    success: z.ZodBoolean;
    data: z.ZodOptional<z.ZodAny>;
    error: z.ZodOptional<z.ZodString>;
    warnings: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    data?: any;
    success?: boolean;
    error?: string;
    warnings?: string[];
}, {
    data?: any;
    success?: boolean;
    error?: string;
    warnings?: string[];
}>;
//# sourceMappingURL=index.d.ts.map