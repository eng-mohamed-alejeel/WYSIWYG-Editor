/**
 * Project Operations
 *
 * Handles project-related storage operations.
 */

import { Project } from '@wysiwyg/core';
import { StorageResult, StorageEvent } from '../types';
import { getProjects, setProjects } from './LocalStorageAdapterHelpers';
import { withErrorHandling } from './OperationHelpers';

export interface ProjectOperationsContext {
  STORAGE_PREFIX: string;
  PROJECTS_KEY: string;
  emitEvent: (event: StorageEvent) => void;
  ensureConnected: () => void;
}

// eslint-disable-next-line @typescript-eslint/require-await
export async function saveProject(
  context: ProjectOperationsContext,
  project: Project
): Promise<StorageResult<Project>> {
  return withErrorHandling(() => {
    context.ensureConnected();

    const projects = getProjects(context.STORAGE_PREFIX, context.PROJECTS_KEY);
    const existingIndex = projects.findIndex((p: Project) => p.id === project.id);

    if (existingIndex >= 0) {
      projects[existingIndex] = project;
    } else {
      projects.push(project);
    }

    setProjects(context.STORAGE_PREFIX, context.PROJECTS_KEY, projects);
    context.emitEvent({
      type: 'save',
      target: 'project',
      targetId: project.id,
      data: project,
      timestamp: Date.now(),
    });

    return project;
  });
}

// eslint-disable-next-line @typescript-eslint/require-await
export async function loadProject(
  context: ProjectOperationsContext,
  id: string
): Promise<StorageResult<Project>> {
  return withErrorHandling(() => {
    context.ensureConnected();

    const projects = getProjects(context.STORAGE_PREFIX, context.PROJECTS_KEY);
    const project = projects.find((p: Project) => p.id === id);

    if (project === undefined) {
      throw new Error(`Project with id ${id} not found`);
    }

    context.emitEvent({
      type: 'load',
      target: 'project',
      targetId: id,
      data: project,
      timestamp: Date.now(),
    });

    return project;
  });
}

// eslint-disable-next-line @typescript-eslint/require-await
export async function deleteProject(
  context: ProjectOperationsContext,
  id: string
): Promise<StorageResult> {
  return withErrorHandling(() => {
    context.ensureConnected();

    const projects = getProjects(context.STORAGE_PREFIX, context.PROJECTS_KEY);
    const filteredProjects = projects.filter((p: Project) => p.id !== id);

    setProjects(context.STORAGE_PREFIX, context.PROJECTS_KEY, filteredProjects);
    context.emitEvent({
      type: 'delete',
      target: 'project',
      targetId: id,
      timestamp: Date.now(),
    });
  });
}

// eslint-disable-next-line @typescript-eslint/require-await
export async function listProjects(
  context: ProjectOperationsContext
): Promise<StorageResult<Project[]>> {
  return withErrorHandling(() => {
    context.ensureConnected();

    const projects = getProjects(context.STORAGE_PREFIX, context.PROJECTS_KEY);
    return projects;
  });
}
