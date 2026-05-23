/**
 * CRDT Manager
 *
 * Manages CRDT operations and conflict resolution for collaborative editing
 */

import * as Y from 'yjs';
import {
  CRDTOperation,
  OperationType,
  VectorClock,
  UserId,
  Conflict,
  ConflictResolution,
  ConflictResolutionStrategy,
  OperationTransformer,
} from '../types';

export class CRDTManager {
  private doc: Y.Doc;
  private operations: Map<string, CRDTOperation> = new Map();
  private vectorClock: VectorClock = {};
  private conflicts: Map<string, Conflict> = new Map();
  private transformers: Map<OperationType, OperationTransformer> = new Map();
  private operationQueue: CRDTOperation[] = [];
  private isProcessing = false;

  constructor(doc: Y.Doc) {
    this.doc = doc;
    this.setupDefaultTransformers();
  }

  /**
   * Create a new CRDT operation
   */
  createOperation(
    type: OperationType,
    path: string[],
    value?: unknown,
    oldValue?: unknown,
    userId: UserId
  ): CRDTOperation {
    const operation: CRDTOperation = {
      id: this.generateOperationId(),
      type,
      path,
      value,
      oldValue,
      timestamp: Date.now(),
      userId,
      sessionId: this.getSessionId(),
      vectorClock: { ...this.vectorClock },
    };

    // Update vector clock
    this.updateVectorClock(userId);

    return operation;
  }

  /**
   * Apply an operation to the CRDT document
   */
  async applyOperation(operation: CRDTOperation): Promise<void> {
    // Queue the operation
    this.operationQueue.push(operation);

    // Process queue if not already processing
    if (!this.isProcessing) {
      await this.processQueue();
    }
  }

  /**
   * Process queued operations
   */
  private async processQueue(): Promise<void> {
    this.isProcessing = true;

    while (this.operationQueue.length > 0) {
      const operation = this.operationQueue.shift()!;

      // Check for conflicts
      const conflicts = this.detectConflicts(operation);

      if (conflicts.length > 0) {
        // Handle conflicts
        await this.handleConflicts(operation, conflicts);
      } else {
        // No conflicts, apply operation
        await this.applyToDocument(operation);
      }

      // Store operation
      this.operations.set(operation.id, operation);
    }

    this.isProcessing = false;
  }

  /**
   * Detect conflicts between operations
   */
  private detectConflicts(operation: CRDTOperation): Conflict[] {
    const conflicts: Conflict[] = [];

    for (const [id, existingOp] of this.operations) {
      if (this.hasConflict(operation, existingOp)) {
        conflicts.push({
          id: this.generateConflictId(),
          operation1: operation,
          operation2: existingOp,
          path: this.getConflictPath(operation, existingOp),
          timestamp: Date.now(),
        });
      }
    }

    return conflicts;
  }

  /**
   * Check if two operations conflict
   */
  private hasConflict(op1: CRDTOperation, op2: CRDTOperation): boolean {
    // Operations from the same user don't conflict
    if (op1.userId === op2.userId) {
      return false;
    }

    // Check if operations affect the same path
    const path1 = op1.path.join('.');
    const path2 = op2.path.join('.');

    // Direct path conflict
    if (path1 === path2) {
      return true;
    }

    // Parent-child relationship
    if (path1.startsWith(path2) || path2.startsWith(path1)) {
      // Only conflict if both are modifying operations
      if (this.isModifyingOperation(op1.type) && this.isModifyingOperation(op2.type)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Get the path where conflict occurred
   */
  private getConflictPath(op1: CRDTOperation, op2: CRDTOperation): string[] {
    const path1 = op1.path;
    const path2 = op2.path;

    // Find common prefix
    const common: string[] = [];
    for (let i = 0; i < Math.min(path1.length, path2.length); i++) {
      if (path1[i] === path2[i]) {
        common.push(path1[i]);
      } else {
        break;
      }
    }

    return common;
  }

  /**
   * Handle detected conflicts
   */
  private async handleConflicts(operation: CRDTOperation, conflicts: Conflict[]): Promise<void> {
    for (const conflict of conflicts) {
      // Store conflict
      this.conflicts.set(conflict.id, conflict);

      // Get transformer for operation type
      const transformer = this.transformers.get(operation.type);

      if (transformer) {
        // Transform operation to resolve conflict
        const transformed = transformer.transform(operation, conflict.operation2);

        // Apply transformed operations
        for (const op of transformed) {
          await this.applyToDocument(op);
        }
      } else {
        // Default conflict resolution: last-write-wins
        await this.applyToDocument(operation);
      }
    }
  }

  /**
   * Apply operation to Yjs document
   */
  private async applyToDocument(operation: CRDTOperation): Promise<void> {
    const { type, path, value } = operation;

    // Navigate to the target in the document
    let current: any = this.doc.getMap('root');

    for (let i = 0; i < path.length - 1; i++) {
      const segment = path[i];
      if (!current.has(segment)) {
        current.set(segment, new Y.Map());
      }
      current = current.get(segment);
    }

    const lastSegment = path[path.length - 1];

    // Apply operation based on type
    switch (type) {
      case 'insert':
        if (current instanceof Y.Array) {
          current.push([value]);
        } else {
          current.set(lastSegment, value);
        }
        break;

      case 'delete':
        current.delete(lastSegment);
        break;

      case 'update':
        current.set(lastSegment, value);
        break;

      case 'move':
        // Move operation requires special handling
        await this.handleMoveOperation(operation);
        break;

      case 'style-update':
      case 'prop-update':
        current.set(lastSegment, value);
        break;

      default:
        throw new Error(`Unknown operation type: ${type}`);
    }
  }

  /**
   * Handle move operations
   */
  private async handleMoveOperation(operation: CRDTOperation): Promise<void> {
    const { path, value } = operation;
    const [fromPath, toPath] = value as [string[], string[]];

    // Get source
    let source: any = this.doc.getMap('root');
    for (const segment of fromPath.slice(0, -1)) {
      source = source.get(segment);
    }
    const sourceKey = fromPath[fromPath.length - 1];
    const item = source.get(sourceKey);

    // Remove from source
    source.delete(sourceKey);

    // Add to destination
    let dest: any = this.doc.getMap('root');
    for (const segment of toPath.slice(0, -1)) {
      if (!dest.has(segment)) {
        dest.set(segment, new Y.Map());
      }
      dest = dest.get(segment);
    }
    const destKey = toPath[toPath.length - 1];
    dest.set(destKey, item);
  }

  /**
   * Resolve a conflict
   */
  async resolveConflict(conflictId: string, resolution: ConflictResolution): Promise<void> {
    const conflict = this.conflicts.get(conflictId);
    if (!conflict) {
      throw new Error(`Conflict not found: ${conflictId}`);
    }

    // Apply resolution
    switch (resolution.strategy) {
      case 'last-write-wins':
        // Keep the later operation
        if (conflict.operation1.timestamp > conflict.operation2.timestamp) {
          await this.applyToDocument(conflict.operation1);
        } else {
          await this.applyToDocument(conflict.operation2);
        }
        break;

      case 'first-write-wins':
        // Keep the earlier operation
        if (conflict.operation1.timestamp < conflict.operation2.timestamp) {
          await this.applyToDocument(conflict.operation1);
        } else {
          await this.applyToDocument(conflict.operation2);
        }
        break;

      case 'merge':
        // Merge both operations
        await this.mergeOperations(conflict.operation1, conflict.operation2);
        break;

      case 'custom':
        // Use custom resolver
        if (resolution.customResolver) {
          // This would be implemented by the application
          console.warn('Custom resolver not implemented:', resolution.customResolver);
        }
        break;
    }

    // Remove conflict
    this.conflicts.delete(conflictId);
  }

  /**
   * Merge two conflicting operations
   */
  private async mergeOperations(op1: CRDTOperation, op2: CRDTOperation): Promise<void> {
    // Simple merge strategy: apply both operations in order
    await this.applyToDocument(op1);
    await this.applyToDocument(op2);
  }

  /**
   * Update vector clock for a user
   */
  private updateVectorClock(userId: UserId): void {
    const currentCount = this.vectorClock[userId] || 0;
    this.vectorClock[userId] = currentCount + 1;
  }

  /**
   * Check if operation is a modifying operation
   */
  private isModifyingOperation(type: OperationType): boolean {
    return ['update', 'style-update', 'prop-update'].includes(type);
  }

  /**
   * Generate unique operation ID
   */
  private generateOperationId(): string {
    return `op_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate unique conflict ID
   */
  private generateConflictId(): string {
    return `conflict_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get current session ID
   */
  private getSessionId(): string {
    return this.doc.clientID.toString();
  }

  /**
   * Setup default operation transformers
   */
  private setupDefaultTransformers(): void {
    // Add default transformers for common operation types
    this.transformers.set('update', {
      transform: (op1, op2) => {
        // Default transformation: keep the later operation
        return op1.timestamp > op2.timestamp ? [op1] : [op2];
      },
    });

    this.transformers.set('style-update', {
      transform: (op1, op2) => {
        // Merge style updates
        const mergedValue = {
          ...(op1.oldValue as Record<string, unknown>),
          ...(op1.value as Record<string, unknown>),
          ...(op2.value as Record<string, unknown>),
        };

        return [
          {
            ...op1,
            value: mergedValue,
          },
        ];
      },
    });
  }

  /**
   * Register custom operation transformer
   */
  registerTransformer(type: OperationType, transformer: OperationTransformer): void {
    this.transformers.set(type, transformer);
  }

  /**
   * Get current vector clock
   */
  getVectorClock(): VectorClock {
    return { ...this.vectorClock };
  }

  /**
   * Get all conflicts
   */
  getConflicts(): Conflict[] {
    return Array.from(this.conflicts.values());
  }

  /**
   * Get operation by ID
   */
  getOperation(id: string): CRDTOperation | undefined {
    return this.operations.get(id);
  }

  /**
   * Clear all operations and conflicts
   */
  clear(): void {
    this.operations.clear();
    this.conflicts.clear();
    this.vectorClock = {};
    this.operationQueue = [];
  }
}
