/**
 * Collaboration Status Component
 *
 * Displays collaboration status and connected users
 */

import React, { useState } from 'react';
import {
  useIsConnected,
  useConnectionState,
  useOnlineUsers,
  useUsers,
} from '../store/CollaborationStore';
import { CollaborativeUser } from '../types';

interface CollaborationStatusProps {
  className?: string;
  showUserList?: boolean;
  onUserClick?: (user: CollaborativeUser) => void;
}

export const CollaborationStatus: React.FC<CollaborationStatusProps> = ({
  className = '',
  showUserList = true,
  onUserClick,
}) => {
  const isConnected = useIsConnected();
  const connectionState = useConnectionState();
  const onlineUsers = useOnlineUsers();
  const users = useUsers();
  const [isUserListOpen, setIsUserListOpen] = useState(false);

  const getStatusColor = () => {
    switch (connectionState) {
      case 'connected':
        return 'bg-green-500';
      case 'connecting':
      case 'reconnecting':
        return 'bg-yellow-500';
      case 'disconnected':
        return 'bg-gray-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    switch (connectionState) {
      case 'connected':
        return 'Connected';
      case 'connecting':
        return 'Connecting...';
      case 'reconnecting':
        return 'Reconnecting...';
      case 'disconnected':
        return 'Disconnected';
      case 'error':
        return 'Connection Error';
      default:
        return 'Unknown';
    }
  };

  const handleUserClick = (user: CollaborativeUser) => {
    if (onUserClick) {
      onUserClick(user);
    }
    setIsUserListOpen(false);
  };

  return (
    <div className={`collaboration-status ${className}`}>
      {/* Status indicator */}
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} title={getStatusText()} />
        <span className="text-sm text-gray-600">{getStatusText()}</span>

        {/* Online users count */}
        {isConnected && showUserList && (
          <button
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
            onClick={() => setIsUserListOpen(!isUserListOpen)}
          >
            <span className="font-medium">{onlineUsers.length}</span>
            <span>online</span>
          </button>
        )}
      </div>

      {/* User list dropdown */}
      {isUserListOpen && showUserList && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-3 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900">
              Online Users ({onlineUsers.length})
            </h3>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {onlineUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer"
                onClick={() => handleUserClick(user)}
              >
                {/* User color indicator */}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                  style={{ backgroundColor: user.color }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>

                {/* User name */}
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  <div className="text-xs text-gray-500">
                    {user.isOnline ? 'Active now' : 'Away'}
                  </div>
                </div>

                {/* Online indicator */}
                <div className="w-2 h-2 rounded-full bg-green-500" />
              </div>
            ))}

            {onlineUsers.length === 0 && (
              <div className="p-4 text-center text-sm text-gray-500">No users online</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
