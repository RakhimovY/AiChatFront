import { NextRequest } from 'next/server';
import axios from 'axios';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

/**
 * Handler for POST /api/subscriptions/cancel
 * This endpoint forwards the request to the backend API
 */
export async function POST(req: NextRequest) {
  try {
    // Get the session to verify the user is authenticated
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Parse the request body
    const body = await req.json();

    // Forward the request to the backend
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/subscriptions/cancel`,
      body,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.accessToken}`,
        },
      }
    );

    // Return the response from the backend
    return new Response(
      JSON.stringify(response.data),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error canceling subscription:', error);

    // Return an error response
    return new Response(
      JSON.stringify({ error: 'Failed to cancel subscription' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
