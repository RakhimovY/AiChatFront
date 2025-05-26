import { NextRequest, NextResponse } from 'next/server';
import { withAuth, createErrorResponse, isAuthError } from '@/lib/apiUtils';

/**
 * Handler for POST /api/web/documents/export
 * This endpoint forwards the request to export a document
 */
export async function POST(req: NextRequest) {
  return withAuth(req, async (token) => {
    try {
      // Get the request body
      const body = await req.json();

      // Validate required fields
      if (!body.templateId || !body.values || !body.format) {
        return createErrorResponse('Missing required fields: templateId, values, format', 400);
      }

      // Validate format
      if (body.format !== 'pdf' && body.format !== 'docx') {
        return createErrorResponse('Invalid format. Supported formats: pdf, docx', 400);
      }

      // Forward the request to the backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/web/documents/export`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      // Check if response is 401 Unauthorized
      if (response.status === 401) {
        return createErrorResponse('Unauthorized', 401);
      }

      // Check if response is 400 Bad Request
      if (response.status === 400) {
        const errorData = await response.json();
        return createErrorResponse(errorData.error || 'Invalid request', 400);
      }

      // Check if response is 404 Not Found
      if (response.status === 404) {
        return createErrorResponse('Template not found', 404);
      }

      // Get the response as a blob
      const blob = await response.blob();

      // Get the content type and filename from the response headers
      const contentType = response.headers.get('Content-Type') || 
        (body.format === 'pdf' 
          ? 'application/pdf' 
          : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');

      const contentDisposition = response.headers.get('Content-Disposition') || 
        `attachment; filename="document.${body.format}"`;

      // Return the file
      return new NextResponse(blob, {
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': contentDisposition
        }
      });
    } catch (error) {
      console.error('Error exporting document:', error);

      if (isAuthError(error)) {
        return createErrorResponse('Unauthorized', 401);
      }

      return createErrorResponse('Failed to export document', 500);
    }
  });
}
