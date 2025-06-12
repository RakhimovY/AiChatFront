import * as React from "react";
import { Button } from "@/components/ui/button";
import type { Template } from "@/types/document";
import { FileText, Edit, Trash2 } from "lucide-react";

type TemplateCardProps = {
  template: Template;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onSelect?: (template: Template) => void;
};

const TemplateCard = React.memo(({ 
  template, 
  onEdit, 
  onDelete, 
  onSelect 
}: TemplateCardProps) => (
  <div
    className="border rounded-lg p-4 space-y-4 hover:shadow-md transition-shadow"
    role="article"
    aria-label={`Template: ${template.title}`}
  >
    <div className="flex items-start justify-between">
      <div className="space-y-1">
        <h3 className="font-semibold">{template.title}</h3>
        <p className="text-sm text-muted-foreground">{template.description}</p>
        <span className="inline-block px-2 py-1 text-xs rounded-full bg-secondary">
          {template.category}
        </span>
      </div>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(template.id)}
          aria-label={`Edit template ${template.title}`}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(template.id)}
          aria-label={`Delete template ${template.title}`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>

    <div className="flex justify-between items-center">
      <div className="text-sm text-muted-foreground">
        {template.fields.length} fields
      </div>
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

TemplateCard.displayName = "TemplateCard";

export default TemplateCard;
