import { NextRequest } from 'next/server';
import { withAuth, createSuccessResponse, createErrorResponse, isAuthError } from '@/lib/apiUtils';

/**
 * Handler for GET /api/web/templates
 * This endpoint forwards the request to get all templates
 */
export async function GET(req: NextRequest) {
  return withAuth(req, async (token) => {
    try {
      // Forward the request to the backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/web/templates`, {
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
      console.error('Error fetching templates:', error);

      if (isAuthError(error)) {
        return createErrorResponse('Unauthorized', 401);
      }

      return createErrorResponse('Failed to fetch templates', 500);
    }
  });
}
