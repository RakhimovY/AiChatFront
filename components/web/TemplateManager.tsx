"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast-hook";
import type { Template, Field, TextField } from "@/types/document";
import { Plus, Save } from "lucide-react";
import FieldEditor from "./FieldEditor";

type TemplateManagerProps = {
  template?: Template;
  onSave?: (template: Template) => void;
};

const TemplateManager = ({ template, onSave }: TemplateManagerProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const [title, setTitle] = React.useState(template?.title || "");
  const [description, setDescription] = React.useState(template?.description || "");
  const [category, setCategory] = React.useState(template?.category || "");
  const [content, setContent] = React.useState(template?.content || "");
  const [fields, setFields] = React.useState<Field[]>(template?.fields || []);

  const handleAddField = React.useCallback(() => {
    const newField: TextField = {
      id: `field_${Date.now()}`,
      name: "",
      label: "",
      type: "text",
      required: false,
    };
    setFields(prev => [...prev, newField]);
  }, []);

  const handleRemoveField = React.useCallback((index: number) => {
    setFields(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleFieldChange = React.useCallback((index: number, field: Partial<Field>) => {
    setFields(prev => {
      const newFields = [...prev];
      const currentField = newFields[index];
      newFields[index] = { ...currentField, ...field };
      return newFields;
    });
  }, []);

  const handleSubmit = React.useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const templateData: Partial<Template> = {
        title,
        description,
        category,
        content,
        fields,
      };

      const url = template?.id 
        ? `/api/web/templates/${template.id}`
        : '/api/web/templates';
      
      const method = template?.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(templateData),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${template?.id ? 'update' : 'create'} template`);
      }

      const savedTemplate = await response.json();
      onSave?.(savedTemplate);
      
      toast({
        title: "Success",
        description: `Template ${template?.id ? 'updated' : 'created'} successfully`,
      });

      router.push("/templates");
    } catch (error) {
      console.error("Error saving template:", error);
      toast({
        title: "Error",
        description: "Failed to save template. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [template?.id, title, description, category, content, fields, onSave, router, toast]);

  const handleTitleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  }, []);

  const handleDescriptionChange = React.useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  }, []);

  const handleCategoryChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCategory(e.target.value);
  }, []);

  const handleContentChange = React.useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  }, []);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="template-title" className="text-sm font-medium">Title</label>
          <Input
            id="template-title"
            value={title}
            onChange={handleTitleChange}
            required
            disabled={loading}
            aria-label="Template title"
          />
        </div>

        <div>
          <label htmlFor="template-description" className="text-sm font-medium">Description</label>
          <Textarea
            id="template-description"
            value={description}
            onChange={handleDescriptionChange}
            required
            disabled={loading}
            aria-label="Template description"
          />
        </div>

        <div>
          <label htmlFor="template-category" className="text-sm font-medium">Category</label>
          <Input
            id="template-category"
            value={category}
            onChange={handleCategoryChange}
            required
            disabled={loading}
            aria-label="Template category"
          />
        </div>

        <div>
          <label htmlFor="template-content" className="text-sm font-medium">Content</label>
          <Textarea
            id="template-content"
            value={content}
            onChange={handleContentChange}
            required
            disabled={loading}
            className="min-h-[200px]"
            aria-label="Template content"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Fields</h3>
          <Button
            type="button"
            onClick={handleAddField}
            disabled={loading}
            aria-label="Add new field"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Field
          </Button>
        </div>

        <div className="space-y-4">
          {fields.map((field, index) => (
            <FieldEditor
              key={field.id}
              field={field}
              index={index}
              onFieldChange={handleFieldChange}
              onRemove={handleRemoveField}
              disabled={loading}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={loading}
          aria-label="Save template"
        >
          <Save className="h-4 w-4 mr-2" />
          {loading ? "Saving..." : "Save Template"}
        </Button>
      </div>
    </form>
  );
};

export default TemplateManager; 