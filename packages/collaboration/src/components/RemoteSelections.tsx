/**
 * Remote Selections Component
 *
 * Displays remote user selections in the editor
 */

import React from 'react';
import { useRemoteSelections, useUsers } from '../store/CollaborationStore';
import { RemoteSelection } from '../types';

interface RemoteSelectionsProps {
  getComponentElement?: (componentId: string) => HTMLElement | null;
  onSelectionClick?: (userId: string) => void;
  className?: string;
}

interface SelectionInfo {
  userId: string;
  componentIds: string[];
  color: string;
  name: string;
}

export const RemoteSelections: React.FC<RemoteSelectionsProps> = ({
  getComponentElement,
  onSelectionClick,
  className = '',
}) => {
  const selections = useRemoteSelections();
  const users = useUsers();

  const [selectionInfos, setSelectionInfos] = React.useState<SelectionInfo[]>([]);

  React.useEffect(() => {
    // Convert selections to display info
    const infos: SelectionInfo[] = selections.map((selection: RemoteSelection) => {
      const user = users.find((u) => u.id === selection.userId);
      return {
        userId: selection.userId,
        componentIds: selection.selectedIds,
        color: user?.color || '#FF5733',
        name: user?.name || 'Unknown',
      };
    });

    setSelectionInfos(infos);
  }, [selections, users]);

  const handleSelectionClick = (userId: string) => {
    if (onSelectionClick) {
      onSelectionClick(userId);
    }
  };

  return (
    <div className={`remote-selections ${className}`}>
      {selectionInfos.map((info) => (
        <React.Fragment key={info.userId}>
          {info.componentIds.map((componentId) => {
            const element = getComponentElement?.(componentId);
            if (!element) return null;

            const rect = element.getBoundingClientRect();

            return (
              <div
                key={`${info.userId}-${componentId}`}
                className="remote-selection"
                style={{
                  position: 'fixed',
                  left: rect.left,
                  top: rect.top,
                  width: rect.width,
                  height: rect.height,
                  border: `2px solid ${info.color}`,
                  backgroundColor: `${info.color}20`,
                  pointerEvents: 'auto',
                  cursor: 'pointer',
                  zIndex: 999,
                  transition: 'all 0.2s ease',
                }}
                onClick={() => handleSelectionClick(info.userId)}
              >
                {/* Selection label */}
                <div
                  className="selection-label"
                  style={{
                    position: 'absolute',
                    top: -24,
                    left: 0,
                    backgroundColor: info.color,
                    color: 'white',
                    padding: '2px 6px',
                    borderRadius: '3px',
                    fontSize: '11px',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  }}
                >
                  {info.name}
                </div>
              </div>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
};
