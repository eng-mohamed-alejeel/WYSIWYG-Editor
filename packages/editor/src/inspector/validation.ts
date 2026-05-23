/**
 * Inspector Validation System
 *
 * Comprehensive validation system for inspector fields
 */

import { ValidationRule, ValidationResult, ValidationError, InspectorFormData } from './types';

/**
 * Validate a single field value against validation rules
 */
export const validateField = (
  name: string,
  value: any,
  rules: ValidationRule[],
  formData?: InspectorFormData
): ValidationResult => {
  const errors: ValidationError[] = [];

  for (const rule of rules) {
    const result = validateRule(value, rule, formData);
    if (!result.isValid) {
      errors.push({
        field: name,
        message: result.message ?? rule.message,
        rule,
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate a single value against a validation rule
 */
export const validateRule = (
  value: any,
  rule: ValidationRule,
  formData?: InspectorFormData
): { isValid: boolean; message?: string } => {
  const { type, value: ruleValue, validator } = rule;

  // Use custom validator if provided
  if (validator) {
    try {
      const isValid = validator(value, formData);
      return { isValid: isValid ? true : false, message: rule.message };
    } catch (error) {
      console.error('Custom validator error:', error);
      return { isValid: false, message: rule.message };
    }
  }

  switch (type) {
    case 'required':
      if (value === null || value === undefined || value === '') {
        return { isValid: false, message: rule.message };
      }
      break;

    case 'min':
      if (typeof value === 'number' && value < ruleValue) {
        return { isValid: false, message: rule.message };
      }
      if (typeof value === 'string' && value.length < ruleValue) {
        return { isValid: false, message: rule.message };
      }
      if (Array.isArray(value) && value.length < ruleValue) {
        return { isValid: false, message: rule.message };
      }
      break;

    case 'max':
      if (typeof value === 'number' && value > ruleValue) {
        return { isValid: false, message: rule.message };
      }
      if (typeof value === 'string' && value.length > ruleValue) {
        return { isValid: false, message: rule.message };
      }
      if (Array.isArray(value) && value.length > ruleValue) {
        return { isValid: false, message: rule.message };
      }
      break;

    case 'minLength':
      if (typeof value === 'string' && value.length < ruleValue) {
        return { isValid: false, message: rule.message };
      }
      if (Array.isArray(value) && value.length < ruleValue) {
        return { isValid: false, message: rule.message };
      }
      break;

    case 'maxLength':
      if (typeof value === 'string' && value.length > ruleValue) {
        return { isValid: false, message: rule.message };
      }
      if (Array.isArray(value) && value.length > ruleValue) {
        return { isValid: false, message: rule.message };
      }
      break;

    case 'pattern':
      if (typeof value === 'string') {
        const regex = new RegExp(ruleValue);
        if (!regex.test(value)) {
          return { isValid: false, message: rule.message };
        }
      }
      break;

    default:
      console.warn(`Unknown validation rule type: ${type}`);
  }

  return { isValid: true };
};

/**
 * Validate all fields in a form
 */
export const validateForm = (
  fields: Array<{ name: string; value: any; rules?: ValidationRule[] }>,
  formData?: InspectorFormData
): ValidationResult => {
  const errors: ValidationError[] = [];

  for (const field of fields) {
    if (field.rules) {
      const result = validateField(field.name, field.value, field.rules, formData);
      errors.push(...result.errors);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Check if a field should be visible based on conditional logic
 */
export const checkFieldVisibility = (
  field: { visible?: boolean | any[]; disabled?: boolean | any[] },
  formData: InspectorFormData
): { visible: boolean; disabled: boolean } => {
  const visible = checkCondition(field.visible, formData);
  const disabled = checkCondition(field.disabled, formData);

  return { visible, disabled };
};

/**
 * Check a condition against form data
 */
export const checkCondition = (
  condition: boolean | any[] | undefined,
  formData: InspectorFormData
): boolean => {
  if (typeof condition === 'boolean') {
    return condition;
  }

  if (Array.isArray(condition)) {
    return condition.every((cond) => evaluateCondition(cond, formData));
  }

  return true;
};

/**
 * Evaluate a single condition
 */
export const evaluateCondition = (
  condition: { field: string; operator: string; value: any },
  formData: InspectorFormData
): boolean => {
  const fieldValue = formData[condition.field];

  switch (condition.operator) {
    case 'eq':
      return fieldValue === condition.value;
    case 'neq':
      return fieldValue !== condition.value;
    case 'gt':
      return typeof fieldValue === 'number' && fieldValue > condition.value;
    case 'lt':
      return typeof fieldValue === 'number' && fieldValue < condition.value;
    case 'gte':
      return typeof fieldValue === 'number' && fieldValue >= condition.value;
    case 'lte':
      return typeof fieldValue === 'number' && fieldValue <= condition.value;
    case 'in':
      return Array.isArray(condition.value) && condition.value.includes(fieldValue);
    case 'nin':
      return Array.isArray(condition.value) && !condition.value.includes(fieldValue);
    case 'contains':
      if (typeof fieldValue === 'string') {
        return fieldValue.includes(condition.value);
      }
      if (Array.isArray(fieldValue)) {
        return fieldValue.includes(condition.value);
      }
      return false;
    default:
      console.warn(`Unknown condition operator: ${condition.operator}`);
      return true;
  }
};

/**
 * Get validation error message for a field
 */
export const getFieldErrorMessage = (
  fieldName: string,
  validationResults: ValidationResult
): string | undefined => {
  const error = validationResults.errors.find((e) => e.field === fieldName);
  return error?.message;
};

/**
 * Check if a field has validation errors
 */
export const hasFieldError = (fieldName: string, validationResults: ValidationResult): boolean => {
  return validationResults.errors.some((e) => e.field === fieldName);
};
