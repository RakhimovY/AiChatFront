/**
 * Template processing utilities
 * 
 * This file contains utilities for processing templates:
 * - Replacing placeholders with values
 * - Validating template fields
 * - Exporting templates to different formats
 */

import { Template, DocumentValues, ExportFormat, DocumentExportOptions, Field } from "@/types/document";
import { z } from "zod";

/**
 * Processes a template by replacing placeholders with values
 * 
 * @param template The template to process
 * @param values The values to replace placeholders with
 * @returns The processed template content
 */
export const processTemplate = (template: Template, values: Record<string, any>): string => {
  let content = template.content;
  Object.entries(values).forEach(([key, value]) => {
    content = content.replace(new RegExp(`{{${key}}}`, 'g'), value);
  });
  return content;
};

/**
 * Creates a validation schema for a template
 * 
 * @param template The template to create a validation schema for
 * @returns A Zod schema for validating template values
 */
export const createValidationSchema = (template: Template) => {
  const shape: Record<string, any> = {};
  template.fields.forEach(field => {
    shape[field.name] = z.string();
  });
  return z.object(shape);
};

/**
 * Validates template values against the template's fields
 * 
 * @param template The template to validate against
 * @param values The values to validate
 * @returns An object with validation results
 */
export const validateTemplateValues = (template: Template, values: Record<string, any>) => {
  const schema = createValidationSchema(template);
  try {
    schema.parse(values);
    return { valid: true, errors: {} };
  } catch (error) {
    return { valid: false, errors: error.errors };
  }
};

/**
 * Formats a template for export to different formats
 * 
 * @param content The processed template content
 * @param format The format to export to ('pdf', 'docx', 'txt')
 * @returns The formatted content
 */
export const formatTemplateForExport = (content: string, format: 'pdf' | 'docx' | 'txt'): string => {
  return content;
};

/**
 * Exports a template to a specific format
 * 
 * @param template The template to export
 * @param values The values to replace placeholders with
 * @param format The format to export to ('pdf', 'docx', 'txt')
 * @returns A Promise that resolves to the exported content
 */
export const exportTemplate = async (
  template: Template,
  values: Record<string, any>,
  format: 'pdf' | 'docx' | 'txt'
): Promise<string> => {
  const content = processTemplate(template, values);
  return formatTemplateForExport(content, format);
};

/**
 * Gets a preview of a template with the given values
 * 
 * @param template The template to preview
 * @param values The values to replace placeholders with
 * @returns The preview content
 */
export const getTemplatePreview = (
  template: Template,
  values: Record<string, any>
): string => {
  return processTemplate(template, values);
};

export function getFieldGroups(template: Template): Record<string, Field[]> {
  const groups: Record<string, Field[]> = {};

  template.fields.forEach((field) => {
    const groupId = template.category || "default";
    if (!groups[groupId]) {
      groups[groupId] = [];
    }
    groups[groupId].push(field);
  });

  return groups;
}
