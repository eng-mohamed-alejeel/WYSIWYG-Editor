/**
 * Component Operations
 *
 * Handles component-related storage operations.
 */

import { ComponentId } from '@wysiwyg/core';
import { StorageResult, StorageEvent } from '../types';
import { getComponents, setComponents } from './LocalStorageAdapterHelpers';
import { withErrorHandling } from './OperationHelpers';

export interface ComponentOperationsContext {
  STORAGE_PREFIX: string;
  COMPONENTS_KEY: string;
  emitEvent: (event: StorageEvent) => void;
  ensureConnected: () => void;
}

export async function saveComponent(
  context: ComponentOperationsContext,
  component: Record<string, unknown>
): Promise<StorageResult> {
  return withErrorHandling(() => {
    context.ensureConnected();

    const components = getComponents(context.STORAGE_PREFIX, context.COMPONENTS_KEY);
    const componentId = String(component.id);
    components[componentId] = component;

    setComponents(context.STORAGE_PREFIX, context.COMPONENTS_KEY, components);
    context.emitEvent({
      type: 'save',
      target: 'component',
      targetId: componentId,
      data: component,
      timestamp: Date.now(),
    });
  });
}

export async function loadComponent(
  context: ComponentOperationsContext,
  id: ComponentId
): Promise<StorageResult<Record<string, unknown>>> {
  return withErrorHandling(() => {
    context.ensureConnected();

    const components = getComponents(context.STORAGE_PREFIX, context.COMPONENTS_KEY);
    const component = components[id];

    if (component === undefined) {
      throw new Error(`Component with id ${id} not found`);
    }

    context.emitEvent({
      type: 'load',
      target: 'component',
      targetId: id,
      data: component,
      timestamp: Date.now(),
    });

    return component;
  });
}

export async function deleteComponent(
  context: ComponentOperationsContext,
  id: ComponentId
): Promise<StorageResult> {
  return withErrorHandling(() => {
    context.ensureConnected();

    const components = getComponents(context.STORAGE_PREFIX, context.COMPONENTS_KEY);
    delete components[id];

    setComponents(context.STORAGE_PREFIX, context.COMPONENTS_KEY, components);
    context.emitEvent({
      type: 'delete',
      target: 'component',
      targetId: id,
      timestamp: Date.now(),
    });
  });
}

export async function listComponents(
  context: ComponentOperationsContext
): Promise<StorageResult<Record<string, Record<string, unknown>>>> {
  return withErrorHandling(() => {
    context.ensureConnected();

    const components = getComponents(context.STORAGE_PREFIX, context.COMPONENTS_KEY);
    return components;
  });
}
