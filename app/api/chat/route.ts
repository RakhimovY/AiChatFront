import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { 
  createUnauthorizedResponse, 
  createSuccessResponse, 
  createErrorResponse,
  isAuthenticationError
} from '@/lib/apiUtils';

/**
 * Handler for GET /api/chat
 * This endpoint forwards the request to get all user chats
 */
export async function GET(req: NextRequest) {
  try {
    // Get the session to access the token
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
      return createUnauthorizedResponse();
    }

    // Forward the request to the backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/user`, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    // Check if response is 401 Unauthorized
    if (response.status === 401) {
      return createUnauthorizedResponse();
    }

    // Get the response data
    const data = await response.json();

    // Return the response from the backend
    return createSuccessResponse(data, response.status);
  } catch (error) {
    console.error('Error fetching user chats:', error);

    // Check if it's an authentication error
    if (isAuthenticationError(error)) {
      return createUnauthorizedResponse();
    }

    // Return an error response
    return createErrorResponse('Failed to fetch user chats');
  }
}
