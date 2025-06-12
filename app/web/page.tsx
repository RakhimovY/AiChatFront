"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import LanguageSelector from "@/components/layout/LanguageSelector";
import Navigation from "@/components/layout/Navigation";
import { FileText, Edit, FolderOpen } from "lucide-react";
import Link from "next/link";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
}

interface StepProps {
  number: number;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description, link }: FeatureCardProps) => (
  <Link
    href={link}
    className="flex flex-col p-6 bg-card rounded-lg border hover:shadow-md transition-shadow"
  >
    <div className="p-2 bg-primary/10 rounded-lg w-fit mb-4">{icon}</div>
    <h3 className="font-semibold mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
  </Link>
);

const Step = ({ number, title, description }: StepProps) => (
  <div className="flex gap-4">
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-semibold">
      {number}
    </div>
    <div>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  </div>
);

export default function WebPage() {
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: <FileText className="h-6 w-6 text-primary" />,
      title: t.templates || "Шаблоны",
      description: t.ctaDescription || "Готовые шаблоны для быстрого создания документов",
      link: "/templates"
    },
    {
      icon: <Edit className="h-6 w-6 text-primary" />,
      title: t.editor || "Редактор",
      description: t.heroDescription || "Создавайте и редактируйте документы онлайн",
      link: "/editor"
    },
    {
      icon: <FolderOpen className="h-6 w-6 text-primary" />,
      title: t.documents || "Документы",
      description: t.documentationDescription || "Управляйте своими документами",
      link: "/documents"
    }
  ];

  const steps = [
    {
      number: 1,
      title: t.templates || "Выберите шаблон",
      description: t.appDescription || "Выберите подходящий шаблон из нашей библиотеки"
    },
    {
      number: 2,
      title: t.editor || "Заполните данные",
      description: t.appDescription || "Введите необходимую информацию в документ"
    },
    {
      number: 3,
      title: t.documents || "Скачайте документ",
      description: t.appDescription || "Скачайте готовый документ в нужном формате"
    }
  ];

  return (
    <main className="flex flex-col min-h-screen bg-background">
      <Navigation activePage="home" />
      <div className="container py-12 mt-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">{t.appName || "Веб-версия"}</h1>
            <p className="text-xl text-muted-foreground">{t.appDescription || "Создавайте и управляйте документами онлайн"}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 mb-12">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>

          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-2xl font-bold mb-6">{t.documentation || "Как начать"}</h2>
            <div className="space-y-6">
              {steps.map((step, index) => (
                <Step key={index} {...step} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
