"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useWebStore } from '@/lib/store/webStore';
import { templates } from '@/lib/data/templates';
import TemplateForm from '@/components/web/TemplateForm';
import { processTemplate } from '@/lib/utils/templateProcessor';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function TemplatePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const unwrappedParams = React.use(params);
  const { id } = unwrappedParams;

  // State
  const [template, setTemplate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Store
  const isMobileMenuOpen = useWebStore((state) => state.isMobileMenuOpen);
  const setIsMobileMenuOpen = useWebStore((state) => state.setIsMobileMenuOpen);
  const saveDocument = useWebStore((state) => state.saveDocument);

  // Fetch template
  useEffect(() => {
    const fetchTemplate = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // In a real app, we would fetch from API
        // For now, use the mock data
        const foundTemplate = templates.find(t => t.id === id);

        if (!foundTemplate) {
          setError('Шаблон не найден');
          return;
        }

        setTemplate(foundTemplate);
      } catch (err) {
        console.error('Error fetching template:', err);
        setError('Не удалось загрузить шаблон. Пожалуйста, попробуйте позже.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplate();
  }, [id]);

  // Handle form submission
  const handleSubmit = async (values: Record<string, any>) => {
    setIsSubmitting(true);

    try {
      // Process template with values
      const content = processTemplate(template, values);

      // Save document
      const document = {
        templateId: template.id,
        templateName: template.title,
        title: `${template.title} от ${new Date().toLocaleDateString('ru-RU')}`,
        values,
        content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Save document to store
      const savedDocument = await saveDocument(document);

      if (savedDocument) {
        // Redirect to document page
        router.push(`/web/documents`);
      } else {
        setError('Не удалось сохранить документ. Пожалуйста, попробуйте позже.');
      }
    } catch (err) {
      console.error('Error saving document:', err);
      setError('Произошла ошибка при создании документа. Пожалуйста, попробуйте позже.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <Header
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          pageTitle="Загрузка шаблона..."
          pageRoute={`/web/templates/${id}`}
        />
        <main className="flex-1 p-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </main>
      </div>
    );
  }

  // Error state
  if (error || !template) {
    return (
      <div className="flex flex-col h-full">
        <Header
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          pageTitle="Ошибка"
          pageRoute={`/web/templates/${id}`}
        />
        <main className="flex-1 p-6">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Link 
                href="/web/templates" 
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Назад к шаблонам
              </Link>
            </div>

            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Ошибка</AlertTitle>
              <AlertDescription>
                {error || 'Шаблон не найден'}
              </AlertDescription>
            </Alert>

            <Button asChild>
              <Link href="/web/templates">Вернуться к списку шаблонов</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  // Success state
  return (
    <div className="flex flex-col h-full">
      <Header
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        pageTitle={template.title}
        pageRoute={`/web/templates/${id}`}
      />
      <main className="flex-1 p-6">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Link 
              href="/web/templates" 
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Назад к шаблонам
            </Link>
          </div>

          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold">{template.title}</h1>
            <p className="text-muted-foreground">
              {template.description}
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Ошибка</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <TemplateForm 
            template={template} 
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </div>
      </main>
    </div>
  );
}
