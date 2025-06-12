"use client";

import { documentService } from "@/lib/services/documentService";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import Navigation from "@/components/layout/Navigation";
import { useState } from "react";

interface Document {
  id: string;
  title: string;
  templateName: string;
  createdAt: string;
  version: number;
}

interface DocumentCardProps {
  document: Document;
  onDelete: (id: string) => Promise<void>;
}

const DocumentCard = ({ document, onDelete }: DocumentCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirm("Вы уверены, что хотите удалить этот документ?")) {
      try {
        setIsDeleting(true);
        await onDelete(document.id);
      } catch (error) {
        console.error("Error deleting document:", error);
        alert("Не удалось удалить документ");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="border rounded-lg p-4 space-y-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="font-semibold">{document.title}</h3>
          <p className="text-sm text-muted-foreground">
            Шаблон: {document.templateName}
          </p>
          <p className="text-sm text-muted-foreground">
            Создан: {new Date(document.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            asChild
          >
            <Link href={`/documents/${document.id}`}>
              <Edit className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Версия {document.version}
        </div>
        <Button
          variant="outline"
          size="sm"
          asChild
        >
          <Link href={`/documents/${document.id}`}>
            <FileText className="h-4 w-4 mr-2" />
            Просмотр
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default function DocumentsPage() {
  const { t } = useLanguage();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDocuments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const docs = await documentService.getDocuments();
      setDocuments(docs);
    } catch (error) {
      console.error("Error loading documents:", error);
      setError("Не удалось загрузить документы");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await documentService.deleteDocument(id);
      await loadDocuments();
    } catch (error) {
      console.error("Error deleting document:", error);
      throw error;
    }
  };

  return (
    <main className="flex flex-col min-h-screen bg-background">
      <Navigation activePage="home" />
      <div className="container py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">{t.documents || "Документы"}</h1>
            <Button asChild>
              <Link href="/documents/new">
                <Plus className="h-4 w-4 mr-2" />
                {t.document || "Новый документ"}
              </Link>
            </Button>
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-6">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              {t.loading || "Загрузка..."}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {documents.map((document) => (
                <DocumentCard
                  key={document.id}
                  document={document}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}

          {!isLoading && documents.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {t.noTemplatesFound || "Документы не найдены"}
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 