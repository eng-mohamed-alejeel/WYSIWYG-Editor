/**
 * Video Component
 * 
 * A video component for displaying videos with various
 * customization options like size, controls, and autoplay.
 */

import React from 'react';
import { BaseComponentProps } from '../types';
import { parseInlineStyles, mergeStyles } from '../utils/styleUtils';

export const Video: React.FC<BaseComponentProps> = ({
  node,
  context,
  style,
  className = ''
}) => {
  const { isEditable, isPreview } = context;
  const baseClassName = `wysiwyg-video ${className}`.trim();

  return (
    <video
      id={node.id}
      src={node.props.src || ''}
      className={baseClassName}
      controls={node.props.controls !== false}
      autoPlay={node.props.autoPlay || false}
      loop={node.props.loop || false}
      muted={node.props.muted || false}
      poster={node.props.poster}
      style={mergeStyles({
        width: node.props.width || '100%',
        height: node.props.height || 'auto',
        maxWidth: node.props.maxWidth || '100%',
        borderRadius: node.props.borderRadius || '0',
        ...node.styles,
        ...parseInlineStyles(style)
      } as React.CSSProperties)}
      data-component-type={node.type}
      data-editable={isEditable}
      data-preview={isPreview}
    >
      Your browser does not support the video tag.
    </video>
  );
};