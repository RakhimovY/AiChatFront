"use client";

import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DatePicker } from "@/components/ui/date-picker";
import { useToast } from "@/components/ui/use-toast-hook";
import { useRouter } from "next/navigation";
import { documentService } from "@/lib/services/documentService";
import type { Template, Document, DocumentValues } from "@/types/document";
import DocumentPreview from "./DocumentPreview";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { Save, AlertCircle, History, Download, Eye, EyeOff } from "lucide-react";

interface DocumentEditorProps {
  templateId?: string;
  documentId?: string;
  initialTemplate?: Template;
  initialValues?: DocumentValues;
  onSave?: (document: Document) => void;
}

const FieldRenderer = React.memo(({ 
  field, 
  register, 
  setValue, 
  error, 
  disabled 
}: { 
  field: any;
  register: any;
  setValue: any;
  error?: string;
  disabled: boolean;
}) => {
  switch (field.type) {
    case "text":
      return (
        <Input
          {...register(field.id)}
          placeholder={field.placeholder}
          disabled={disabled}
          aria-label={field.label}
          aria-invalid={!!error}
          aria-describedby={error ? `${field.id}-error` : undefined}
        />
      );
    case "textarea":
      return (
        <Textarea
          {...register(field.id)}
          placeholder={field.placeholder}
          disabled={disabled}
          aria-label={field.label}
          aria-invalid={!!error}
          aria-describedby={error ? `${field.id}-error` : undefined}
        />
      );
    case "select":
      return (
        <Select
          onValueChange={(value) => setValue(field.id, value)}
          disabled={disabled}
          aria-label={field.label}
        >
          <SelectTrigger>
            <SelectValue placeholder={field.placeholder} />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map((option: any) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    case "checkbox":
      return (
        <Checkbox
          {...register(field.id)}
          disabled={disabled}
          aria-label={field.label}
          aria-invalid={!!error}
          aria-describedby={error ? `${field.id}-error` : undefined}
        />
      );
    case "radio":
      return (
        <RadioGroup
          onValueChange={(value) => setValue(field.id, value)}
          disabled={disabled}
          aria-label={field.label}
        >
          {field.options?.map((option: any) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={`${field.id}-${option.value}`} />
              <label htmlFor={`${field.id}-${option.value}`}>{option.label}</label>
            </div>
          ))}
        </RadioGroup>
      );
    case "date":
      return (
        <DatePicker
          onSelect={(date) => setValue(field.id, date?.toISOString().split('T')[0])}
          disabled={disabled}
          aria-label={field.label}
        />
      );
    default:
      return null;
  }
});

FieldRenderer.displayName = "FieldRenderer";

const DocumentEditor = ({
  templateId,
  documentId,
  initialTemplate,
  initialValues,
  onSave,
}: DocumentEditorProps) => {
  const { t } = useLanguage();
  const router = useRouter();
  const { toast } = useToast();
  const [template, setTemplate] = React.useState<Template | null>(initialTemplate || null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [showPreview, setShowPreview] = React.useState(false);
  const [showVersions, setShowVersions] = React.useState(false);
  const [versions, setVersions] = React.useState<Document[]>([]);
  const [isExporting, setIsExporting] = React.useState(false);

  const validationSchema = React.useMemo(() => {
    if (!template) return z.object({});

    const schema: Record<string, z.ZodTypeAny> = {};
    template.fields.forEach((field) => {
      switch (field.type) {
        case "text":
        case "textarea":
          schema[field.id] = field.required
            ? z.string().min(1, { message: `${field.label} is required` })
            : z.string().optional();
          break;
        case "select":
          schema[field.id] = field.required
            ? z.string().min(1, { message: `${field.label} is required` })
            : z.string().optional();
          break;
        case "checkbox":
          schema[field.id] = field.required
            ? z.boolean().refine((val) => val === true, {
              message: `${field.label} is required`,
            })
            : z.boolean().optional();
          break;
        case "radio":
          schema[field.id] = field.required
            ? z.string().min(1, { message: `${field.label} is required` })
            : z.string().optional();
          break;
        case "date":
          schema[field.id] = field.required
            ? z.string()
              .min(1, { message: `${field.label} is required` })
              .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Date must be in YYYY-MM-DD format" })
            : z.string()
              .optional()
              .transform((val) => val || undefined)
              .refine((val): val is string | undefined => !val || /^\d{4}-\d{2}-\d{2}$/.test(val), {
                message: "Date must be in YYYY-MM-DD format",
                path: [field.id],
              });
          break;
        default:
          schema[field.id] = z.string().optional();
      }
    });
    return z.object(schema);
  }, [template]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<DocumentValues>({
    resolver: zodResolver(validationSchema),
    defaultValues: initialValues || {},
  });

  const fetchTemplate = React.useCallback(async () => {
    if (!templateId) return;
    try {
      setLoading(true);
      const fetchedTemplate = await documentService.getTemplate(templateId);
      setTemplate(fetchedTemplate);
    } catch (err) {
      setError("Failed to load template");
      toast({
        title: "Error",
        description: "Failed to load template",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [templateId, toast]);

  React.useEffect(() => {
    if (!initialTemplate && templateId) {
      fetchTemplate();
    }
  }, [templateId, initialTemplate, fetchTemplate]);

  const onSubmit = React.useCallback(async (data: DocumentValues) => {
    if (!template) return;

    try {
      setLoading(true);
      let document: Document;
      if (documentId) {
        document = await documentService.updateDocument(documentId, {
          templateId: template.id,
          values: data,
        });
      } else {
        document = await documentService.createDocument(
          template.id,
          data,
          template.title
        );
      }
      onSave?.(document);
      toast({
        title: "Success",
        description: "Document saved successfully",
      });
      router.push(`/documents/${document.id}`);
    } catch (err) {
      setError("Failed to save document");
      toast({
        title: "Error",
        description: "Failed to save document",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [template, documentId, onSave, toast, router]);

  const fetchVersions = React.useCallback(async () => {
    if (!documentId) return;

    try {
      const data = await documentService.getDocumentVersions(documentId);
      setVersions(data);
    } catch (err) {
      console.error("Error fetching versions:", err);
      toast({
        title: "Error",
        description: "Failed to load document versions",
        variant: "destructive"
      });
    }
  }, [documentId, toast]);

  const handleExport = React.useCallback(async (format: 'pdf' | 'docx') => {
    if (!template || isExporting) return;

    setIsExporting(true);

    try {
      const values = watch();
      const blob = await documentService.exportDocument(template.id, values, format);

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${template.title}.${format}`;
      document.body.appendChild(a);
      a.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Success",
        description: "Document exported successfully"
      });
    } catch (err) {
      console.error("Error exporting document:", err);
      toast({
        title: "Error",
        description: "Failed to export document",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  }, [template, isExporting, watch, toast]);

  const handleVersionRestore = React.useCallback(async (versionId: string) => {
    if (!documentId) return;

    try {
      const document = await documentService.restoreDocumentVersion(documentId, versionId);
      setValue('templateId', document.templateId);
      setValue('values', document.values);
      setShowVersions(false);
      toast({
        title: "Success",
        description: "Version restored successfully"
      });
    } catch (err) {
      console.error("Error restoring version:", err);
      toast({
        title: "Error",
        description: "Failed to restore version",
        variant: "destructive"
      });
    }
  }, [documentId, setValue, toast]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64" role="status" aria-label="Loading document editor">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6 border rounded-lg bg-destructive/10 text-destructive" role="alert">
        <p>{error}</p>
        <button
          onClick={fetchTemplate}
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          aria-label="Try again"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!template) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{template.title}</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
            aria-label={showPreview ? "Hide preview" : "Show preview"}
          >
            {showPreview ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {showPreview ? "Hide Preview" : "Show Preview"}
          </Button>
          <Button
            variant="outline"
            onClick={() => handleExport('pdf')}
            disabled={isExporting}
            aria-label="Export as PDF"
          >
            <Download className="h-4 w-4 mr-2" />
            PDF
          </Button>
          <Button
            variant="outline"
            onClick={() => handleExport('docx')}
            disabled={isExporting}
            aria-label="Export as DOCX"
          >
            <Download className="h-4 w-4 mr-2" />
            DOCX
          </Button>
          {documentId && (
            <Button
              variant="outline"
              onClick={() => {
                setShowVersions(!showVersions);
                if (!showVersions) {
                  fetchVersions();
                }
              }}
              aria-label="Show document versions"
            >
              <History className="h-4 w-4 mr-2" />
              Versions
            </Button>
          )}
        </div>
      </div>

      {showPreview ? (
        <DocumentPreview template={template} values={watch()} />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {template.fields.map((field) => (
            <div key={field.id} className="space-y-2">
              <label className="text-sm font-medium">
                {field.label}
                {field.required && <span className="text-destructive ml-1">*</span>}
              </label>
              <FieldRenderer
                field={field}
                register={register}
                setValue={setValue}
                error={errors[field.id]?.message}
                disabled={loading}
              />
              {errors[field.id] && (
                <p className="text-sm text-destructive" id={`${field.id}-error`}>
                  {errors[field.id]?.message}
                </p>
              )}
            </div>
          ))}

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={loading}
              aria-label="Save document"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Saving..." : "Save Document"}
            </Button>
          </div>
        </form>
      )}

      {showVersions && (
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4">Document Versions</h3>
          <div className="space-y-2">
            {versions.map((version) => (
              <div
                key={version.id}
                className="flex items-center justify-between p-2 hover:bg-muted rounded-md"
              >
                <div>
                  <p className="font-medium">{new Date(version.createdAt).toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Version {version.version}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleVersionRestore(version.id)}
                  aria-label={`Restore version ${version.version}`}
                >
                  Restore
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentEditor;