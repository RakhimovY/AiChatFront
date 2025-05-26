"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Save } from "lucide-react";
import DocumentEditor from "@/components/web/DocumentEditor";

export default function EditorPage() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  const templateId = searchParams.get("templateId");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Reset success/error messages when templateId changes
  useEffect(() => {
    setSaveSuccess(false);
    setSaveError(null);
  }, [templateId]);

  // Handle document save
  const handleSave = async (values: Record<string, any>) => {
    try {
      const response = await fetch('/api/web/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId,
          values
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      setSaveSuccess(true);
      setSaveError(null);
      
      // Redirect to the document view page after a short delay
      setTimeout(() => {
        router.push(`/web/documents/${data.id}`);
      }, 1500);
    } catch (err) {
      console.error("Error saving document:", err);
      setSaveError("Не удалось сохранить документ. Пожалуйста, попробуйте позже.");
      setSaveSuccess(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link 
          href={templateId ? "/web/templates" : "/web"}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Назад
        </Link>
        
        {saveSuccess && (
          <div className="text-sm px-3 py-1 rounded-md bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400">
            Документ успешно сохранен
          </div>
        )}
        
        {saveError && (
          <div className="text-sm px-3 py-1 rounded-md bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400">
            {saveError}
          </div>
        )}
      </div>

      {templateId ? (
        <DocumentEditor 
          templateId={templateId} 
          onSave={handleSave}
        />
      ) : (
        <div className="text-center p-8 border rounded-lg bg-muted">
          <p className="text-muted-foreground mb-4">Выберите шаблон для создания документа</p>
          <Link
            href="/web/templates"
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Перейти к шаблонам
          </Link>
        </div>
      )}
    </div>
  );
}