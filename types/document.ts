// Field type definitions
export interface FieldBase {
    id: string;
    name: string;
    label: string;
    required: boolean;
    description?: string;
}

export interface TextField extends FieldBase {
    type: "text" | "email" | "number" | "tel";
    placeholder?: string;
    defaultValue?: string;
    maxLength?: number;
}

export interface TextareaField extends FieldBase {
    type: "textarea";
    placeholder?: string;
    defaultValue?: string;
    rows?: number;
}

export interface SelectField extends FieldBase {
    type: "select";
    options: { value: string; label: string }[];
    defaultValue?: string;
}

export interface DateField extends FieldBase {
    type: "date";
    defaultValue?: string;
}

export interface CheckboxField extends FieldBase {
    type: "checkbox";
    defaultValue?: boolean;
}

export interface RadioField extends FieldBase {
    type: "radio";
    options: { value: string; label: string }[];
    defaultValue?: string;
}

export type Field = TextField | TextareaField | SelectField | DateField | CheckboxField | RadioField;

// Template type definition
export interface Template {
    id: string;
    title: string;
    description: string;
    category: string;
    fields: Field[];
    content: string; // Template content with placeholders
    previewImage?: string;
    createdAt: string;
    updatedAt: string;
}

// Document type definition
export interface Document {
    id: string;
    title: string;
    templateId: string;
    templateName: string;
    values: DocumentValues;
    createdAt: string;
    updatedAt: string;
    version: number;
}

// Document values type
export type DocumentValues = Record<string, any>;

// Document version type
export interface DocumentVersion {
    id: string;
    documentId: string;
    version: number;
    values: DocumentValues;
    createdAt: string;
    createdBy: string;
}

// Export format type
export type ExportFormat = 'pdf' | 'docx';

// Document export options
export interface DocumentExportOptions {
    format: ExportFormat;
    includeMetadata?: boolean;
    watermark?: string;
    password?: string;
}

// Template categories
export type TemplateCategory =
    | "real_estate_sale"    // Договор купли-продажи недвижимости
    | "real_estate_lease"   // Договор аренды жилья
    | "legal"              // Общие юридические документы
    | "business"           // Бизнес документы
    | "personal"           // Личные документы
    | "other";             // Прочее 