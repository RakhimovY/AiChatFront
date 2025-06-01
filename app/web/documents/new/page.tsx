"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useWebStore } from "@/lib/store/webStore";
import { documentService } from "@/lib/services/documentService";
import DocumentEditor from "@/components/web/DocumentEditor";
import Header from "@/components/layout/Header";
import type { Template, Document } from "@/types/document";

export default function NewDocumentPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const templateId = searchParams.get("templateId");
    const [template, setTemplate] = useState<Template | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const isMobileMenuOpen = useWebStore((state) => state.isMobileMenuOpen);
    const setIsMobileMenuOpen = useWebStore((state) => state.setIsMobileMenuOpen);

    useEffect(() => {
        const fetchTemplate = async () => {
            if (!templateId) {
                setError("No template selected");
                setLoading(false);
                return;
            }

            try {
                const data = await documentService.getTemplate(templateId);
                setTemplate(data);
            } catch (err) {
                console.error("Error fetching template:", err);
                setError("Failed to load template");
            } finally {
                setLoading(false);
            }
        };

        fetchTemplate();
    }, [templateId]);

    const handleSave = (document: Document) => {
        router.push(`/web/documents/${document.id}`);
    };

    return (
        <div className="flex flex-col h-full">
            <Header
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
            />

            <main className="flex-1 p-6">
                <div className="space-y-6">
                    <div className="flex items-center gap-2">
                        <Link
                            href="/web/templates"
                            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Назад
                        </Link>
                    </div>

                    <div className="flex flex-col space-y-2">
                        <h1 className="text-3xl font-bold">Создание документа</h1>
                        <p className="text-muted-foreground">
                            Заполните поля для создания документа
                        </p>
                    </div>

                    {loading ? (
                        <div>Loading...</div>
                    ) : error ? (
                        <div className="text-center p-8 border rounded-lg bg-muted">
                            <p className="text-muted-foreground mb-4">{error}</p>
                            <Link
                                href="/web/templates"
                                className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                            >
                                Выбрать шаблон
                            </Link>
                        </div>
                    ) : template ? (
                        <DocumentEditor
                            templateId={template.id}
                            initialTemplate={template}
                            onSave={handleSave}
                        />
                    ) : (
                        <div className="text-center p-8 border rounded-lg bg-muted">
                            <p className="text-muted-foreground mb-4">Шаблон не найден</p>
                            <Link
                                href="/web/templates"
                                className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                            >
                                Выбрать шаблон
                            </Link>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
} 