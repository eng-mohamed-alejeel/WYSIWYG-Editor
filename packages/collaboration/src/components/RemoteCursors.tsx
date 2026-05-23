/**
 * Remote Cursors Component
 *
 * Displays remote user cursors in the editor
 */

import React, { useEffect } from 'react';
import { useRemoteCursors, useUsers } from '../store/CollaborationStore';
import { RemoteCursor } from '../types';

interface RemoteCursorsProps {
  containerRef?: React.RefObject<HTMLElement>;
  onCursorClick?: (userId: string) => void;
  className?: string;
}

interface CursorPosition {
  userId: string;
  x: number;
  y: number;
  color: string;
  name: string;
}

export const RemoteCursors: React.FC<RemoteCursorsProps> = ({
  containerRef,
  onCursorClick,
  className = '',
}) => {
  const cursors = useRemoteCursors();
  const users = useUsers();

  const [cursorPositions, setCursorPositions] = React.useState<CursorPosition[]>([]);

  useEffect(() => {
    // Convert cursors to positions
    const positions: CursorPosition[] = cursors.map((cursor: RemoteCursor) => {
      const user = users.find((u) => u.id === cursor.userId);
      return {
        userId: cursor.userId,
        x: cursor.position.x,
        y: cursor.position.y,
        color: user?.color || '#FF5733',
        name: user?.name || 'Unknown',
      };
    });

    setCursorPositions(positions);
  }, [cursors, users]);

  const handleCursorClick = (userId: string) => {
    if (onCursorClick) {
      onCursorClick(userId);
    }
  };

  return (
    <div className={`remote-cursors ${className}`}>
      {cursorPositions.map((position) => (
        <div
          key={position.userId}
          className="remote-cursor"
          style={{
            position: 'absolute',
            left: position.x,
            top: position.y,
            pointerEvents: 'auto',
            cursor: 'pointer',
            zIndex: 1000,
          }}
          onClick={() => handleCursorClick(position.userId)}
        >
          {/* Cursor icon */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            style={{
              filter: `drop-shadow(0 2px 4px rgba(0,0,0,0.2))`,
            }}
          >
            <path
              d="M5 2L5 18L9 14L12 18L14 16L11 12L15 12L5 2Z"
              fill={position.color}
              stroke="white"
              strokeWidth="1"
            />
          </svg>

          {/* User name label */}
          <div
            className="cursor-label"
            style={{
              position: 'absolute',
              left: 20,
              top: 20,
              backgroundColor: position.color,
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}
          >
            {position.name}
          </div>
        </div>
      ))}
    </div>
  );
};
