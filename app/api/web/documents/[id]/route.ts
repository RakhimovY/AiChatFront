import { NextRequest } from 'next/server';
import { withAuth, createSuccessResponse, createErrorResponse, isAuthError } from '@/lib/apiUtils';

/**
 * Handler for GET /api/web/documents/[id]
 * This endpoint forwards the request to get a specific document by ID
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(req, async (token) => {
    try {
      const id = params.id;

      // Forward the request to the backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/web/documents/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Check if response is 401 Unauthorized
      if (response.status === 401) {
        return createErrorResponse('Unauthorized', 401);
      }

      // Check if response is 404 Not Found
      if (response.status === 404) {
        return createErrorResponse('Document not found', 404);
      }

      // Get the response data
      const data = await response.json();

      // Return the response from the backend
      return createSuccessResponse(data, response.status);
    } catch (error) {
      console.error('Error fetching document:', error);

      if (isAuthError(error)) {
        return createErrorResponse('Unauthorized', 401);
      }

      return createErrorResponse('Failed to fetch document', 500);
    }
  });
}

/**
 * Handler for PUT /api/web/documents/[id]
 * This endpoint forwards the request to update a specific document
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(req, async (token) => {
    try {
      const id = params.id;

      // Get the request body
      const body = await req.json();

      // Forward the request to the backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/web/documents/${id}`, {
        method: 'PUT',
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

      // Check if response is 404 Not Found
      if (response.status === 404) {
        return createErrorResponse('Document not found', 404);
      }

      // Check if response is 400 Bad Request
      if (response.status === 400) {
        const errorData = await response.json();
        return createErrorResponse(errorData.error || 'Invalid request', 400);
      }

      // Get the response data
      const data = await response.json();

      // Return the response from the backend
      return createSuccessResponse(data, response.status);
    } catch (error) {
      console.error('Error updating document:', error);

      if (isAuthError(error)) {
        return createErrorResponse('Unauthorized', 401);
      }

      return createErrorResponse('Failed to update document', 500);
    }
  });
}

/**
 * Handler for DELETE /api/web/documents/[id]
 * This endpoint forwards the request to delete a specific document
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(req, async (token) => {
    try {
      const id = params.id;

      // Forward the request to the backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/web/documents/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Check if response is 401 Unauthorized
      if (response.status === 401) {
        return createErrorResponse('Unauthorized', 401);
      }

      // Check if response is 404 Not Found
      if (response.status === 404) {
        return createErrorResponse('Document not found', 404);
      }

      // If the response is 204 No Content or 200 OK, return success
      if (response.status === 204 || response.status === 200) {
        return createSuccessResponse({ success: true }, 200);
      }

      // For other status codes, try to parse the response
      try {
        const data = await response.json();
        return createSuccessResponse(data, response.status);
      } catch (e) {
        // If we can't parse the response, just return success
        return createSuccessResponse({ success: true }, 200);
      }
    } catch (error) {
      console.error('Error deleting document:', error);

      if (isAuthError(error)) {
        return createErrorResponse('Unauthorized', 401);
      }

      return createErrorResponse('Failed to delete document', 500);
    }
  });
}
