"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import TemplateList from "@/components/web/TemplateList";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function TemplatesPage() {
  const { t } = useLanguage();

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
        <h1 className="text-3xl font-bold">Шаблоны документов</h1>
        <p className="text-muted-foreground">
          Выберите шаблон для создания нового документа
        </p>
      </div>

      <TemplateList />
    </div>
  );
}