import { NextRequest } from 'next/server';
import { withAuth, createSuccessResponse, createErrorResponse, isAuthError } from '@/lib/apiUtils';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json'
};

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
 * Handler for GET /api/chat
 * This endpoint forwards the request to get all user chats
 */
export async function GET(req: NextRequest) {
  return withAuth(req, async (token) => {
    try {
      const response = await fetch(`${API_URL}/chat/user`, {
        headers: {
          ...DEFAULT_HEADERS,
          'Authorization': `Bearer ${token}`
        }
      });
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error, 'Failed to fetch user chats');
    }
  });
}

/**
 * Handler for POST /api/chat
 * This endpoint forwards the request to send a message
 */
export async function POST(req: NextRequest) {
  return withAuth(req, async (token) => {
    try {
      const body = await req.json();
      const response = await fetch(`${API_URL}/chat/ask`, {
        method: 'POST',
        headers: {
          ...DEFAULT_HEADERS,
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error, 'Failed to send message');
    }
  });
}
