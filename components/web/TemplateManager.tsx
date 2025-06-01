"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast-hook";
import type { Template, Field, TextField, SelectField, DateField, CheckboxField, RadioField } from "@/types/document";
import { Plus, Trash2, Save } from "lucide-react";

interface TemplateManagerProps {
    template?: Template;
    onSave?: (template: Template) => void;
}

export function TemplateManager({ template, onSave }: TemplateManagerProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = React.useState(false);
    const [title, setTitle] = React.useState(template?.title || "");
    const [description, setDescription] = React.useState(template?.description || "");
    const [category, setCategory] = React.useState(template?.category || "");
    const [content, setContent] = React.useState(template?.content || "");
    const [fields, setFields] = React.useState<Field[]>(template?.fields || []);

    const handleAddField = () => {
        const newField: TextField = {
            id: `field_${Date.now()}`,
            name: "",
            label: "",
            type: "text",
            required: false,
        };
        setFields([...fields, newField]);
    };

    const handleRemoveField = (index: number) => {
        setFields(fields.filter((_, i) => i !== index));
    };

    const handleFieldChange = (index: number, field: Partial<Field>) => {
        const newFields = [...fields];
        const currentField = newFields[index];

        // Create a new field object based on the type
        let updatedField: Field;
        switch (field.type || currentField.type) {
            case "select":
                updatedField = {
                    ...currentField,
                    ...field,
                    type: "select",
                    options: (field as Partial<SelectField>).options || (currentField as SelectField).options || [],
                } as SelectField;
                break;
            case "date":
                updatedField = {
                    ...currentField,
                    ...field,
                    type: "date",
                } as DateField;
                break;
            case "checkbox":
                updatedField = {
                    ...currentField,
                    ...field,
                    type: "checkbox",
                } as CheckboxField;
                break;
            case "radio":
                updatedField = {
                    ...currentField,
                    ...field,
                    type: "radio",
                    options: (field as Partial<RadioField>).options || (currentField as RadioField).options || [],
                } as RadioField;
                break;
            default:
                updatedField = {
                    ...currentField,
                    ...field,
                    type: "text",
                } as TextField;
        }

        newFields[index] = updatedField;
        setFields(newFields);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const templateData: Partial<Template> = {
                title,
                description,
                category,
                content,
                fields,
            };

            if (template?.id) {
                // Update existing template
                const response = await fetch(`/api/web/templates/${template.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(templateData),
                });

                if (!response.ok) {
                    throw new Error('Failed to update template');
                }

                const updatedTemplate = await response.json();
                onSave?.(updatedTemplate);
                toast({
                    title: "Success",
                    description: "Template updated successfully",
                });
            } else {
                // Create new template
                const response = await fetch('/api/web/templates', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(templateData),
                });

                if (!response.ok) {
                    throw new Error('Failed to create template');
                }

                const newTemplate = await response.json();
                onSave?.(newTemplate);
                toast({
                    title: "Success",
                    description: "Template created successfully",
                });
            }

            router.push("/templates");
        } catch (error) {
            console.error("Error saving template:", error);
            toast({
                title: "Error",
                description: "Failed to save template",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <div>
                    <label className="text-sm font-medium">Title</label>
                    <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>

                <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>

                <div>
                    <label className="text-sm font-medium">Category</label>
                    <Input
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>

                <div>
                    <label className="text-sm font-medium">Content</label>
                    <Textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        disabled={loading}
                        className="min-h-[200px]"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                        Use {"{{field_name}}"} to insert field values
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Fields</h3>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddField}
                        disabled={loading}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Field
                    </Button>
                </div>

                {fields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-2 gap-4 p-4 border rounded-lg">
                        <div>
                            <label className="text-sm font-medium">Name</label>
                            <Input
                                value={field.name}
                                onChange={(e) => handleFieldChange(index, { name: e.target.value })}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium">Label</label>
                            <Input
                                value={field.label}
                                onChange={(e) => handleFieldChange(index, { label: e.target.value })}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium">Type</label>
                            <Select
                                value={field.type}
                                onValueChange={(value) => handleFieldChange(index, { type: value as Field["type"] })}
                                disabled={loading}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="text">Text</SelectItem>
                                    <SelectItem value="textarea">Textarea</SelectItem>
                                    <SelectItem value="select">Select</SelectItem>
                                    <SelectItem value="date">Date</SelectItem>
                                    <SelectItem value="checkbox">Checkbox</SelectItem>
                                    <SelectItem value="radio">Radio</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-end">
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => handleRemoveField(index)}
                                disabled={loading}
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Remove
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-end">
                <Button type="submit" disabled={loading}>
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? "Saving..." : "Save Template"}
                </Button>
            </div>
        </form>
    );
} 