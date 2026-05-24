/**
 * Alignment Guides Component
 *
 * Displays alignment guides during drag and resize operations
 * Following Figma and Webflow UX patterns
 */

import React, { useMemo } from 'react';
import { AlignmentGuide } from './types';

interface AlignmentGuidesProps {
  guides: AlignmentGuide[];
  config: {
    enabled: boolean;
    color: string;
    strongColor: string;
    opacity: number;
  };
}

export const AlignmentGuides: React.FC<AlignmentGuidesProps> = React.memo(({ guides, config }) => {
  // جميع الـ Hooks يجب أن تكون في البداية قبل أي عودة مبكرة
  const horizontalGuides = useMemo(() => guides.filter((g) => g.type === 'horizontal'), [guides]);

  const verticalGuides = useMemo(() => guides.filter((g) => g.type === 'vertical'), [guides]);

  const guideStyle = useMemo(
    () => ({
      position: 'absolute' as const,
      pointerEvents: 'none' as const,
      zIndex: 9999,
    }),
    []
  );

  // التحقق من الشروط بعد الـ Hooks
  if (!config.enabled || guides.length === 0) {
    return null;
  }

  return (
    <>
      {/* Horizontal guides */}
      {horizontalGuides.map((guide, index) => (
        <div
          key={`h-${index}`}
          className="alignment-guide alignment-guide-horizontal"
          style={{
            ...guideStyle,
            left: `${guide.start}px`,
            top: `${guide.position}px`,
            width: `${guide.end - guide.start}px`,
            height: '1px',
            backgroundColor: guide.strength === 'strong' ? config.strongColor : config.color,
            opacity: config.opacity,
          }}
        />
      ))}

      {/* Vertical guides */}
      {verticalGuides.map((guide, index) => (
        <div
          key={`v-${index}`}
          className="alignment-guide alignment-guide-vertical"
          style={{
            ...guideStyle,
            left: `${guide.position}px`,
            top: `${guide.start}px`,
            width: '1px',
            height: `${guide.end - guide.start}px`,
            backgroundColor: guide.strength === 'strong' ? config.strongColor : config.color,
            opacity: config.opacity,
          }}
        />
      ))}
    </>
  );
});

AlignmentGuides.displayName = 'AlignmentGuides';
