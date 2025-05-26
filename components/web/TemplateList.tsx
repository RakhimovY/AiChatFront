"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { Search, Filter } from "lucide-react";
import Link from "next/link";
import { useWebStore } from "@/lib/store/webStore";

// Template type definition
interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  previewImage?: string;
}

interface TemplateListProps {
  initialTemplates?: Template[];
}

export default function TemplateList({ initialTemplates = [] }: TemplateListProps) {
  const { t } = useLanguage();
  const [templates, setTemplates] = useState<Template[]>(initialTemplates);
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>(templates);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(initialTemplates.length === 0);
  const [error, setError] = useState<string | null>(null);

  // Fetch templates if not provided
  useEffect(() => {
    if (initialTemplates.length === 0) {
      fetchTemplates();
    } else {
      // Extract categories from provided templates
      const uniqueCategories = [...new Set(initialTemplates.map(template => template.category))];
      setCategories(uniqueCategories);
      setTemplates(initialTemplates);
      setFilteredTemplates(initialTemplates);
    }
  }, [initialTemplates]);

  // Filter templates when search query or category changes
  useEffect(() => {
    let result = templates;

    // Filter by category
    if (selectedCategory) {
      result = result.filter(template => template.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(template => 
        template.title.toLowerCase().includes(query) || 
        template.description.toLowerCase().includes(query)
      );
    }

    setFilteredTemplates(result);
  }, [searchQuery, selectedCategory, templates]);

  // Fetch templates from API
  const fetchTemplates = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const webStore = useWebStore.getState();
      const data = await webStore.fetchTemplates();

      // Extract categories
      const uniqueCategories = [...new Set(data.map((template: Template) => template.category))];

      setCategories(uniqueCategories);
      setTemplates(data);
      setFilteredTemplates(data);
    } catch (err) {
      setError("Не удалось загрузить шаблоны. Пожалуйста, попробуйте позже.");
      console.error("Error fetching templates:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle category selection
  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
  };

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center p-6 border rounded-lg bg-destructive/10 text-destructive">
        <p>{error}</p>
        <button 
          onClick={fetchTemplates}
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input
            type="text"
            placeholder="Поиск шаблонов..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border rounded-md bg-background"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          <button
            onClick={() => handleCategoryChange(null)}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap ${
              selectedCategory === null 
                ? "bg-primary text-primary-foreground" 
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            Все категории
          </button>

          {categories.map(category => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap ${
                selectedCategory === category 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Templates grid */}
      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map(template => (
            <Link
              key={template.id}
              href={`/web/editor?templateId=${template.id}`}
              className="block border rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-card"
            >
              {template.previewImage && (
                <div className="h-40 bg-muted">
                  <img 
                    src={template.previewImage} 
                    alt={template.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-4">
                <div className="inline-block px-2 py-1 text-xs rounded-full bg-secondary text-secondary-foreground mb-2">
                  {template.category}
                </div>
                <h3 className="text-lg font-semibold mb-1">{template.title}</h3>
                <p className="text-sm text-muted-foreground">{template.description}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 border rounded-lg bg-muted">
          <p className="text-muted-foreground">Шаблоны не найдены</p>
        </div>
      )}
    </div>
  );
}
