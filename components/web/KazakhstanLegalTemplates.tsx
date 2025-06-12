"use client";

import * as React from "react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useWebStore } from "@/lib/store/webStore";
import TemplatePreviewCard from "./TemplatePreviewCard";
import SearchBar from "./SearchBar";
import FilterPopover from "./FilterPopover";
import type { Template as BaseTemplate, TemplateCategory } from "@/types/document";

type Template = Pick<BaseTemplate, 'id' | 'title' | 'description' | 'category' | 'previewImage'>;

type DocumentType = 
  | "employment" 
  | "real-estate" 
  | "rental" 
  | "charter" 
  | "protocol" 
  | "power-of-attorney" 
  | "consumer-claim" 
  | "lawsuit";

type KazakhstanLegalTemplatesProps = {
  initialTemplates?: Template[];
  title?: string;
};

const KazakhstanLegalTemplates = ({ initialTemplates = [], title }: KazakhstanLegalTemplatesProps) => {
  const { t } = useLanguage();
  const [templates, setTemplates] = React.useState<Template[]>(initialTemplates);
  const [filteredTemplates, setFilteredTemplates] = React.useState<Template[]>(templates);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedDocType, setSelectedDocType] = React.useState<DocumentType | null>(null);
  const [isLoading, setIsLoading] = React.useState(initialTemplates.length === 0);
  const [error, setError] = React.useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);

  const documentTypes = React.useMemo(() => [
    { value: "employment" as const, label: t.employmentContracts, templateIds: ["employment"] },
    { value: "real-estate" as const, label: t.salesContracts, templateIds: ["real-estate"] },
    { value: "rental" as const, label: t.rentalAgreements, templateIds: ["rental"] },
    { value: "charter" as const, label: t.companyCharters, templateIds: ["charter"] },
    { value: "protocol" as const, label: t.meetingProtocols, templateIds: ["protocol"] },
    { value: "power-of-attorney" as const, label: t.powersOfAttorney, templateIds: ["power-of-attorney"] },
    { value: "consumer-claim" as const, label: t.consumerClaims, templateIds: ["consumer-claim"] },
    { value: "lawsuit" as const, label: t.lawsuits, templateIds: ["lawsuit"] },
  ], [t]);

  const fetchTemplates = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const webStore = useWebStore.getState();
      const data = await webStore.fetchTemplates();

      const kazakhstanTemplates = data
        .filter((template: BaseTemplate) => template.category === "legal")
        .map((template: BaseTemplate) => ({
          id: template.id,
          title: template.title,
          description: template.description,
          category: template.category,
          previewImage: template.previewImage,
        }));

      setTemplates(kazakhstanTemplates);
      setFilteredTemplates(kazakhstanTemplates);
    } catch (err) {
      setError(t.errorLoadingTemplates);
      console.error("Error fetching templates:", err);
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  React.useEffect(() => {
    if (initialTemplates.length === 0) {
      fetchTemplates();
    } else {
      const kazakhstanTemplates = initialTemplates.filter(
        (template) => template.category === "legal"
      );
      setTemplates(kazakhstanTemplates);
      setFilteredTemplates(kazakhstanTemplates);
    }
  }, [initialTemplates, fetchTemplates]);

  React.useEffect(() => {
    let result = templates;

    if (selectedDocType) {
      const docType = documentTypes.find(dt => dt.value === selectedDocType);
      if (docType?.templateIds.length) {
        result = result.filter((template) => 
          docType.templateIds.includes(template.id)
        );
      }
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (template) =>
          template.title.toLowerCase().includes(query) ||
          template.description.toLowerCase().includes(query)
      );
    }

    setFilteredTemplates(result);
  }, [searchQuery, selectedDocType, templates, documentTypes]);

  const handleDocTypeChange = React.useCallback((docType: DocumentType | null) => {
    setSelectedDocType(docType);
    setIsFilterOpen(false);
  }, []);

  const handleSearchChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const clearSearch = React.useCallback(() => {
    setSearchQuery("");
  }, []);

  const clearAllFilters = React.useCallback(() => {
    setSelectedDocType(null);
    setSearchQuery("");
    setIsFilterOpen(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]" role="status">
        <div className="text-muted-foreground">{t.errorLoadingTemplates}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-destructive" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {title && (
        <h2 className="text-2xl font-bold">{title}</h2>
      )}

      <div className="flex gap-4">
        <SearchBar
          value={searchQuery}
          onChange={handleSearchChange}
          onClear={clearSearch}
          placeholder={t.searchTemplates}
        />
        <FilterPopover
          isOpen={isFilterOpen}
          onOpenChange={setIsFilterOpen}
          selectedDocType={selectedDocType}
          onDocTypeChange={handleDocTypeChange}
          onClearAll={clearAllFilters}
          documentTypes={documentTypes}
          t={t}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((template) => (
          <TemplatePreviewCard
            key={template.id}
            template={template}
          />
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-8 text-muted-foreground" role="status">
          {t.noTemplatesFound}
        </div>
      )}
    </div>
  );
};

export default KazakhstanLegalTemplates;
