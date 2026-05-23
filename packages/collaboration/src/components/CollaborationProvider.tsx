/**
 * Collaboration Provider
 *
 * React context provider for collaborative editing features
 */

import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useCollaborationStore } from '../store/CollaborationStore';
import { CollaborationConfig } from '../types';

interface CollaborationContextValue {
  isConnected: boolean;
  connectionState: string;
  connect: (config: CollaborationConfig) => Promise<void>;
  disconnect: () => Promise<void>;
}

const CollaborationContext = createContext<CollaborationContextValue | undefined>(undefined);

interface CollaborationProviderProps {
  children: ReactNode;
  config?: CollaborationConfig;
  autoConnect?: boolean;
}

export const CollaborationProvider: React.FC<CollaborationProviderProps> = ({
  children,
  config,
  autoConnect = false,
}) => {
  const isConnected = useCollaborationStore((state) => state.isConnected);
  const connectionState = useCollaborationStore((state) => state.connectionState);
  const connect = useCollaborationStore((state) => state.connect);
  const disconnect = useCollaborationStore((state) => state.disconnect);

  useEffect(() => {
    if (autoConnect && config) {
      connect(config).catch((error) => {
        console.error('Failed to connect to collaboration server:', error);
      });
    }

    return () => {
      if (isConnected) {
        disconnect().catch((error) => {
          console.error('Failed to disconnect from collaboration server:', error);
        });
      }
    };
  }, [autoConnect]);

  const value: CollaborationContextValue = {
    isConnected,
    connectionState,
    connect,
    disconnect,
  };

  return <CollaborationContext.Provider value={value}>{children}</CollaborationContext.Provider>;
};

export const useCollaboration = (): CollaborationContextValue => {
  const context = useContext(CollaborationContext);
  if (!context) {
    throw new Error('useCollaboration must be used within a CollaborationProvider');
  }
  return context;
};
