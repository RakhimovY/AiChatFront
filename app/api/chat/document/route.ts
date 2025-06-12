import { NextRequest } from 'next/server';
import { withAuth, createSuccessResponse, createErrorResponse, isAuthError } from '@/lib/apiUtils';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
 * Handler for POST /api/chat/document
 * This endpoint forwards the request to send a message with a document
 */
export async function POST(req: NextRequest) {
  return withAuth(req, async (token) => {
    try {
      const formData = await req.formData();
      const response = await fetch(`${API_URL}/chat/document`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error, 'Failed to send document message');
    }
  });
}
