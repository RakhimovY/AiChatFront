import { NextRequest } from 'next/server';
import { withAuth, createSuccessResponse, createErrorResponse, isAuthError } from '@/lib/apiUtils';

/**
 * Handler for GET /api/web/documents
 * This endpoint forwards the request to get all user documents
 */
export async function GET(req: NextRequest) {
  return withAuth(req, async (token) => {
    try {
      // Forward the request to the backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/web/documents`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Check if response is 401 Unauthorized
      if (response.status === 401) {
        return createErrorResponse('Unauthorized', 401);
      }

      // Get the response data
      const data = await response.json();

      // Return the response from the backend
      return createSuccessResponse(data, response.status);
    } catch (error) {
      console.error('Error fetching documents:', error);

      if (isAuthError(error)) {
        return createErrorResponse('Unauthorized', 401);
      }

      return createErrorResponse('Failed to fetch documents', 500);
    }
  });
}

/**
 * Handler for POST /api/web/documents
 * This endpoint forwards the request to create a new document
 */
export async function POST(req: NextRequest) {
  return withAuth(req, async (token) => {
    try {
      // Get the request body
      const body = await req.json();

      // Forward the request to the backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/web/documents`, {
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

      // Get the response data
      const data = await response.json();

      // Return the response from the backend
      return createSuccessResponse(data, response.status);
    } catch (error) {
      console.error('Error creating document:', error);

      if (isAuthError(error)) {
        return createErrorResponse('Unauthorized', 401);
      }

      return createErrorResponse('Failed to create document', 500);
    }
  });
}
