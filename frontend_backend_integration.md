# Frontend-Backend Integration for Document Generation

This document explains the changes made to the frontend API routes and provides guidance on how to implement the backend service for the document generation functionality in the AIuris application.

## Overview

The document generation functionality in the AIuris application consists of two main components:

1. **Frontend API Routes**: These are Next.js API routes that act as a proxy between the frontend and the backend service. They handle authentication, forward requests to the backend service, and format responses for the frontend.

2. **Backend Service**: This is a separate service that handles the actual business logic, data persistence, and document generation. It exposes RESTful API endpoints that the frontend API routes call.

## Frontend API Routes

The following API routes have been implemented in the Next.js application:

- `GET /api/web/templates` - List all templates
- `GET /api/web/templates/[id]` - Get specific template
- `GET /api/web/documents` - List user documents
- `POST /api/web/documents` - Create new document
- `GET /api/web/documents/[id]` - Get specific document
- `PUT /api/web/documents/[id]` - Update document
- `DELETE /api/web/documents/[id]` - Delete document
- `POST /api/web/documents/export` - Export document as PDF/DOCX

These routes use the following utility functions from `lib/apiUtils.ts`:

- `withAuth`: Handles authentication and forwards the request to the handler function
- `createSuccessResponse`: Creates a standardized success response
- `createErrorResponse`: Creates a standardized error response
- `isAuthError`: Checks if an error is an authentication error

All routes follow a similar pattern:

1. Use the `withAuth` utility function to handle authentication
2. Forward the request to the backend service at `${process.env.NEXT_PUBLIC_API_URL}/web/...`
3. Handle the response from the backend service
4. Return the response to the frontend

## Backend Service Implementation

The backend service needs to implement the API endpoints defined in the `backend_api_endpoints.md` document. Here are some guidelines for implementing the backend service:

### Technology Stack

The backend service can be implemented using any technology stack that can expose RESTful API endpoints. Some options include:

- Node.js with Express
- Java with Spring Boot
- Python with Flask or Django
- .NET with ASP.NET Core

### Database

The backend service needs to store templates and documents in a database. Some options include:

- MongoDB: A NoSQL database that works well with document-oriented data
- PostgreSQL: A relational database with JSON support
- MySQL: A relational database

### Document Generation

For document generation, the backend service needs to:

1. Retrieve the template from the database
2. Replace placeholders in the template with the provided values
3. Generate a PDF or DOCX file based on the processed template

Some libraries that can help with document generation:

- **PDF Generation**:
  - PDFKit (Node.js)
  - iText (Java)
  - ReportLab (Python)
  - iTextSharp (.NET)

- **DOCX Generation**:
  - docx (Node.js)
  - Apache POI (Java)
  - python-docx (Python)
  - Open XML SDK (.NET)

### Authentication and Authorization

The backend service should:

1. Validate the authentication token provided in the `Authorization` header
2. Ensure users can only access their own documents
3. Return appropriate error responses for unauthorized requests

### Error Handling

The backend service should:

1. Validate all request parameters
2. Return appropriate error responses with clear error messages
3. Log errors for debugging purposes

## Environment Variables

The frontend API routes use the following environment variable:

- `NEXT_PUBLIC_API_URL`: The base URL of the backend service

Make sure this environment variable is set correctly in the `.env.local` file.

## Testing

To test the integration between the frontend and backend:

1. Start the backend service
2. Set the `NEXT_PUBLIC_API_URL` environment variable to point to the backend service
3. Start the Next.js application
4. Use the document generation functionality in the frontend
5. Verify that the requests are forwarded to the backend service and the responses are handled correctly

## Next Steps

1. Implement the backend service according to the API contract defined in `backend_api_endpoints.md`
2. Set up the database for storing templates and documents
3. Implement document generation functionality
4. Test the integration between the frontend and backend
5. Deploy the backend service and update the environment variables in the frontend application