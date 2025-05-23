import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

/**
 * Handler for GET /api/chat/[chatId]
 * This endpoint forwards the request to get chat history for a specific chat
 */
export async function GET(
  req: NextRequest,
  context: { params: { chatId: string } }
) {
  try {
    // Get the session to access the token
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const chatId = context.params.chatId;

    // Forward the request to the backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/${chatId}`, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    // Check if response is 401 Unauthorized
    if (response.status === 401) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Get the response data
    const data = await response.json();

    // Return the response from the backend
    return new Response(
      JSON.stringify(data),
      { 
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error fetching chat history:', error);

    // Check if it's an authentication error (401)
    // This handles cases where the error object might contain response info
    if (
      error && 
      typeof error === 'object' && 
      ('status' in error && error.status === 401 || 
       'response' in error && error.response?.status === 401)
    ) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Return an error response
    return new Response(
      JSON.stringify({ error: 'Failed to fetch chat history' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

/**
 * Handler for DELETE /api/chat/[chatId]
 * This endpoint forwards the request to delete a specific chat
 */
export async function DELETE(
  req: NextRequest,
  context: { params: { chatId: string } }
) {
  try {
    // Get the session to access the token
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const chatId = context.params.chatId;

    // Forward the request to the backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/${chatId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    // Check if response is 401 Unauthorized
    if (response.status === 401) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Return the response from the backend
    return new Response(
      null,
      { 
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error deleting chat:', error);

    // Check if it's an authentication error (401)
    // This handles cases where the error object might contain response info
    if (
      error && 
      typeof error === 'object' && 
      ('status' in error && error.status === 401 || 
       'response' in error && error.response?.status === 401)
    ) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Return an error response
    return new Response(
      JSON.stringify({ error: 'Failed to delete chat' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
