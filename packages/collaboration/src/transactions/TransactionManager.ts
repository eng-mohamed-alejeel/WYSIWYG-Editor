/**
 * Transaction Manager
 *
 * Manages operational transactions for batch operations and atomic updates
 */

import { CRDTManager } from '../crdt/CRDTManager';
import { Transaction, CRDTOperation, OperationType, UserId } from '../types';

export class TransactionManager {
  private crdtManager: CRDTManager;
  private activeTransactions: Map<string, Transaction> = new Map();
  private transactionHistory: Transaction[] = [];
  private maxHistorySize = 100;

  constructor(crdtManager: CRDTManager) {
    this.crdtManager = crdtManager;
  }

  /**
   * Start a new transaction
   */
  start(description: string, userId: UserId): Transaction {
    const transaction: Transaction = {
      id: this.generateTransactionId(),
      operations: [],
      startTime: Date.now(),
      userId,
      status: 'pending',
    };

    this.activeTransactions.set(transaction.id, transaction);
    return transaction;
  }

  /**
   * Add an operation to an active transaction
   */
  addOperation(transactionId: string, operation: CRDTOperation): void {
    const transaction = this.activeTransactions.get(transactionId);
    if (!transaction) {
      throw new Error(`Transaction not found: ${transactionId}`);
    }

    if (transaction.status !== 'pending') {
      throw new Error(`Transaction is not pending: ${transactionId}`);
    }

    transaction.operations.push(operation);
  }

  /**
   * Commit a transaction
   */
  async commit(transactionId: string): Promise<void> {
    const transaction = this.activeTransactions.get(transactionId);
    if (!transaction) {
      throw new Error(`Transaction not found: ${transactionId}`);
    }

    if (transaction.status !== 'pending') {
      throw new Error(`Transaction is not pending: ${transactionId}`);
    }

    // Mark as committed
    transaction.status = 'committed';
    transaction.endTime = Date.now();

    // Apply all operations in the transaction
    for (const operation of transaction.operations) {
      await this.crdtManager.applyOperation(operation);
    }

    // Move to history
    this.addToHistory(transaction);

    // Remove from active transactions
    this.activeTransactions.delete(transactionId);
  }

  /**
   * Rollback a transaction
   */
  async rollback(transactionId: string): Promise<void> {
    const transaction = this.activeTransactions.get(transactionId);
    if (!transaction) {
      throw new Error(`Transaction not found: ${transactionId}`);
    }

    if (transaction.status !== 'pending') {
      throw new Error(`Transaction is not pending: ${transactionId}`);
    }

    // Mark as rolled back
    transaction.status = 'rolled-back';
    transaction.endTime = Date.now();

    // Apply inverse operations in reverse order
    const reversedOperations = [...transaction.operations].reverse();
    for (const operation of reversedOperations) {
      if (operation.oldValue !== undefined) {
        const inverseOperation = this.createInverseOperation(operation);
        await this.crdtManager.applyOperation(inverseOperation);
      }
    }

    // Move to history
    this.addToHistory(transaction);

    // Remove from active transactions
    this.activeTransactions.delete(transactionId);
  }

  /**
   * Create an inverse operation for rollback
   */
  private createInverseOperation(operation: CRDTOperation): CRDTOperation {
    const inverseType = this.getInverseOperationType(operation.type);

    return {
      ...operation,
      type: inverseType,
      value: operation.oldValue,
      oldValue: operation.value,
      timestamp: Date.now(),
    };
  }

  /**
   * Get the inverse operation type
   */
  private getInverseOperationType(type: OperationType): OperationType {
    const inverseMap: Record<OperationType, OperationType> = {
      insert: 'delete',
      delete: 'insert',
      update: 'update',
      move: 'move',
      batch: 'batch',
      'style-update': 'style-update',
      'prop-update': 'prop-update',
    };

    return inverseMap[type];
  }

  /**
   * Add transaction to history
   */
  private addToHistory(transaction: Transaction): void {
    this.transactionHistory.push(transaction);

    // Maintain max history size
    if (this.transactionHistory.length > this.maxHistorySize) {
      this.transactionHistory.shift();
    }
  }

  /**
   * Get active transaction by ID
   */
  getTransaction(transactionId: string): Transaction | undefined {
    return this.activeTransactions.get(transactionId);
  }

  /**
   * Get all active transactions
   */
  getActiveTransactions(): Transaction[] {
    return Array.from(this.activeTransactions.values());
  }

  /**
   * Get transaction history
   */
  getTransactionHistory(): Transaction[] {
    return [...this.transactionHistory];
  }

  /**
   * Check if a transaction is active
   */
  isTransactionActive(transactionId: string): boolean {
    return this.activeTransactions.has(transactionId);
  }

  /**
   * Generate unique transaction ID
   */
  private generateTransactionId(): string {
    return `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Clear all transactions
   */
  clear(): void {
    this.activeTransactions.clear();
    this.transactionHistory = [];
  }
}
