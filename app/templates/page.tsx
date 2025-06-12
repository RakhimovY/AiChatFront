"use client";

import { TemplateList } from "@/components/web/TemplateList";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import Navigation from "@/components/layout/Navigation";

export default function TemplatesPage() {
    const { t } = useLanguage();

    return (
        <main className="flex flex-col min-h-screen bg-background">
            <Navigation activePage="home" />
            <div className="container py-8">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8">{t.templates || "Шаблоны"}</h1>
                    <TemplateList />
                </div>
            </div>
        </main>
    );
} 