import React from 'react';
import { ComponentNode } from '@wysiwyg/core';

interface TableComponentProps {
  component: ComponentNode;
  convertStylesToCSS: (styles?: Record<string, string | number>) => React.CSSProperties;
}

export const TableComponent: React.FC<TableComponentProps> = ({
  component,
  convertStylesToCSS,
}) => (
  <table style={convertStylesToCSS(component.styles)}>
    <thead>
      <tr>
        {component.props?.headers?.map((header: string, index: number) => (
          <th
            key={index}
            style={{
              padding: '0.75rem',
              border: '1px solid #e5e7eb',
              background: '#f9fafb',
              fontWeight: '600',
            }}
          >
            {header}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {component.props?.rows?.map((row: string[], rowIndex: number) => (
        <tr key={rowIndex} style={{ backgroundColor: rowIndex % 2 === 0 ? 'white' : '#f9fafb' }}>
          {row.map((cell: string, cellIndex: number) => (
            <td key={cellIndex} style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>
              {cell}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);
