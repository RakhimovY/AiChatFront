import { NextRequest } from 'next/server';
import { withAuth, createSuccessResponse, createErrorResponse, isAuthError } from '@/lib/apiUtils';

/**
 * Handler for GET /api/web/templates/[id]
 * This endpoint forwards the request to get a specific template by ID
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(req, async (token) => {
    try {
      const id = params.id;

      // Forward the request to the backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/web/templates/${id}`, {
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
        return createErrorResponse('Template not found', 404);
      }

      // Get the response data
      const data = await response.json();

      // Return the response from the backend
      return createSuccessResponse(data, response.status);
    } catch (error) {
      console.error('Error fetching template:', error);

      if (isAuthError(error)) {
        return createErrorResponse('Unauthorized', 401);
      }

      return createErrorResponse('Failed to fetch template', 500);
    }
  });
}
