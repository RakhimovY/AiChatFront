import * as React from "react";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

type TemplatePreview = {
  id: string;
  title: string;
  description: string;
  category: string;
  previewImage?: string;
};

type TemplatePreviewCardProps = {
  template: TemplatePreview;
  onSelect?: (template: TemplatePreview) => void;
};

const TemplatePreviewCard = React.memo(({ 
  template, 
  onSelect 
}: TemplatePreviewCardProps) => (
  <div
    className="border rounded-lg p-4 space-y-4 hover:shadow-md transition-shadow"
    role="article"
    aria-label={`Template: ${template.title}`}
  >
    <div className="space-y-1">
      <h3 className="font-semibold">{template.title}</h3>
      <p className="text-sm text-muted-foreground">{template.description}</p>
      <span className="inline-block px-2 py-1 text-xs rounded-full bg-secondary">
        {template.category}
      </span>
    </div>

    <div className="flex justify-end">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onSelect?.(template)}
        aria-label={`Use template ${template.title}`}
      >
        <FileText className="h-4 w-4 mr-2" />
        Use Template
      </Button>
    </div>
  </div>
));

TemplatePreviewCard.displayName = "TemplatePreviewCard";

export default TemplatePreviewCard; 