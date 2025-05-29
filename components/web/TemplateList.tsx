"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { Search, X } from "lucide-react";
import { useWebStore } from "@/lib/store/webStore";
import TemplateCard from "./TemplateCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

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
  title?: string;
}

export default function TemplateList({
  initialTemplates = [],
  title,
}: TemplateListProps) {
  const { t } = useLanguage();
  const [templates, setTemplates] = useState<Template[]>(initialTemplates);
  const [filteredTemplates, setFilteredTemplates] =
    useState<Template[]>(templates);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(initialTemplates.length === 0);
  const [error, setError] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Map for category display names
  const categoryDisplayNames: Record<string, string> = {
    "kazakhstan-legal": t.kazakhstanLegalDocuments,
    business: t.businessDocuments,
    personal: t.personalDocuments,
    legal: t.legalDocuments,
    finance: t.financialDocuments,
    education: t.educationalDocuments,
    medical: t.medicalDocuments,
  };

  // Fetch templates if not provided - only on mount
  useEffect(() => {
    if (initialTemplates.length === 0) {
      fetchTemplates();
    } else {
      // Extract categories from provided templates
      const uniqueCategories = [
        ...new Set(initialTemplates.map((template) => template.category)),
      ];
      setCategories(uniqueCategories);
      setTemplates(initialTemplates);
      setFilteredTemplates(initialTemplates);
    }
  }, []); // Empty dependency array ensures this only runs once on mount

  // Filter templates when search query or category changes
  useEffect(() => {
    let result = templates;

    // Filter by category
    if (selectedCategory) {
      result = result.filter(
        (template) => template.category === selectedCategory,
      );
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (template) =>
          template.title.toLowerCase().includes(query) ||
          template.description.toLowerCase().includes(query),
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
      const uniqueCategories = [
        ...new Set(data.map((template: Template) => template.category)),
      ];

      setCategories(uniqueCategories);
      setTemplates(data);
      setFilteredTemplates(data);
    } catch (err) {
      setError(t.errorLoadingTemplates);
      console.error("Error fetching templates:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle category selection
  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    setIsFilterOpen(false); // Close filter popover after selection
  };

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Clear search query
  const clearSearch = () => {
    setSearchQuery("");
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedCategory(null);
    setSearchQuery("");
    setIsFilterOpen(false);
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
          {t.tryAgain}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with title if provided */}
      {title && (
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        </div>
      )}

      {/* Search and filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder={t.searchTemplates}
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-10"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={t.clearSearch}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/*<div className="flex gap-2">*/}
        {/*  <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>*/}
        {/*    <PopoverTrigger asChild>*/}
        {/*      <Button */}
        {/*        variant="outline" */}
        {/*        className="flex items-center gap-2"*/}
        {/*        aria-label={t.filterTemplates}*/}
        {/*      >*/}
        {/*        <Filter className="h-4 w-4" />*/}
        {/*        <span className="hidden sm:inline">{t.filter}</span>*/}
        {/*        {selectedCategory && (*/}
        {/*          <Badge variant="secondary" className="ml-1">1</Badge>*/}
        {/*        )}*/}
        {/*      </Button>*/}
        {/*    </PopoverTrigger>*/}
        {/*    <PopoverContent className="w-80 p-4">*/}
        {/*      <div className="space-y-4">*/}
        {/*        <div className="flex items-center justify-between">*/}
        {/*          <h4 className="font-medium">{t.categories}</h4>*/}
        {/*          {selectedCategory && (*/}
        {/*            <Button */}
        {/*              variant="ghost" */}
        {/*              size="sm" */}
        {/*              onClick={clearAllFilters}*/}
        {/*              className="h-8 text-xs"*/}
        {/*            >*/}
        {/*              {t.clearAll}*/}
        {/*            </Button>*/}
        {/*          )}*/}
        {/*        </div>*/}

        {/*        <div className="grid grid-cols-1 gap-2">*/}
        {/*          <Button*/}
        {/*            variant={selectedCategory === null ? "default" : "outline"}*/}
        {/*            size="sm"*/}
        {/*            onClick={() => handleCategoryChange(null)}*/}
        {/*            className="justify-start"*/}
        {/*          >*/}
        {/*            {t.allCategories}*/}
        {/*          </Button>*/}

        {/*          {categories.map(category => (*/}
        {/*            <Button*/}
        {/*              key={category}*/}
        {/*              variant={selectedCategory === category ? "default" : "outline"}*/}
        {/*              size="sm"*/}
        {/*              onClick={() => handleCategoryChange(category)}*/}
        {/*              className="justify-start"*/}
        {/*            >*/}
        {/*              {categoryDisplayNames[category] || category}*/}
        {/*            </Button>*/}
        {/*          ))}*/}
        {/*        </div>*/}
        {/*      </div>*/}
        {/*    </PopoverContent>*/}
        {/*  </Popover>*/}

        {/*  {selectedCategory && (*/}
        {/*    <Button */}
        {/*      variant="outline" */}
        {/*      size="icon"*/}
        {/*      onClick={clearAllFilters}*/}
        {/*      aria-label={t.clearFilters}*/}
        {/*    >*/}
        {/*      <X className="h-4 w-4" />*/}
        {/*    </Button>*/}
        {/*  )}*/}
        {/*</div>*/}
      </div>

      {/* Active filters display */}
      {selectedCategory && (
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            {categoryDisplayNames[selectedCategory] || selectedCategory}
            <button
              onClick={() => setSelectedCategory(null)}
              className="ml-1 rounded-full hover:bg-muted p-0.5"
              aria-label={t.removeFilter}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        </div>
      )}

      {/* Templates grid */}
      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      ) : (
        <div className="text-center p-8 border rounded-lg bg-muted">
          <p className="text-muted-foreground">{t.noTemplatesFound}</p>
          {(searchQuery || selectedCategory) && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllFilters}
              className="mt-4"
            >
              {t.clearFilters}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
