import * as React from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type DocumentType = 
  | "employment" 
  | "real-estate" 
  | "rental" 
  | "charter" 
  | "protocol" 
  | "power-of-attorney" 
  | "consumer-claim" 
  | "lawsuit";

type DocumentTypeOption = {
  value: DocumentType;
  label: string;
  templateIds: string[];
};

type FilterPopoverProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDocType: DocumentType | null;
  onDocTypeChange: (type: DocumentType | null) => void;
  onClearAll: () => void;
  documentTypes: DocumentTypeOption[];
  t: Record<string, string>;
};

const FilterPopover = React.memo(({ 
  isOpen, 
  onOpenChange, 
  selectedDocType, 
  onDocTypeChange, 
  onClearAll, 
  documentTypes, 
  t 
}: FilterPopoverProps) => (
  <Popover open={isOpen} onOpenChange={onOpenChange}>
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
              onClick={onClearAll}
              className="h-8 text-xs"
              aria-label={t.clearAll}
            >
              {t.clearAll}
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-2">
          <Button
            variant={selectedDocType === null ? "default" : "outline"}
            onClick={() => onDocTypeChange(null)}
            className="justify-start"
            aria-label={t.allDocumentTypes}
          >
            {t.allDocumentTypes}
          </Button>
          {documentTypes.map((type) => (
            <Button
              key={type.value}
              variant={selectedDocType === type.value ? "default" : "outline"}
              onClick={() => onDocTypeChange(type.value)}
              className="justify-start"
              aria-label={type.label}
            >
              {type.label}
            </Button>
          ))}
        </div>
      </div>
    </PopoverContent>
  </Popover>
));

FilterPopover.displayName = "FilterPopover";

export default FilterPopover; 