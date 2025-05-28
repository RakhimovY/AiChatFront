/**
 * Template processing utilities
 * 
 * This file contains utilities for processing templates:
 * - Replacing placeholders with values
 * - Validating template fields
 * - Exporting templates to different formats
 */

import { Template, TemplateField } from '../data/templates';
import { z } from 'zod';

/**
 * Processes a template by replacing placeholders with values
 * 
 * @param template The template to process
 * @param values The values to replace placeholders with
 * @returns The processed template content
 */
export function processTemplate(template: Template, values: Record<string, any>): string {
  let processedContent = template.content;

  // Replace all placeholders with values
  // Placeholders are in the format {{field_id}}
  const placeholderRegex = /\{\{([^}]+)\}\}/g;

  processedContent = processedContent.replace(placeholderRegex, (match, fieldId) => {
    // Check if the field ID contains a conditional expression
    if (fieldId.includes('===') || fieldId.includes('?')) {
      // This is a conditional expression, evaluate it
      try {
        // Create a function that takes values as parameters and evaluates the expression
        const evalFunction = new Function(
          ...Object.keys(values),
          `return ${fieldId}`
        );

        // Call the function with the values
        return evalFunction(...Object.values(values)) || '';
      } catch (error) {
        console.error(`Error evaluating expression: ${fieldId}`, error);
        return match; // Return the original placeholder if there's an error
      }
    } else {
      // Simple field replacement
      return values[fieldId] !== undefined ? values[fieldId] : match;
    }
  });

  return processedContent;
}

/**
 * Creates a validation schema for a template
 * 
 * @param template The template to create a validation schema for
 * @returns A Zod schema for validating template values
 */
export function createValidationSchema(template: Template) {
  const schemaFields: Record<string, any> = {};

  template.fields.forEach((field) => {
    let fieldSchema;

    switch (field.type) {
      case 'text':
        fieldSchema = z.string();
        break;
      case 'textarea':
        fieldSchema = z.string();
        break;
      case 'date':
        fieldSchema = z.string().refine((val) => !isNaN(Date.parse(val)), {
          message: 'Invalid date format',
        });
        break;
      case 'number':
        fieldSchema = z.string().refine((val) => !isNaN(Number(val)), {
          message: 'Must be a number',
        });
        break;
      case 'select':
        if (field.options) {
          fieldSchema = z.enum(field.options as [string, ...string[]]);
        } else {
          fieldSchema = z.string();
        }
        break;
      default:
        fieldSchema = z.string();
    }

    // Add required validation
    if (field.required) {
      if (field.type === 'text' || field.type === 'textarea' || field.type === 'date' || field.type === 'number') {
        // For string-based fields, use min(1)
        fieldSchema = z.string().min(1, { message: 'This field is required' });
      } else if (field.type === 'select' && field.options) {
        // For select fields with options, keep using enum but make it required
        fieldSchema = z.enum(field.options as [string, ...string[]]);
      } else {
        // For any other type, use nonempty string as fallback
        fieldSchema = z.string().min(1, { message: 'This field is required' });
      }
    } else {
      fieldSchema = fieldSchema.optional();
    }

    schemaFields[field.id] = fieldSchema;
  });

  return z.object(schemaFields);
}

/**
 * Validates template values against the template's fields
 * 
 * @param template The template to validate against
 * @param values The values to validate
 * @returns An object with validation results
 */
export function validateTemplateValues(template: Template, values: Record<string, any>) {
  const schema = createValidationSchema(template);

  try {
    schema.parse(values);
    return { success: true, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};

      error.errors.forEach((err) => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });

      return { success: false, errors };
    }

    return { success: false, errors: { _form: 'Validation failed' } };
  }
}

/**
 * Formats a template for export to different formats
 * 
 * @param content The processed template content
 * @param format The format to export to ('pdf', 'docx', 'txt')
 * @returns The formatted content
 */
export function formatForExport(content: string, format: 'pdf' | 'docx' | 'txt'): string {
  // For now, just return the content as is
  // In a real implementation, this would convert the content to the specified format
  return content;
}

/**
 * Exports a template to a specific format
 * 
 * @param template The template to export
 * @param values The values to replace placeholders with
 * @param format The format to export to ('pdf', 'docx', 'txt')
 * @returns A Promise that resolves to the exported content
 */
export async function exportTemplate(
  template: Template,
  values: Record<string, any>,
  format: 'pdf' | 'docx' | 'txt'
): Promise<Blob> {
  // Process the template
  const processedContent = processTemplate(template, values);

  // Format for export
  const formattedContent = formatForExport(processedContent, format);

  // In a real implementation, this would convert the content to the specified format
  // and return a Blob
  // For now, just return a text blob
  return new Blob([formattedContent], { type: 'text/plain' });
}

/**
 * Gets a preview of a template with the given values
 * 
 * @param template The template to preview
 * @param values The values to replace placeholders with
 * @returns The preview content
 */
export function getTemplatePreview(template: Template, values: Record<string, any>): string {
  return processTemplate(template, values);
}
