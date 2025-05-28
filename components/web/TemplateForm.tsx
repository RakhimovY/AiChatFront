import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Template } from '@/lib/data/templates';
import { createValidationSchema, getTemplatePreview } from '@/lib/utils/templateProcessor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarIcon, HelpCircle, AlertCircle } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import DocumentPreview from './DocumentPreview';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TemplateFormProps {
  template: Template;
  onSubmit: (values: Record<string, any>) => void;
  isSubmitting?: boolean;
}

/**
 * TemplateForm component displays a form for filling in template fields,
 * with validation and real-time preview of the document.
 */
export default function TemplateForm({ template, onSubmit, isSubmitting = false }: TemplateFormProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>("form");

  // Group fields by type for better organization
  const fieldGroups = React.useMemo(() => {
    const groups: Record<string, typeof template.fields> = {
      document: [],
      parties: [],
      details: [],
      dates: [],
      financial: [],
      other: []
    };

    template.fields.forEach(field => {
      // Group fields based on their id or type
      if (field.id.includes('document') || field.id.includes('number')) {
        groups.document.push(field);
      } else if (
        field.id.includes('employer') || field.id.includes('employee') || 
        field.id.includes('seller') || field.id.includes('buyer') ||
        field.id.includes('landlord') || field.id.includes('tenant') ||
        field.id.includes('issuer') || field.id.includes('attorney') ||
        field.id.includes('claimant') || field.id.includes('respondent')
      ) {
        groups.parties.push(field);
      } else if (field.type === 'date') {
        groups.dates.push(field);
      } else if (
        field.id.includes('price') || field.id.includes('amount') || 
        field.id.includes('salary') || field.id.includes('fee') ||
        field.id.includes('currency')
      ) {
        groups.financial.push(field);
      } else if (
        field.id.includes('property') || field.id.includes('description') ||
        field.id.includes('address') || field.id.includes('details') ||
        field.id.includes('type') || field.id.includes('condition')
      ) {
        groups.details.push(field);
      } else {
        groups.other.push(field);
      }
    });

    // Remove empty groups
    Object.keys(groups).forEach(key => {
      if (groups[key].length === 0) {
        delete groups[key];
      }
    });

    return groups;
  }, [template.fields]);

  // Create validation schema from template fields
  const validationSchema = createValidationSchema(template);

  // Initialize form with react-hook-form and zod validation
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: template.fields.reduce((acc, field) => {
      acc[field.id] = '';
      return acc;
    }, {} as Record<string, any>),
    mode: "onChange"
  });

  // Watch all form values for preview
  const formValues = watch();

  // Generate document preview
  const documentPreview = getTemplatePreview(template, formValues);

  // Set default document number if it exists
  useEffect(() => {
    if (template.fields.some(field => field.id === 'documentNumber')) {
      setValue('documentNumber', `${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`);
    }

    // Set default dates to today if they exist
    template.fields.forEach(field => {
      if (field.type === 'date' && !formValues[field.id]) {
        setValue(field.id, format(new Date(), 'yyyy-MM-dd'));
      }
    });
  }, [template.fields, setValue, formValues]);

  // Handle form submission
  const handleFormSubmit = (data: Record<string, any>) => {
    onSubmit(data);
  };

  // Get field label with proper formatting
  const getFieldLabel = (field: Template['fields'][0]) => {
    // Try to make the field name more human-readable if it's not already
    let label = field.name;
    if (label === field.id) {
      // Convert camelCase or snake_case to Title Case with spaces
      label = field.id
        .replace(/([A-Z])/g, ' $1') // Insert space before capital letters
        .replace(/_/g, ' ') // Replace underscores with spaces
        .replace(/^\w/, c => c.toUpperCase()); // Capitalize first letter
    }
    return label;
  };

  return (
    <div className="container mx-auto py-6">
      <Tabs defaultValue="form" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="form">{t("Fill Form")}</TabsTrigger>
          <TabsTrigger value="preview">{t("Document Preview")}</TabsTrigger>
        </TabsList>

        {/* Form Tab */}
        <TabsContent value="form">
          <Card>
            <CardHeader>
              <CardTitle>{template.title}</CardTitle>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <form id="template-form" onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
                {/* Render fields by groups */}
                {Object.entries(fieldGroups).map(([groupKey, fields]) => (
                  <div key={groupKey} className="space-y-4">
                    <div className="flex items-center">
                      <h3 className="text-lg font-medium">
                        {t(groupKey.charAt(0).toUpperCase() + groupKey.slice(1))}
                      </h3>
                      <div className="h-px flex-1 bg-border ml-3"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {fields.map((field) => (
                        <div key={field.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor={field.id} className="flex items-center">
                              {getFieldLabel(field)}
                              {field.required && <span className="text-destructive ml-1">*</span>}
                            </Label>

                            {field.placeholder && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-6 w-6">
                                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                      <span className="sr-only">{t("Help")}</span>
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{t("Example")}: {field.placeholder}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>

                          {/* Render different input types based on field type */}
                          {field.type === 'text' && (
                            <Controller
                              name={field.id}
                              control={control}
                              render={({ field: formField }) => (
                                <div className="relative">
                                  <Input
                                    id={field.id}
                                    placeholder={field.placeholder}
                                    className={errors[field.id] ? "border-destructive" : ""}
                                    {...formField}
                                  />
                                  {errors[field.id] && (
                                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                                      <AlertCircle className="h-4 w-4 text-destructive" />
                                    </div>
                                  )}
                                </div>
                              )}
                            />
                          )}

                          {field.type === 'textarea' && (
                            <Controller
                              name={field.id}
                              control={control}
                              render={({ field: formField }) => (
                                <Textarea
                                  id={field.id}
                                  placeholder={field.placeholder}
                                  rows={4}
                                  className={errors[field.id] ? "border-destructive" : ""}
                                  {...formField}
                                />
                              )}
                            />
                          )}

                          {field.type === 'number' && (
                            <Controller
                              name={field.id}
                              control={control}
                              render={({ field: formField }) => (
                                <div className="relative">
                                  <Input
                                    id={field.id}
                                    type="number"
                                    placeholder={field.placeholder}
                                    className={errors[field.id] ? "border-destructive" : ""}
                                    {...formField}
                                  />
                                  {errors[field.id] && (
                                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                                      <AlertCircle className="h-4 w-4 text-destructive" />
                                    </div>
                                  )}
                                </div>
                              )}
                            />
                          )}

                          {field.type === 'date' && (
                            <Controller
                              name={field.id}
                              control={control}
                              render={({ field: formField }) => (
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !formField.value && "text-muted-foreground",
                                        errors[field.id] && "border-destructive"
                                      )}
                                    >
                                      <CalendarIcon className="mr-2 h-4 w-4" />
                                      {formField.value ? format(new Date(formField.value), 'PPP', { locale: ru }) : <span>{t("Select date")}</span>}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0">
                                    <Calendar
                                      mode="single"
                                      selected={formField.value ? new Date(formField.value) : undefined}
                                      onSelect={(date) => formField.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                              )}
                            />
                          )}

                          {field.type === 'select' && field.options && (
                            <Controller
                              name={field.id}
                              control={control}
                              render={({ field: formField }) => (
                                <Select
                                  onValueChange={formField.onChange}
                                  defaultValue={formField.value}
                                >
                                  <SelectTrigger className={errors[field.id] ? "border-destructive" : ""}>
                                    <SelectValue placeholder={t("Select option")} />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {field.options?.map((option) => (
                                      <SelectItem key={option} value={option}>
                                        {option}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                            />
                          )}

                          {/* Display error message if any */}
                          {errors[field.id] && (
                            <p className="text-sm text-destructive mt-1">
                              {errors[field.id]?.message as string}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </form>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-2">
              <Button 
                type="submit" 
                form="template-form" 
                disabled={isSubmitting || !isValid}
                className="w-full"
              >
                {isSubmitting ? t("Creating document...") : t("Create document")}
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setActiveTab("preview")}
                className="w-full"
              >
                {t("Preview")}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>{t("Document Preview")}</CardTitle>
              <CardDescription>
                {t("This is how your document will look when generated")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[60vh] rounded-md border p-4 bg-white">
                <DocumentPreview 
                  template={{
                    id: template.id,
                    title: template.title,
                    description: template.description,
                    content: template.content
                  }} 
                  values={formValues} 
                />
              </ScrollArea>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-2">
              <Button 
                type="submit" 
                form="template-form" 
                disabled={isSubmitting || !isValid}
                className="w-full"
              >
                {isSubmitting ? t("Creating document...") : t("Create document")}
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setActiveTab("form")}
                className="w-full"
              >
                {t("Back to form")}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
