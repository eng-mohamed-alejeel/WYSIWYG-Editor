/**
 * Service Container Implementation
 *
 * Provides dependency injection and service management
 */

import { ServiceIdentifier, ServiceDescriptor, ServiceContainerInterface } from './types';

export class ServiceContainer implements ServiceContainerInterface {
  private services = new Map<ServiceIdentifier<unknown>, unknown>();
  private descriptors = new Map<ServiceIdentifier<unknown>, ServiceDescriptor>();
  private instances = new Map<ServiceIdentifier<unknown>, unknown>();

  register<T>(descriptor: ServiceDescriptor<T>): void {
    this.descriptors.set(descriptor.id, descriptor);

    if (descriptor.lazy === false) {
      this.resolve(descriptor.id);
    }
  }

  get<T>(id: ServiceIdentifier<T>): T {
    return this.resolve(id);
  }

  has<T>(id: ServiceIdentifier<T>): boolean {
    return this.descriptors.has(id);
  }

  dispose(): void {
    // Dispose all singleton instances
    this.instances.forEach((instance) => {
      if (typeof instance === 'object' && instance !== null && 'dispose' in instance) {
        (instance as { dispose: () => void }).dispose();
      }
    });

    this.instances.clear();
    this.services.clear();
    this.descriptors.clear();
  }

  private resolve<T>(id: ServiceIdentifier<T>): T {
    // Check cache for singleton instances
    if (this.instances.has(id)) {
      return this.instances.get(id) as T;
    }

    const descriptor = this.descriptors.get(id);
    if (!descriptor) {
      throw new Error(`Service with id ${String(id)} is not registered`);
    }

    // Resolve dependencies
    const dependencies = descriptor.dependencies?.map((dep) => this.resolve(dep)) ?? [];

    // Create instance
    const instance = descriptor.factory(...dependencies);

    // Cache if singleton
    if (descriptor.singleton === true) {
      this.instances.set(id, instance);
    }

    this.services.set(id, instance);
    return instance as T;
  }
}
