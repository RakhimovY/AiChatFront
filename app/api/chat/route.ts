import { NextRequest } from 'next/server';
import { withAuth, createSuccessResponse, createErrorResponse, isAuthError } from '@/lib/apiUtils';

/**
 * Handler for GET /api/chat
 * This endpoint forwards the request to get all user chats
 */
export async function GET(req: NextRequest) {
  return withAuth(req, async (token) => {
    try {
      // Forward the request to the backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/user`, {
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
      console.error('Error fetching user chats:', error);

      if (isAuthError(error)) {
        return createErrorResponse('Unauthorized', 401);
      }

      return createErrorResponse('Failed to fetch user chats', 500);
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
      // Get the request body
      const body = await req.json();

      // Forward the request to the backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/ask`, {
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

      // Get the response data
      const data = await response.json();

      // Return the response from the backend
      return createSuccessResponse(data, response.status);
    } catch (error) {
      console.error('Error sending message:', error);

      if (isAuthError(error)) {
        return createErrorResponse('Unauthorized', 401);
      }

      return createErrorResponse('Failed to send message', 500);
    }
  });
}
