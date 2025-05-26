import { NextRequest } from 'next/server';
import { withAuth, createSuccessResponse, createErrorResponse, isAuthError } from '@/lib/apiUtils';

/**
 * Handler for GET /api/chat/[chatId]
 * This endpoint forwards the request to get chat history for a specific chat
 */
export async function GET(
  req: NextRequest,
  context: { params: { chatId: string } }
) {
  return withAuth(req, async (token) => {
    try {
      const chatId = context.params.chatId;

      // Forward the request to the backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/${chatId}`, {
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
      console.error('Error fetching chat history:', error);

      if (isAuthError(error)) {
        return createErrorResponse('Unauthorized', 401);
      }

      return createErrorResponse('Failed to fetch chat history', 500);
    }
  });
}

/**
 * Handler for DELETE /api/chat/[chatId]
 * This endpoint forwards the request to delete a specific chat
 */
export async function DELETE(
  req: NextRequest,
  context: { params: { chatId: string } }
) {
  return withAuth(req, async (token) => {
    try {
      const chatId = context.params.chatId;

      // Forward the request to the backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/${chatId}`, {
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

      // Return the response from the backend (empty response for DELETE)
      return createSuccessResponse(null, response.status);
    } catch (error) {
      console.error('Error deleting chat:', error);

      if (isAuthError(error)) {
        return createErrorResponse('Unauthorized', 401);
      }

      return createErrorResponse('Failed to delete chat', 500);
    }
  });
}
