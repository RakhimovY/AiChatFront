"use client";

import { useRef, useEffect } from "react";
import { TemplateList } from "@/components/web/TemplateList";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import Header from "@/components/layout/Header";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useWebStore } from "@/lib/store/webStore";
import { useRouter } from "next/navigation";
import type { Template } from "@/types/document";

export default function TemplatesPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const isMobileMenuOpen = useWebStore((state) => state.isMobileMenuOpen);
  const setIsMobileMenuOpen = useWebStore((state) => state.setIsMobileMenuOpen);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!isMobileMenuOpen || window.innerWidth >= 768) return;
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const handleTemplateSelect = (template: Template) => {
    router.push(`/web/documents/new?templateId=${template.id}`);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header component for both mobile and desktop */}
      <Header
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <main className="flex-1 p-6">
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
            <h1 className="text-3xl font-bold">Шаблоны документов</h1>
            <p className="text-muted-foreground">
              Выберите шаблон для создания нового документа
            </p>
          </div>

          <TemplateList onSelect={handleTemplateSelect} />
        </div>
      </main>
    </div>
  );
}
