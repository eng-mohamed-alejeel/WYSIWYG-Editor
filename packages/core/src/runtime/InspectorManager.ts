/**
 * Inspector Manager Implementation
 *
 * Manages component inspection and property editing
 */

import { EventBus } from './EventBus';
import { ComponentNode } from '../types/components';

export interface InspectorSection {
  id: string;
  title: string;
  order: number;
  fields: InspectorField[];
}

export interface InspectorField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'color' | 'select' | 'toggle' | 'slider' | 'image' | 'link' | 'code';
  value?: unknown;
  defaultValue?: unknown;
  options?: Array<{ label: string; value: unknown }>;
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
  validation?: (value: unknown) => boolean;
  onChange?: (value: unknown) => void;
  visible?: boolean;
  disabled?: boolean;
  group?: string;
}

export interface InspectorConfig {
  sections: InspectorSection[];
  targetComponentId: string | null;
}

export class InspectorManager {
  private config: InspectorConfig;
  private eventBus: EventBus;
  private componentDefinitions = new Map<string, InspectorSection[]>();

  constructor(eventBus?: EventBus) {
    this.eventBus = eventBus ?? new EventBus();
    this.config = {
      sections: [],
      targetComponentId: null,
    };

    // Listen for component selection changes
    this.eventBus.on('component:selected', this.handleComponentSelection.bind(this));
    // Listen for component updates
    this.eventBus.on('component:updated', this.handleComponentUpdate.bind(this));
  }

  registerComponentInspector(componentId: string, sections: InspectorSection[]): void {
    this.componentDefinitions.set(componentId, sections);
    this.eventBus.emit('inspector:component:registered', { componentId, sections });
  }

  unregisterComponentInspector(componentId: string): void {
    this.componentDefinitions.delete(componentId);
    this.eventBus.emit('inspector:component:unregistered', { componentId });
  }

  inspect(component: ComponentNode): void {
    const sections = this.componentDefinitions.get(component.id);

    if (sections) {
      this.config = {
        sections: this.populateFieldValues(sections, component),
        targetComponentId: component.id,
      };

      this.eventBus.emit('inspector:target:changed', {
        componentId: component.id,
        sections: this.config.sections,
      });
    }
  }

  clear(): void {
    this.config = {
      sections: [],
      targetComponentId: null,
    };

    this.eventBus.emit('inspector:cleared', {});
  }

  updateField(fieldId: string, value: unknown): void {
    for (const section of this.config.sections) {
      const field = section.fields.find((f) => f.id === fieldId);
      if (field) {
        const previousValue = field.value;
        field.value = value;

        this.eventBus.emit('inspector:field:updated', {
          fieldId,
          value,
          previousValue,
          componentId: this.config.targetComponentId,
        });

        // Call onChange if defined
        if (field.onChange) {
          field.onChange(value);
        }

        return;
      }
    }
  }

  getField(fieldId: string): InspectorField | undefined {
    for (const section of this.config.sections) {
      const field = section.fields.find((f) => f.id === fieldId);
      if (field) {
        return field;
      }
    }
    return undefined;
  }

  getConfig(): InspectorConfig {
    return {
      sections: this.config.sections.map((section) => ({
        ...section,
        fields: section.fields.map((field) => ({ ...field })),
      })),
      targetComponentId: this.config.targetComponentId,
    };
  }

  private populateFieldValues(
    sections: InspectorSection[],
    component: ComponentNode
  ): InspectorSection[] {
    return sections.map((section) => ({
      ...section,
      fields: section.fields.map((field) => ({
        ...field,
        value: field.value ?? component.props?.[field.id] ?? field.defaultValue,
      })),
    }));
  }

  private handleComponentSelection(data: { componentId: string }): void {
    this.eventBus.emit('inspector:request:inspect', { componentId: data.componentId });
  }

  private handleComponentUpdate(data: {
    componentId: string;
    updates: Partial<ComponentNode>;
  }): void {
    if (data.componentId === this.config.targetComponentId) {
      this.eventBus.emit('inspector:request:refresh', { componentId: data.componentId });
    }
  }
}
