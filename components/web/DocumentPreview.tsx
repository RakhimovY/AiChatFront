"use client";

import * as React from "react";
import { Template, DocumentValues } from "@/types/document";
import { cn } from "@/lib/utils";

interface DocumentPreviewProps {
  template: Template;
  values: DocumentValues;
  className?: string;
}

export default function DocumentPreview({
  template,
  values,
  className,
}: DocumentPreviewProps) {
  const previewContent = React.useMemo(() => {
    let content = template.content;

    // Replace placeholders with actual values
    Object.entries(values).forEach(([key, value]) => {
      const field = template.fields.find(f => f.id === key);
      if (field) {
        const placeholder = `{{${field.name}}}`;
        let displayValue = value;

        // Format value based on field type
        if (field.type === "date" && value) {
          displayValue = new Date(value).toLocaleDateString();
        } else if (field.type === "checkbox") {
          displayValue = value ? "Yes" : "No";
        }

        content = content.replace(new RegExp(placeholder, "g"), displayValue?.toString() || "");
      }
    });

    return content;
  }, [template, values]);

  return (
    <div className={cn("prose max-w-none", className)}>
      <div className="whitespace-pre-wrap">{previewContent}</div>
    </div>
  );
}