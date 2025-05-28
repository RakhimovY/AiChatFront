import { NextRequest } from 'next/server';
import { withAuth, createSuccessResponse, createErrorResponse, isAuthError } from '@/lib/apiUtils';

/**
 * Handler for GET /api/user
 * This endpoint retrieves user information
 */
export async function GET(req: NextRequest) {
  return withAuth(req, async (token) => {
    try {
      // Forward the request to the backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        return createErrorResponse('Unauthorized', 401);
      }

      const data = await response.json();

      return createSuccessResponse(data, response.status);
    } catch (error) {
      console.error('Error retrieving user information:', error);

      if (isAuthError(error)) {
        return createErrorResponse('Unauthorized', 401);
      }

      return createErrorResponse('Failed to retrieve user information', 500);
    }
  });
}
