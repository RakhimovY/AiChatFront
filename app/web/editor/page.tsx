"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Save } from "lucide-react";
import DocumentEditor from "@/components/web/DocumentEditor";
import { useWebStore } from "@/lib/store/webStore";

export default function EditorPage() {
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
      const webStore = useWebStore.getState();
      const document = {
        templateId,
        values
      };

      const savedDocument = await webStore.saveDocument(document);

      if (!savedDocument) {
        throw new Error("Failed to save document");
      }

      setSaveSuccess(true);
      setSaveError(null);

      // Redirect to the document view page after a short delay
      setTimeout(() => {
        router.push(`/web/documents/${savedDocument.id}`);
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
