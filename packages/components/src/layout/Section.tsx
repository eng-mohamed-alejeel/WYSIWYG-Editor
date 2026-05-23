/**
 * Section Component
 *
 * A container component that represents a section of a page.
 * Can contain other components and provides layout structure.
 */

import React from 'react';
import { BaseComponentProps } from '../types';
import { parseInlineStyles, mergeStyles } from '../utils/styleUtils';

export const Section: React.FC<BaseComponentProps> = ({
  node,
  context,
  children,
  style,
  className = '',
}) => {
  const { isEditable, isPreview } = context;
  const baseClassName = `wysiwyg-section ${className}`.trim();

  return (
    <section
      id={node.id}
      className={baseClassName}
      style={mergeStyles({
        ...node.styles,
        ...parseInlineStyles(style),
      } as React.CSSProperties)}
      data-component-type={node.type}
      data-editable={isEditable}
      data-preview={isPreview}
    >
      {children}
    </section>
  );
};
