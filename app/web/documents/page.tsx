"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import Link from "next/link";
import {
  ChevronLeft,
  Edit,
  FileText,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

interface Document {
  id: string;
  title: string;
  templateId: string;
  templateName: string;
  createdAt: string;
  updatedAt: string;
}

export default function DocumentsPage() {
  const { t } = useLanguage();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const filtered = documents.filter(
        (doc) =>
          doc.title.toLowerCase().includes(query) ||
          doc.templateName.toLowerCase().includes(query),
      );
      setFilteredDocuments(filtered);
    } else {
      setFilteredDocuments(documents);
    }
  }, [searchQuery, documents]);

  const fetchDocuments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/web/documents");
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      setDocuments(data);
      setFilteredDocuments(data);
    } catch (err) {
      setError("Не удалось загрузить документы. Пожалуйста, попробуйте позже.");
      console.error("Error fetching documents:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const confirmDelete = (id: string) => {
    setDeleteConfirm(id);
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  const deleteDocument = async (id: string) => {
    if (isDeleting) return;

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/web/documents/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      console.error("Error deleting document:", err);
      setError("Не удалось удалить документ. Пожалуйста, попробуйте позже.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link
          href="/web"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Назад
        </Link>
      </div>

      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Мои документы</h1>
        <p className="text-muted-foreground">
          Управление созданными документами
        </p>
      </div>

      {/* Search and actions */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input
            type="text"
            placeholder="Поиск документов..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border rounded-md bg-background"
          />
        </div>

        <Link
          href="/web/templates"
          className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 whitespace-nowrap"
        >
          <Plus className="h-4 w-4 mr-2" />
          Создать документ
        </Link>
      </div>

      {/* Error message */}
      {error && (
        <div className="text-center p-6 border rounded-lg bg-destructive/10 text-destructive">
          <p>{error}</p>
          <button
            onClick={fetchDocuments}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Попробовать снова
          </button>
        </div>
      )}

      {/* Documents list */}
      {filteredDocuments.length > 0 ? (
        <div className="border rounded-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Название
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium hidden md:table-cell">
                  Шаблон
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium hidden md:table-cell">
                  Дата создания
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium hidden sm:table-cell">
                  Последнее изменение
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredDocuments.map((doc) => (
                <tr key={doc.id} className="bg-card hover:bg-muted/50">
                  <td className="px-4 py-3 text-sm">
                    <Link
                      href={`/web/documents/${doc.id}`}
                      className="font-medium hover:underline flex items-center"
                    >
                      <FileText className="h-4 w-4 mr-2 text-primary" />
                      {doc.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">
                    {doc.templateName}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">
                    {formatDate(doc.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground hidden sm:table-cell">
                    {formatDate(doc.updatedAt)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Link
                        href={`/web/editor?documentId=${doc.id}`}
                        className="p-1 text-muted-foreground hover:text-foreground"
                        title="Редактировать"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>

                      {deleteConfirm === doc.id ? (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => deleteDocument(doc.id)}
                            className="p-1 text-destructive hover:text-destructive/80"
                            disabled={isDeleting}
                          >
                            {isDeleting ? "..." : "Да"}
                          </button>
                          <button
                            onClick={cancelDelete}
                            className="p-1 text-muted-foreground hover:text-foreground"
                          >
                            Нет
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => confirmDelete(doc.id)}
                          className="p-1 text-muted-foreground hover:text-destructive"
                          title="Удалить"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center p-8 border rounded-lg bg-muted">
          <p className="text-muted-foreground mb-4">
            {searchQuery
              ? "Документы не найдены. Попробуйте изменить параметры поиска."
              : "У вас пока нет созданных документов."}
          </p>
          {!searchQuery && (
            <Link
              href="/web/templates"
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Создать документ
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
