import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Field, TextField, SelectField, DateField, CheckboxField, RadioField } from "@/types/document";
import { Trash2 } from "lucide-react";

type FieldEditorProps = {
  field: Field;
  index: number;
  onFieldChange: (index: number, field: Partial<Field>) => void;
  onRemove: (index: number) => void;
  disabled: boolean;
};

const FieldEditor = React.memo(({ 
  field, 
  index, 
  onFieldChange, 
  onRemove, 
  disabled 
}: FieldEditorProps) => {
  const handleNameChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onFieldChange(index, { name: e.target.value });
  }, [index, onFieldChange]);

  const handleLabelChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onFieldChange(index, { label: e.target.value });
  }, [index, onFieldChange]);

  const handleTypeChange = React.useCallback((value: string) => {
    onFieldChange(index, { type: value as Field["type"] });
  }, [index, onFieldChange]);

  const handleRemove = React.useCallback(() => {
    onRemove(index);
  }, [index, onRemove]);

  return (
    <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg" role="group" aria-labelledby={`field-${index}-label`}>
      <div>
        <label htmlFor={`field-${index}-name`} className="text-sm font-medium">Name</label>
        <Input
          id={`field-${index}-name`}
          value={field.name}
          onChange={handleNameChange}
          required
          disabled={disabled}
          aria-label="Field name"
        />
      </div>

      <div>
        <label htmlFor={`field-${index}-label`} className="text-sm font-medium">Label</label>
        <Input
          id={`field-${index}-label`}
          value={field.label}
          onChange={handleLabelChange}
          required
          disabled={disabled}
          aria-label="Field label"
        />
      </div>

      <div>
        <label htmlFor={`field-${index}-type`} className="text-sm font-medium">Type</label>
        <Select
          value={field.type}
          onValueChange={handleTypeChange}
          disabled={disabled}
        >
          <SelectTrigger id={`field-${index}-type`}>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text">Text</SelectItem>
            <SelectItem value="textarea">Text Area</SelectItem>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="select">Select</SelectItem>
            <SelectItem value="checkbox">Checkbox</SelectItem>
            <SelectItem value="radio">Radio</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-end">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleRemove}
          disabled={disabled}
          aria-label={`Remove field ${field.name}`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
});

FieldEditor.displayName = "FieldEditor";

export default FieldEditor; 