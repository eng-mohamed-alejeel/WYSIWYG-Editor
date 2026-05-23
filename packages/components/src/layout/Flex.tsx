/**
 * Flex Component
 *
 * A flexbox layout component for creating flexible layouts.
 * Supports various flex properties and responsive breakpoints.
 */

import React from 'react';
import { BaseComponentProps } from '../types';
import { parseInlineStyles, mergeStyles } from '../utils/styleUtils';

type FlexDirection = 'row' | 'row-reverse' | 'column' | 'column-reverse';
type JustifyContent =
  | 'flex-start'
  | 'flex-end'
  | 'center'
  | 'space-between'
  | 'space-around'
  | 'space-evenly';
type AlignItems = 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
type AlignContent =
  | 'flex-start'
  | 'flex-end'
  | 'center'
  | 'space-between'
  | 'space-around'
  | 'space-evenly'
  | 'stretch';
type FlexWrap = 'nowrap' | 'wrap' | 'wrap-reverse';
type FlexGrow = number | string;
type FlexShrink = number | string;
type FlexBasis = string | number;
type AlignSelf = 'auto' | 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';

export interface FlexProps {
  display?: 'flex' | number;
  flexDirection?: FlexDirection | number;
  justifyContent?: JustifyContent | number;
  alignItems?: AlignItems | number;
  alignContent?: AlignContent | number;
  flexWrap?: FlexWrap | number;
  flexGrow?: FlexGrow;
  flexShrink?: FlexShrink;
  flexBasis?: FlexBasis;
  alignSelf?: AlignSelf | number;
  gap?: string;
  rowGap?: string;
  columnGap?: string;
  smDirection?: FlexDirection | number;
  mdDirection?: FlexDirection | number;
  lgDirection?: FlexDirection | number;
  xlDirection?: FlexDirection | number;
  smJustify?: JustifyContent | number;
  mdJustify?: JustifyContent | number;
  lgJustify?: JustifyContent | number;
  xlJustify?: JustifyContent | number;
  smAlign?: AlignItems | number;
  mdAlign?: AlignItems | number;
  lgAlign?: AlignItems | number;
  xlAlign?: AlignItems | number;
}

export interface CustomCSSProperties extends React.CSSProperties {
  '@media (min-width: 640px)'?: React.CSSProperties;
  '@media (min-width: 768px)'?: React.CSSProperties;
  '@media (min-width: 1024px)'?: React.CSSProperties;
  '@media (min-width: 1280px)'?: React.CSSProperties;
}

const FLEX_DIRECTIONS: readonly FlexDirection[] = [
  'row',
  'row-reverse',
  'column',
  'column-reverse',
] as const;

const JUSTIFY_CONTENTS: readonly JustifyContent[] = [
  'flex-start',
  'flex-end',
  'center',
  'space-between',
  'space-around',
  'space-evenly',
] as const;

const ALIGN_ITEMS: readonly AlignItems[] = [
  'flex-start',
  'flex-end',
  'center',
  'stretch',
  'baseline',
] as const;

function normalizeFlexDirection(value?: FlexDirection | number): FlexDirection {
  if (typeof value === 'number') {
    return FLEX_DIRECTIONS[value % FLEX_DIRECTIONS.length];
  }
  return value ?? 'row';
}

function normalizeJustifyContent(value?: JustifyContent | number): JustifyContent {
  if (typeof value === 'number') {
    return JUSTIFY_CONTENTS[value % JUSTIFY_CONTENTS.length];
  }
  return value ?? 'flex-start';
}

function normalizeAlignItems(value?: AlignItems | number): AlignItems {
  if (typeof value === 'number') {
    return ALIGN_ITEMS[value % ALIGN_ITEMS.length];
  }
  return value ?? 'stretch';
}

export const Flex: React.FC<BaseComponentProps> = ({
  node,
  context,
  children,
  style,
  className = '',
}) => {
  const { isEditable, isPreview } = context;
  const baseClassName = `wysiwyg-flex ${className}`.trim();

  const flexProps = node.props as FlexProps;

  const flexStyles = {
    display: 'flex',
    flexDirection: normalizeFlexDirection(flexProps.flexDirection),
    justifyContent: normalizeJustifyContent(flexProps.justifyContent),
    alignItems: normalizeAlignItems(flexProps.alignItems),
    flexWrap: flexProps.flexWrap ?? 'nowrap',
    gap: flexProps.gap ?? '0',
    ...getResponsiveStyles(flexProps),
    ...node.styles,
    ...parseInlineStyles(style),
  } as React.CSSProperties;

  return (
    <div
      id={node.id}
      className={baseClassName}
      style={mergeStyles(flexStyles)}
      data-component-type={node.type}
      data-editable={isEditable}
      data-preview={isPreview}
    >
      {children}
    </div>
  );
};

function getResponsiveStyles(props: FlexProps): CustomCSSProperties {
  const styles: CustomCSSProperties = {};

  if (props.smDirection !== undefined) {
    styles['@media (min-width: 640px)'] = {
      flexDirection: normalizeFlexDirection(props.smDirection),
    };
  }

  if (props.mdDirection !== undefined) {
    styles['@media (min-width: 768px)'] = {
      flexDirection: normalizeFlexDirection(props.mdDirection),
    };
  }

  if (props.lgDirection !== undefined) {
    styles['@media (min-width: 1024px)'] = {
      flexDirection: normalizeFlexDirection(props.lgDirection),
    };
  }

  if (props.xlDirection !== undefined) {
    styles['@media (min-width: 1280px)'] = {
      flexDirection: normalizeFlexDirection(props.xlDirection),
    };
  }

  return styles;
}
