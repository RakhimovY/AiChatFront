# Backend API Endpoints for Document Generation

This document defines the API endpoints that need to be implemented in the backend service to support the document generation functionality in the AIuris application.

## Base URL

All endpoints are relative to the base URL: `${process.env.NEXT_PUBLIC_API_URL}`

## Authentication

All endpoints require authentication. The authentication token should be provided in the `Authorization` header as a Bearer token:

```
Authorization: Bearer <token>
```

## Endpoints

### Templates

#### GET /web/templates

Get a list of all available templates.

**Response:**
- Status: 200 OK
- Body: Array of template objects
```json
[
  {
    "id": "string",
    "title": "string",
    "description": "string",
    "category": "string",
    "previewImage": "string (optional)"
  }
]
```

#### GET /web/templates/{id}

Get a specific template by ID.

**Parameters:**
- `id`: Template ID (path parameter)

**Response:**
- Status: 200 OK
- Body: Template object with fields
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "category": "string",
  "fields": [
    {
      "id": "string",
      "name": "string",
      "label": "string",
      "type": "text | textarea | select | date | checkbox | radio",
      "required": "boolean",
      "description": "string (optional)",
      "placeholder": "string (optional)",
      "defaultValue": "any (optional)",
      "options": [
        {
          "value": "string",
          "label": "string"
        }
      ] // Only for select and radio types
    }
  ],
  "content": "string (template content with placeholders)",
  "previewImage": "string (optional)"
}
```

### Documents

#### GET /web/documents

Get a list of all documents created by the current user.

**Response:**
- Status: 200 OK
- Body: Array of document objects
```json
[
  {
    "id": "string",
    "title": "string",
    "templateId": "string",
    "templateName": "string",
    "createdAt": "string (ISO date)",
    "updatedAt": "string (ISO date)"
  }
]
```

#### GET /web/documents/{id}

Get a specific document by ID.

**Parameters:**
- `id`: Document ID (path parameter)

**Response:**
- Status: 200 OK
- Body: Document object with values
```json
{
  "id": "string",
  "title": "string",
  "templateId": "string",
  "templateName": "string",
  "values": {
    "fieldId1": "value1",
    "fieldId2": "value2"
  },
  "createdAt": "string (ISO date)",
  "updatedAt": "string (ISO date)"
}
```

#### POST /web/documents

Create a new document.

**Request:**
```json
{
  "templateId": "string",
  "title": "string (optional)",
  "values": {
    "fieldId1": "value1",
    "fieldId2": "value2"
  }
}
```

**Response:**
- Status: 201 Created
- Body: Created document object
```json
{
  "id": "string",
  "title": "string",
  "templateId": "string",
  "templateName": "string",
  "values": {
    "fieldId1": "value1",
    "fieldId2": "value2"
  },
  "createdAt": "string (ISO date)",
  "updatedAt": "string (ISO date)"
}
```

#### PUT /web/documents/{id}

Update an existing document.

**Parameters:**
- `id`: Document ID (path parameter)

**Request:**
```json
{
  "title": "string (optional)",
  "values": {
    "fieldId1": "value1",
    "fieldId2": "value2"
  }
}
```

**Response:**
- Status: 200 OK
- Body: Updated document object
```json
{
  "id": "string",
  "title": "string",
  "templateId": "string",
  "templateName": "string",
  "values": {
    "fieldId1": "value1",
    "fieldId2": "value2"
  },
  "createdAt": "string (ISO date)",
  "updatedAt": "string (ISO date)"
}
```

#### DELETE /web/documents/{id}

Delete a document.

**Parameters:**
- `id`: Document ID (path parameter)

**Response:**
- Status: 200 OK or 204 No Content
- Body (if 200 OK): 
```json
{
  "success": true
}
```

### Export

#### POST /web/documents/export

Export a document as PDF or DOCX.

**Request:**
```json
{
  "templateId": "string",
  "values": {
    "fieldId1": "value1",
    "fieldId2": "value2"
  },
  "format": "pdf | docx"
}
```

**Response:**
- Status: 200 OK
- Headers:
  - `Content-Type`: `application/pdf` or `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
  - `Content-Disposition`: `attachment; filename="document.pdf"` or `attachment; filename="document.docx"`
- Body: Binary file content

## Error Responses

All endpoints should return appropriate error responses in the following format:

```json
{
  "error": "Error message"
}
```

Common error status codes:
- 400 Bad Request: Invalid request parameters
- 401 Unauthorized: Missing or invalid authentication token
- 404 Not Found: Resource not found
- 500 Internal Server Error: Server error

## Implementation Notes

1. The backend service should validate all request parameters and return appropriate error messages.
2. The backend service should handle authentication and authorization to ensure users can only access their own documents.
3. For document export, the backend service should generate the actual PDF or DOCX file based on the template and values.
4. The backend service should store templates and documents in a database.
5. The backend service should handle file storage for template preview images.