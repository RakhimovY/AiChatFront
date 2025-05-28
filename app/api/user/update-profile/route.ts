import { NextRequest } from 'next/server';
import { withAuth, createSuccessResponse, createErrorResponse, isAuthError } from '@/lib/apiUtils';

/**
 * Handler for POST /api/user/update-profile
 * This endpoint forwards the request to update user profile
 */
export async function POST(req: NextRequest) {
  return withAuth(req, async (token) => {
    try {
      const body = await req.json();

      // Forward the request to the backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/update-profile`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (response.status === 401) {
        return createErrorResponse('Unauthorized', 401);
      }

      const data = await response.json();

      return createSuccessResponse(data, response.status);
    } catch (error) {
      console.error('Error updating user profile:', error);

      if (isAuthError(error)) {
        return createErrorResponse('Unauthorized', 401);
      }

      return createErrorResponse('Failed to update user profile', 500);
    }
  });
}