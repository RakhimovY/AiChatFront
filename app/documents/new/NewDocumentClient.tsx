"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { TemplateList } from "@/components/web/TemplateList";
import DocumentEditor from "@/components/web/DocumentEditor";
import type { Template, Document } from "@/types/document";

export function NewDocumentClient() {
    const router = useRouter();
    const [selectedTemplate, setSelectedTemplate] = React.useState<Template | null>(null);

    const handleTemplateSelect = (template: Template) => {
        setSelectedTemplate(template);
    };

    const handleDocumentSave = (document: Document) => {
        router.push(`/documents/${document.id}`);
    };

    if (selectedTemplate) {
        return (
            <DocumentEditor
                templateId={selectedTemplate.id}
                initialTemplate={selectedTemplate}
                onSave={handleDocumentSave}
            />
        );
    }

    return (
        <TemplateList onSelect={handleTemplateSelect} />
    );
} 