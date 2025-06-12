import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json'
};

const createResponse = (data: unknown, status: number) => 
  new Response(JSON.stringify(data), { 
    status,
    headers: DEFAULT_HEADERS
  });

/**
 * Handler for GET /chat/user
 * This endpoint forwards the request to the backend API
 * to get all chats for the current user
 */
export async function GET(req: NextRequest) {
  try {
    // Get the session to access the token
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
      return createResponse(
        { error: 'Unauthorized: Please log in to access this resource' },
        401
      );
    }

    // Forward the request to the backend
    const response = await fetch(`${API_URL}/chat/user`, {
      headers: {
        ...DEFAULT_HEADERS,
        'Authorization': `Bearer ${session.accessToken}`
      }
    });

    // Get the response data
    const data = await response.json();

    // Return the response from the backend
    return createResponse(data, response.status);
  } catch (error) {
    console.error('Error fetching user chats:', error);

    // Return an error response
    return createResponse(
      { error: 'Failed to fetch user chats' },
      500
    );
  }
}
