"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { Search, Filter, X } from "lucide-react";
import { useWebStore } from "@/lib/store/webStore";
import TemplateCard from "./TemplateCard";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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

// Document types for Kazakhstan
type DocumentType = 
  | "employment" 
  | "real-estate" 
  | "rental" 
  | "charter" 
  | "protocol" 
  | "power-of-attorney" 
  | "consumer-claim" 
  | "lawsuit";

interface KazakhstanLegalTemplatesProps {
  initialTemplates?: Template[];
  title?: string;
}

export default function KazakhstanLegalTemplates({ initialTemplates = [], title }: KazakhstanLegalTemplatesProps) {
  const { t } = useLanguage();
  const [templates, setTemplates] = useState<Template[]>(initialTemplates);
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>(templates);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDocType, setSelectedDocType] = useState<DocumentType | null>(null);
  const [isLoading, setIsLoading] = useState(initialTemplates.length === 0);
  const [error, setError] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Document type options with translations
  const documentTypes = [
    { value: "employment", label: t.employmentContracts, templateIds: ["employment"] },
    { value: "real-estate", label: t.salesContracts, templateIds: ["real-estate"] },
    { value: "rental", label: t.rentalAgreements, templateIds: ["rental"] },
    { value: "charter", label: t.companyCharters, templateIds: ["charter"] },
    { value: "protocol", label: t.meetingProtocols, templateIds: ["protocol"] },
    { value: "power-of-attorney", label: t.powersOfAttorney, templateIds: ["power-of-attorney"] },
    { value: "consumer-claim", label: t.consumerClaims, templateIds: ["consumer-claim"] },
    { value: "lawsuit", label: t.lawsuits, templateIds: ["lawsuit"] },
  ];

  // Fetch templates if not provided - only on mount
  useEffect(() => {
    if (initialTemplates.length === 0) {
      fetchTemplates();
    } else {
      // Filter only Kazakhstan legal templates
      const kazakhstanTemplates = initialTemplates.filter(
        (template) => template.category === "kazakhstan-legal"
      );
      setTemplates(kazakhstanTemplates);
      setFilteredTemplates(kazakhstanTemplates);
    }
  }, [initialTemplates]);

  // Filter templates when search query or document type changes
  useEffect(() => {
    let result = templates;

    // Filter by document type
    if (selectedDocType) {
      // Find the selected document type object
      const docType = documentTypes.find(dt => dt.value === selectedDocType);

      if (docType && docType.templateIds.length > 0) {
        // Filter templates by matching template IDs
        result = result.filter((template) => 
          docType.templateIds.includes(template.id)
        );
      }
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (template) =>
          template.title.toLowerCase().includes(query) ||
          template.description.toLowerCase().includes(query)
      );
    }

    setFilteredTemplates(result);
  }, [searchQuery, selectedDocType, templates, documentTypes]);

  // Fetch templates from API
  const fetchTemplates = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const webStore = useWebStore.getState();
      const data = await webStore.fetchTemplates();

      // Filter only Kazakhstan legal templates
      const kazakhstanTemplates = data.filter(
        (template: Template) => template.category === "kazakhstan-legal"
      );

      setTemplates(kazakhstanTemplates);
      setFilteredTemplates(kazakhstanTemplates);
    } catch (err) {
      setError("Не удалось загрузить шаблоны. Пожалуйста, попробуйте позже.");
      console.error("Error fetching templates:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle document type selection
  const handleDocTypeChange = (docType: DocumentType | null) => {
    setSelectedDocType(docType);
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
    setSelectedDocType(null);
    setSearchQuery("");
    setIsFilterOpen(false);
  };

  // Get document type label
  const getDocTypeLabel = (docType: DocumentType | null): string => {
    if (!docType) return t.allDocumentTypes;
    const found = documentTypes.find(dt => dt.value === docType);
    return found ? found.label : docType;
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

        <div className="flex gap-2">
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                aria-label={t.filterTemplates}
              >
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">{t.filter}</span>
                {selectedDocType && (
                  <Badge variant="secondary" className="ml-1">1</Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{t.documentTypes}</h4>
                  {selectedDocType && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={clearAllFilters}
                      className="h-8 text-xs"
                    >
                      {t.clearAll}
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <Button
                    variant={selectedDocType === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleDocTypeChange(null)}
                    className="justify-start"
                  >
                    {t.allDocumentTypes}
                  </Button>

                  {documentTypes.map((docType) => (
                    <Button
                      key={docType.value}
                      variant={selectedDocType === docType.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleDocTypeChange(docType.value as DocumentType)}
                      className="justify-start"
                    >
                      {docType.label}
                    </Button>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {selectedDocType && (
            <Button 
              variant="outline" 
              size="icon"
              onClick={clearAllFilters}
              aria-label={t.clearFilters}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Active filters display */}
      {selectedDocType && (
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            {getDocTypeLabel(selectedDocType)}
            <button 
              onClick={() => setSelectedDocType(null)}
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
          {(searchQuery || selectedDocType) && (
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
