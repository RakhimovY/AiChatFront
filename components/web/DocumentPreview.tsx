"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { Download, FileText, Printer } from "lucide-react";

// Template type definition (simplified version of the one in DocumentEditor)
interface Template {
  id: string;
  title: string;
  description: string;
  content: string; // Template content with placeholders
}

interface DocumentPreviewProps {
  template: Template;
  values: Record<string, any>;
  showExportOptions?: boolean;
}

export default function DocumentPreview({
  template,
  values,
  showExportOptions = true
}: DocumentPreviewProps) {
  const { t } = useLanguage();
  const [format, setFormat] = useState<"pdf" | "docx">("pdf");
  const [isExporting, setIsExporting] = useState(false);

  // Replace placeholders in template content with actual values
  const processedContent = template.content.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
    const trimmedKey = key.trim();
    return values[trimmedKey] !== undefined ? values[trimmedKey] : match;
  });

  // Handle export
  const handleExport = async () => {
    if (!template || isExporting) return;
    
    setIsExporting(true);
    
    try {
      const response = await fetch('/api/web/documents/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId: template.id,
          values,
          format
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      // Get the blob from the response
      const blob = await response.blob();
      
      // Create a download link
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
    } catch (err) {
      console.error("Error exporting document:", err);
      // Could show an error message here
    } finally {
      setIsExporting(false);
    }
  };

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Document content */}
      <div className="border rounded-md p-6 bg-white text-black min-h-[400px] whitespace-pre-wrap print:border-0 print:p-0">
        {processedContent || (
          <div className="text-center text-muted-foreground italic">
            Предпросмотр документа будет отображен здесь
          </div>
        )}
      </div>
      
      {/* Export options */}
      {showExportOptions && (
        <div className="flex flex-wrap gap-2 justify-end print:hidden">
          <div className="flex rounded-md overflow-hidden">
            <button
              type="button"
              onClick={() => setFormat("pdf")}
              className={`px-3 py-1.5 text-sm ${
                format === "pdf" 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              PDF
            </button>
            <button
              type="button"
              onClick={() => setFormat("docx")}
              className={`px-3 py-1.5 text-sm ${
                format === "docx" 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              DOCX
            </button>
          </div>
          
          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="inline-flex items-center px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="h-4 w-4 mr-1" />
            {isExporting ? "Экспорт..." : "Экспорт"}
          </button>
          
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center px-3 py-1.5 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80"
          >
            <Printer className="h-4 w-4 mr-1" />
            Печать
          </button>
        </div>
      )}
    </div>
  );
}