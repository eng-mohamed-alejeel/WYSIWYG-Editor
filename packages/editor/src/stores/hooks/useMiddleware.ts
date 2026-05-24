/**
 * Middleware Management Hook
 *
 * Handles middleware registration and lifecycle
 */

import { useEffect } from 'react';
import { middlewareManager } from '../middleware';
import {
  loggingMiddleware,
  eventMiddleware,
  analyticsMiddleware,
  performanceMiddleware,
  crdtSyncMiddleware,
} from '../middleware';
import { EditorConfig } from '../../types';

export const useMiddleware = (config?: EditorConfig) => {
  useEffect(() => {
    middlewareManager.register(loggingMiddleware);
    middlewareManager.register(eventMiddleware);
    middlewareManager.register(performanceMiddleware);
    middlewareManager.register(crdtSyncMiddleware);

    if (config?.enableAnalytics) {
      middlewareManager.register(analyticsMiddleware);
    }

    return () => {
      middlewareManager.unregister('logging');
      middlewareManager.unregister('events');
      middlewareManager.unregister('performance');
      middlewareManager.unregister('crdt-sync');
      if (config?.enableAnalytics) {
        middlewareManager.unregister('analytics');
      }
    };
  }, [config?.enableAnalytics]);
};
