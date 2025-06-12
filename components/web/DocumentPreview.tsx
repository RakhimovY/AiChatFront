"use client";

import * as React from "react";
import { Template, DocumentValues, Field } from "@/types/document";
import { cn } from "@/lib/utils";

type DocumentPreviewProps = {
  template: Template;
  values: DocumentValues;
  className?: string;
};

type FieldType = "text" | "date" | "checkbox" | "number";

const formatFieldValue = (value: unknown, fieldType: FieldType): string => {
  if (value === null || value === undefined) return "";
  
  try {
    switch (fieldType) {
      case "date":
        return new Date(value as string).toLocaleDateString();
      case "checkbox":
        return value ? "Yes" : "No";
      case "number":
        return Number(value).toString();
      default:
        return String(value);
    }
  } catch (error) {
    console.error(`Error formatting field value: ${error}`);
    return String(value);
  }
};

const DocumentPreview = React.memo(({
  template,
  values,
  className,
}: DocumentPreviewProps) => {
  const previewContent = React.useMemo(() => {
    try {
      return template.fields.reduce((content, field) => {
        const value = values[field.name];
        const placeholder = `{{${field.name}}}`;
        const displayValue = formatFieldValue(value, field.type as FieldType);
        return content.replace(new RegExp(placeholder, "g"), displayValue);
      }, template.content);
    } catch (error) {
      console.error(`Error generating preview: ${error}`);
      return template.content;
    }
  }, [template, values]);

  return (
    <div 
      className={cn("prose max-w-none", className)}
      role="document"
      aria-label="Document preview"
    >
      <div className="whitespace-pre-wrap">{previewContent}</div>
    </div>
  );
});

DocumentPreview.displayName = "DocumentPreview";

export default DocumentPreview;