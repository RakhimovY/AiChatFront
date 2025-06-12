"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast-hook";
import { documentService } from "@/lib/services/documentService";
import type { Template } from "@/types/document";
import { Plus, Search, FileText, Edit, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TemplateCard from "./TemplateCard";

type TemplateListProps = {
  onSelect?: (template: Template) => void;
};

type Category = string;

const TemplateList = ({ onSelect }: TemplateListProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const [templates, setTemplates] = React.useState<Template[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<Category | null>(null);

  const categories = React.useMemo(() => {
    const uniqueCategories = new Set(templates.map(t => t.category));
    return Array.from(uniqueCategories);
  }, [templates]);

  const filteredTemplates = React.useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return templates.filter(template => {
      const matchesSearch = query === "" || 
        template.title.toLowerCase().includes(query) ||
        template.description.toLowerCase().includes(query);
      const matchesCategory = !selectedCategory || template.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [templates, searchQuery, selectedCategory]);

  const fetchTemplates = React.useCallback(async () => {
    try {
      setLoading(true);
      const data = await documentService.getTemplates();
      setTemplates(data);
    } catch (error) {
      console.error("Error fetching templates:", error);
      toast({
        title: "Error",
        description: "Failed to load templates. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const handleDelete = React.useCallback(async (templateId: string) => {
    if (!window.confirm("Are you sure you want to delete this template?")) {
      return;
    }

    try {
      const response = await fetch(`/api/web/templates/${templateId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete template');
      }

      setTemplates(prev => prev.filter(t => t.id !== templateId));
      toast({
        title: "Success",
        description: "Template deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting template:", error);
      toast({
        title: "Error",
        description: "Failed to delete template. Please try again later.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const handleEdit = React.useCallback((templateId: string) => {
    router.push(`/templates/${templateId}/edit`);
  }, [router]);

  const handleSearch = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleCategoryChange = React.useCallback((value: string) => {
    setSelectedCategory(value === "all" ? null : value);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]" role="status">
        <div className="text-muted-foreground">Loading templates...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Templates</h2>
        <Button 
          onClick={() => router.push("/templates/new")}
          aria-label="Create new template"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Template
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={handleSearch}
            className="pl-9"
            aria-label="Search templates"
          />
        </div>
        <Select
          value={selectedCategory || "all"}
          onValueChange={handleCategoryChange}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onSelect={onSelect}
          />
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-8 text-muted-foreground" role="status">
          No templates found
        </div>
      )}
    </div>
  );
};

export { TemplateList };
