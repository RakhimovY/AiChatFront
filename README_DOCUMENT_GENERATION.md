# Document Generation Feature

## Quick Start

The document generation feature allows users to create legal documents based on predefined templates. This README provides a quick overview of the feature and links to more detailed documentation.

## Feature Overview

- Browse and select from a variety of legal document templates
- Fill in template fields through a user-friendly form interface
- Preview documents in real-time as you fill in the form
- Export documents in PDF or DOCX format
- Manage your created documents (view, edit, delete)

## Directory Structure

```
app/
├── web/                          # Main document generation routes
│   ├── layout.tsx                # Layout for all document pages
│   ├── page.tsx                  # Main document landing page
│   ├── templates/                # Template browsing
│   │   └── page.tsx              # Templates list page
│   ├── editor/                   # Document editing
│   │   └── page.tsx              # Editor page
│   └── documents/                # Document management
│       └── page.tsx              # Documents list page
│
components/
├── web/                          # Document-related components
│   ├── TemplateList.tsx          # Template browsing component
│   ├── DocumentEditor.tsx        # Document editing component
│   └── DocumentPreview.tsx       # Document preview component
│
lib/
├── store/
│   └── webStore.ts               # Zustand store for document state
├── data/
│   ├── templates.ts              # Mock template data
│   └── documents.ts              # Mock document data
│
app/api/web/                      # API routes for document generation
├── templates/                    # Template API endpoints
│   ├── route.ts                  # GET /api/web/templates
│   └── [id]/
│       └── route.ts              # GET /api/web/templates/[id]
├── documents/                    # Document API endpoints
│   ├── route.ts                  # GET, POST /api/web/documents
│   ├── [id]/
│   │   └── route.ts              # GET, PUT, DELETE /api/web/documents/[id]
│   └── export/
│       └── route.ts              # POST /api/web/documents/export
```

## Key Components

### TemplateList

Displays a list of available templates with filtering and search capabilities.

```tsx
<TemplateList initialTemplates={templates} />
```

### DocumentEditor

Form interface for filling in template fields with validation.

```tsx
<DocumentEditor 
  templateId="template-id" 
  onSave={handleSave} 
/>
```

### DocumentPreview

Real-time preview of the document being created.

```tsx
<DocumentPreview 
  template={template} 
  values={formValues} 
/>
```

## State Management

The document generation feature uses Zustand for state management. The store is defined in `lib/store/webStore.ts` and provides actions for:

- Managing templates and documents
- Handling form state and validation
- Tracking history for undo/redo functionality

Example usage:

```tsx
const { 
  templates, 
  fetchTemplates, 
  updateFormValue, 
  saveDocument 
} = useWebStore();

// Fetch templates on component mount
useEffect(() => {
  fetchTemplates();
}, [fetchTemplates]);
```

## API Endpoints

### Templates

- `GET /api/web/templates` - List all available templates
- `GET /api/web/templates/[id]` - Get a specific template

### Documents

- `GET /api/web/documents` - List user's documents
- `GET /api/web/documents/[id]` - Get a specific document
- `POST /api/web/documents` - Create a new document
- `PUT /api/web/documents/[id]` - Update an existing document
- `DELETE /api/web/documents/[id]` - Delete a document

### Export

- `POST /api/web/documents/export` - Export a document in PDF or DOCX format

## Detailed Documentation

For more detailed information, please refer to:

- [Document Generation - Implementation Summary](./DOCUMENT_GENERATION_SUMMARY.md) - Comprehensive overview of the implementation
- [Document Generation - Testing and Deployment Guide](./DOCUMENT_GENERATION_TESTING.md) - Guide for testing and deploying the feature

## Contributing

When contributing to the document generation feature, please:

1. Follow the existing code style and architecture
2. Add appropriate tests for new functionality
3. Update documentation as needed
4. Consider the future improvements listed in the summary document

## License

This feature is part of the AIuris application and is subject to the same license terms as the main project.