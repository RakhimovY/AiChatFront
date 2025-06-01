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

export default function DocumentEditor({
  templateId,
  documentId,
  initialTemplate,
  initialValues,
  onSave,
}: DocumentEditorProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const { toast } = useToast();
  const [template, setTemplate] = useState<Template | null>(initialTemplate || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showVersions, setShowVersions] = useState(false);
  const [versions, setVersions] = useState<Document[]>([]);
  const [isExporting, setIsExporting] = useState(false);

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

  const fetchTemplate = useCallback(async () => {
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
  }, [templateId]);

  useEffect(() => {
    if (!initialTemplate && templateId) {
      fetchTemplate();
    }
  }, [templateId, initialTemplate, fetchTemplate]);

  const onSubmit = async (data: DocumentValues) => {
    try {
      setLoading(true);
      let document: Document;
      if (documentId) {
        document = await documentService.updateDocument(documentId, {
          templateId: template!.id,
          values: data,
        });
      } else {
        document = await documentService.createDocument(
          template!.id,
          data,
          template!.title
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
  };

  // Fetch document versions
  const fetchVersions = async () => {
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
  };

  // Handle export
  const handleExport = async (format: 'pdf' | 'docx') => {
    if (!template || isExporting) return;

    setIsExporting(true);

    try {
      const values = watch();
      const blob = await documentService.exportDocument(template.id, values, format);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${template.title}.${format}`;
      document.body.appendChild(a);
      a.click();

      // Clean up
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
  };

  // Handle version restore
  const handleVersionRestore = async (versionId: string) => {
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
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!template) {
    return <div>No template selected</div>;
  }

  return (
    <div className="space-y-4 max-w-5xl mx-auto px-2 sm:px-4 md:px-8 py-4">
      <div className="mb-2 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <div>
          <h1 className="text-2xl font-bold leading-tight mb-1">{template.title}</h1>
          <p className="text-muted-foreground text-sm">{"Заполните поля для создания документа"}</p>
        </div>
        <div className="hidden lg:flex space-x-2">
          {documentId && (
            <Button
              variant="outline"
              onClick={() => {
                setShowVersions(!showVersions);
                if (!showVersions) {
                  fetchVersions();
                }
              }}
            >
              <History className="h-4 w-4 mr-2" />
              {t.versions || "Версии"}
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? (
              <>
                <EyeOff className="h-4 w-4 mr-2" />
                {t.hidePreview || "Скрыть предпросмотр"}
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                {t.showPreview || "Показать предпросмотр"}
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => handleExport('pdf')}
            disabled={isExporting}
          >
            <Download className="h-4 w-4 mr-2" />
            PDF
          </Button>
          <Button
            variant="outline"
            onClick={() => handleExport('docx')}
            disabled={isExporting}
          >
            <Download className="h-4 w-4 mr-2" />
            DOCX
          </Button>
        </div>
      </div>

      {showVersions && (
        <div className="border rounded-lg p-4 bg-background/80 backdrop-blur">
          <h2 className="text-lg font-semibold mb-4">{"Версии документа"}</h2>
          <div className="space-y-2">
            {versions.map(version => (
              <div
                key={version.id}
                className="flex justify-between items-center p-2 hover:bg-muted rounded"
              >
                <div>
                  <p className="font-medium">{"Версия"} {version.version}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(version.createdAt).toLocaleString()}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleVersionRestore(version.id)}
                >
                  {"Восстановить"}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <form
          className="space-y-4 bg-background/80 rounded-xl p-4 shadow-md"
          onSubmit={handleSubmit(onSubmit)}
        >
          {template.fields.map((field) => (
            <div key={field.id} className="space-y-1">
              <label className="text-sm font-medium block mb-1">
                {field.label}
                {field.required && <span className="text-red-500">*</span>}
              </label>
              {field.type === "text" && (
                <Input
                  {...register(field.id)}
                  placeholder={field.placeholder}
                  disabled={loading}
                  className={errors[field.id] ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
              )}
              {field.type === "textarea" && (
                <Textarea
                  {...register(field.id)}
                  placeholder={field.placeholder}
                  disabled={loading}
                  className={errors[field.id] ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
              )}
              {field.type === "select" && (
                <Select
                  onValueChange={(value) => setValue(field.id, value)}
                  defaultValue={watch(field.id)}
                  disabled={loading}
                >
                  <SelectTrigger className={errors[field.id] ? "border-red-500 focus-visible:ring-red-500" : ""}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {field.type === "checkbox" && (
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={watch(field.id)}
                    onCheckedChange={(checked) => setValue(field.id, checked)}
                    disabled={loading}
                  />
                  <span>{field.label}</span>
                </div>
              )}
              {field.type === "radio" && (
                <RadioGroup
                  onValueChange={(value) => setValue(field.id, value)}
                  defaultValue={watch(field.id)}
                  disabled={loading}
                  className={errors[field.id] ? "border border-red-500 rounded-md p-2" : ""}
                >
                  {field.options?.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={`${field.id}-${option.value}`} />
                      <label htmlFor={`${field.id}-${option.value}`}>{option.label}</label>
                    </div>
                  ))}
                </RadioGroup>
              )}
              {field.type === "date" && (
                <DatePicker
                  date={watch(field.id) ? new Date(watch(field.id)) : undefined}
                  onSelect={(date) => setValue(field.id, date)}
                  disabled={loading}
                  className={errors[field.id] ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
              )}
              {errors[field.id] && (
                <p className="text-xs text-red-500 mt-1 animate-shake">{errors[field.id]?.message?.toString()}</p>
              )}
            </div>
          ))}
          <div className="block lg:hidden fixed bottom-0 left-0 w-full bg-background/90 border-t z-50 flex gap-2 px-4 py-2 shadow-lg">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              {showPreview ? "Скрыть предпросмотр" : "Показать предпросмотр"}
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={loading}
            >
              {loading ? <span className="animate-spin mr-2 w-4 h-4 border-2 border-t-transparent border-white rounded-full inline-block" /> : <Save className="h-4 w-4 mr-2" />}
              {t.save || "Сохранить"}
            </Button>
          </div>
          <div className="hidden lg:flex gap-2 justify-end pt-2">
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? <span className="animate-spin mr-2 w-4 h-4 border-2 border-t-transparent border-white rounded-full inline-block" /> : <Save className="h-4 w-4 mr-2" />}
              {t.save || "Сохранить"}
            </Button>
          </div>
        </form>

        {showPreview && (
          <div className="border rounded-xl p-4 bg-background/80 shadow-md min-h-[300px] max-h-[80vh] overflow-auto">
            <DocumentPreview
              template={template}
              values={watch()}
            />
          </div>
        )}
      </div>
      {/* Кнопки экспорта для мобильных */}
      <div className="flex lg:hidden gap-2 mt-4">
        <Button
          variant="outline"
          onClick={() => handleExport('pdf')}
          disabled={isExporting}
          className="flex-1"
        >
          <Download className="h-4 w-4 mr-2" /> PDF
        </Button>
        <Button
          variant="outline"
          onClick={() => handleExport('docx')}
          disabled={isExporting}
          className="flex-1"
        >
          <Download className="h-4 w-4 mr-2" /> DOCX
        </Button>
      </div>
    </div>
  );
}