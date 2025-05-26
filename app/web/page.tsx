"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import Link from "next/link";
import { FileText, Edit, List } from "lucide-react";

export default function WebPage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Документы</h1>
        <p className="text-muted-foreground">
          Создавайте и управляйте юридическими документами
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/web/templates"
          className="block p-6 rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex flex-col space-y-2 items-center text-center">
            <List className="h-8 w-8 text-primary mb-2" />
            <h2 className="text-xl font-semibold">Шаблоны</h2>
            <p className="text-sm text-muted-foreground">
              Просмотр доступных шаблонов документов
            </p>
          </div>
        </Link>

        <Link
          href="/web/editor"
          className="block p-6 rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex flex-col space-y-2 items-center text-center">
            <Edit className="h-8 w-8 text-primary mb-2" />
            <h2 className="text-xl font-semibold">Редактор</h2>
            <p className="text-sm text-muted-foreground">
              Создание нового документа на основе шаблона
            </p>
          </div>
        </Link>

        <Link
          href="/web/documents"
          className="block p-6 rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex flex-col space-y-2 items-center text-center">
            <FileText className="h-8 w-8 text-primary mb-2" />
            <h2 className="text-xl font-semibold">Мои документы</h2>
            <p className="text-sm text-muted-foreground">
              Управление созданными документами
            </p>
          </div>
        </Link>
      </div>

      <div className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Начало работы</h2>
        <ol className="space-y-2 list-decimal list-inside text-muted-foreground">
          <li>Выберите шаблон документа из каталога шаблонов</li>
          <li>Заполните необходимые поля в редакторе</li>
          <li>Просмотрите предварительную версию документа</li>
          <li>Сохраните или экспортируйте готовый документ</li>
        </ol>
      </div>
    </div>
  );
}