import { NextRequest } from 'next/server';
import { withAuth, createSuccessResponse, createErrorResponse, isAuthError } from '@/lib/apiUtils';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json'
} as const;

const handleApiResponse = async (response: Response) => {
  if (response.status === 401) {
    return createErrorResponse('Unauthorized', 401);
  }
  const data = await response.json();
  return createSuccessResponse(data, response.status);
};

const handleApiError = (error: unknown, errorMessage: string) => {
  console.error(errorMessage, error);
  if (isAuthError(error)) {
    return createErrorResponse('Unauthorized', 401);
  }
  return createErrorResponse(errorMessage, 500);
};

/**
 * Handler for GET /subscriptions
 * This endpoint forwards the request to the backend API
 */
export async function GET(req: NextRequest) {
  return withAuth(req, async (token) => {
    try {
      const response = await fetch(`${API_URL}/subscriptions`, {
        headers: {
          ...DEFAULT_HEADERS,
          'Authorization': `Bearer ${token}`
        }
      });
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error, 'Failed to fetch subscriptions');
    }
  });
}
