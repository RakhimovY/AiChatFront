"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { Save, AlertCircle } from "lucide-react";
import DocumentPreview from "./DocumentPreview";

// Field type definitions
interface FieldBase {
  id: string;
  name: string;
  label: string;
  required: boolean;
  description?: string;
}

interface TextField extends FieldBase {
  type: "text" | "email" | "number" | "tel";
  placeholder?: string;
  defaultValue?: string;
  maxLength?: number;
}

interface TextareaField extends FieldBase {
  type: "textarea";
  placeholder?: string;
  defaultValue?: string;
  rows?: number;
}

interface SelectField extends FieldBase {
  type: "select";
  options: { value: string; label: string }[];
  defaultValue?: string;
}

interface DateField extends FieldBase {
  type: "date";
  defaultValue?: string;
}

interface CheckboxField extends FieldBase {
  type: "checkbox";
  defaultValue?: boolean;
}

interface RadioField extends FieldBase {
  type: "radio";
  options: { value: string; label: string }[];
  defaultValue?: string;
}

type Field = TextField | TextareaField | SelectField | DateField | CheckboxField | RadioField;

// Template type definition
interface Template {
  id: string;
  title: string;
  description: string;
  fields: Field[];
  content: string; // Template content with placeholders
}

interface DocumentEditorProps {
  templateId?: string;
  initialTemplate?: Template;
  initialValues?: Record<string, any>;
  onSave?: (values: Record<string, any>) => void;
}

export default function DocumentEditor({
  templateId,
  initialTemplate,
  initialValues = {},
  onSave
}: DocumentEditorProps) {
  const { t } = useLanguage();
  const [template, setTemplate] = useState<Template | null>(initialTemplate || null);
  const [values, setValues] = useState<Record<string, any>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(!initialTemplate && !!templateId);
  const [error, setError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Fetch template if not provided
  useEffect(() => {
    if (!initialTemplate && templateId) {
      fetchTemplate(templateId);
    }
  }, [initialTemplate, templateId]);

  // Fetch template from API
  const fetchTemplate = async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/web/templates/${id}`);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      setTemplate(data);
      
      // Initialize values with default values from template
      const defaultValues: Record<string, any> = {};
      data.fields.forEach((field: Field) => {
        if ('defaultValue' in field && field.defaultValue !== undefined) {
          defaultValues[field.id] = field.defaultValue;
        }
      });
      
      setValues({ ...defaultValues, ...initialValues });
    } catch (err) {
      setError("Не удалось загрузить шаблон. Пожалуйста, попробуйте позже.");
      console.error("Error fetching template:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle field change
  const handleChange = (fieldId: string, value: any) => {
    setValues(prev => ({ ...prev, [fieldId]: value }));
    setIsDirty(true);
    
    // Clear error for this field if it exists
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    if (!template) return false;
    
    const newErrors: Record<string, string> = {};
    
    template.fields.forEach(field => {
      if (field.required) {
        const value = values[field.id];
        
        if (value === undefined || value === null || value === '') {
          newErrors[field.id] = "Это поле обязательно для заполнения";
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle save
  const handleSave = async () => {
    if (!validateForm()) return;
    
    setIsSaving(true);
    
    try {
      if (onSave) {
        await onSave(values);
      } else {
        // Default save behavior if no onSave provided
        const response = await fetch('/api/web/documents', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            templateId: template?.id,
            values
          }),
        });
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
      }
      
      setIsDirty(false);
    } catch (err) {
      console.error("Error saving document:", err);
      setError("Не удалось сохранить документ. Пожалуйста, попробуйте позже.");
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle preview
  const togglePreview = () => {
    setShowPreview(prev => !prev);
  };

  // Render field based on type
  const renderField = (field: Field) => {
    const hasError = !!errors[field.id];
    
    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
      case 'tel':
        return (
          <div key={field.id} className="space-y-2">
            <label htmlFor={field.id} className="block text-sm font-medium">
              {field.label} {field.required && <span className="text-destructive">*</span>}
            </label>
            {field.description && (
              <p className="text-xs text-muted-foreground">{field.description}</p>
            )}
            <input
              type={field.type}
              id={field.id}
              value={values[field.id] || ''}
              onChange={(e) => handleChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              maxLength={field.maxLength}
              className={`w-full px-3 py-2 border rounded-md ${
                hasError ? 'border-destructive' : 'border-input'
              }`}
            />
            {hasError && (
              <p className="text-xs text-destructive flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                {errors[field.id]}
              </p>
            )}
          </div>
        );
        
      case 'textarea':
        return (
          <div key={field.id} className="space-y-2">
            <label htmlFor={field.id} className="block text-sm font-medium">
              {field.label} {field.required && <span className="text-destructive">*</span>}
            </label>
            {field.description && (
              <p className="text-xs text-muted-foreground">{field.description}</p>
            )}
            <textarea
              id={field.id}
              value={values[field.id] || ''}
              onChange={(e) => handleChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              rows={field.rows || 4}
              className={`w-full px-3 py-2 border rounded-md ${
                hasError ? 'border-destructive' : 'border-input'
              }`}
            />
            {hasError && (
              <p className="text-xs text-destructive flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                {errors[field.id]}
              </p>
            )}
          </div>
        );
        
      case 'select':
        return (
          <div key={field.id} className="space-y-2">
            <label htmlFor={field.id} className="block text-sm font-medium">
              {field.label} {field.required && <span className="text-destructive">*</span>}
            </label>
            {field.description && (
              <p className="text-xs text-muted-foreground">{field.description}</p>
            )}
            <select
              id={field.id}
              value={values[field.id] || ''}
              onChange={(e) => handleChange(field.id, e.target.value)}
              className={`w-full px-3 py-2 border rounded-md ${
                hasError ? 'border-destructive' : 'border-input'
              }`}
            >
              <option value="">Выберите...</option>
              {field.options.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {hasError && (
              <p className="text-xs text-destructive flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                {errors[field.id]}
              </p>
            )}
          </div>
        );
        
      case 'date':
        return (
          <div key={field.id} className="space-y-2">
            <label htmlFor={field.id} className="block text-sm font-medium">
              {field.label} {field.required && <span className="text-destructive">*</span>}
            </label>
            {field.description && (
              <p className="text-xs text-muted-foreground">{field.description}</p>
            )}
            <input
              type="date"
              id={field.id}
              value={values[field.id] || ''}
              onChange={(e) => handleChange(field.id, e.target.value)}
              className={`w-full px-3 py-2 border rounded-md ${
                hasError ? 'border-destructive' : 'border-input'
              }`}
            />
            {hasError && (
              <p className="text-xs text-destructive flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                {errors[field.id]}
              </p>
            )}
          </div>
        );
        
      case 'checkbox':
        return (
          <div key={field.id} className="space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id={field.id}
                checked={!!values[field.id]}
                onChange={(e) => handleChange(field.id, e.target.checked)}
                className={`h-4 w-4 mr-2 ${
                  hasError ? 'border-destructive' : 'border-input'
                }`}
              />
              <label htmlFor={field.id} className="text-sm font-medium">
                {field.label} {field.required && <span className="text-destructive">*</span>}
              </label>
            </div>
            {field.description && (
              <p className="text-xs text-muted-foreground ml-6">{field.description}</p>
            )}
            {hasError && (
              <p className="text-xs text-destructive flex items-center ml-6">
                <AlertCircle className="h-3 w-3 mr-1" />
                {errors[field.id]}
              </p>
            )}
          </div>
        );
        
      case 'radio':
        return (
          <div key={field.id} className="space-y-2">
            <div className="block text-sm font-medium">
              {field.label} {field.required && <span className="text-destructive">*</span>}
            </div>
            {field.description && (
              <p className="text-xs text-muted-foreground">{field.description}</p>
            )}
            <div className="space-y-1">
              {field.options.map(option => (
                <div key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    id={`${field.id}-${option.value}`}
                    name={field.id}
                    value={option.value}
                    checked={values[field.id] === option.value}
                    onChange={() => handleChange(field.id, option.value)}
                    className={`h-4 w-4 mr-2 ${
                      hasError ? 'border-destructive' : 'border-input'
                    }`}
                  />
                  <label htmlFor={`${field.id}-${option.value}`} className="text-sm">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
            {hasError && (
              <p className="text-xs text-destructive flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                {errors[field.id]}
              </p>
            )}
          </div>
        );
        
      default:
        return null;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center p-6 border rounded-lg bg-destructive/10 text-destructive">
        <p>{error}</p>
        {templateId && (
          <button 
            onClick={() => fetchTemplate(templateId)}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Попробовать снова
          </button>
        )}
      </div>
    );
  }

  // No template state
  if (!template) {
    return (
      <div className="text-center p-6 border rounded-lg bg-muted">
        <p className="text-muted-foreground">Шаблон не найден</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-semibold">{template.title}</h2>
        <p className="text-muted-foreground">{template.description}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Form */}
        <div className={`space-y-6 ${showPreview ? 'lg:w-1/2' : 'w-full'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {template.fields.map(renderField)}
          </div>
          
          <div className="flex justify-between items-center pt-4 border-t">
            <button
              type="button"
              onClick={togglePreview}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80"
            >
              {showPreview ? "Скрыть предпросмотр" : "Показать предпросмотр"}
            </button>
            
            <button
              type="button"
              onClick={handleSave}
              disabled={!isDirty || isSaving}
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
        </div>
        
        {/* Preview */}
        {showPreview && (
          <div className="lg:w-1/2 border rounded-md p-4 bg-card">
            <h3 className="text-lg font-medium mb-4">Предпросмотр документа</h3>
            <DocumentPreview template={template} values={values} />
          </div>
        )}
      </div>
    </div>
  );
}