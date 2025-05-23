import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

/**
 * Handler for POST /api/chat/document
 * This endpoint forwards document upload requests to the backend
 */
export async function POST(req: NextRequest) {
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

    // Get the form data from the request
    const formData = await req.formData();
    
    // Forward the request to the backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/ask-with-document`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`
        // Don't set Content-Type here, it will be set automatically with the boundary
      },
      body: formData
    });

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
    console.error('Error sending message with document:', error);

    // Return an error response
    return new Response(
      JSON.stringify({ error: 'Failed to send message with document' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}