import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

/**
 * Handler for GET /subscriptions/status
 * This endpoint checks the subscription status for the authenticated user
 */
export async function GET(req: NextRequest) {
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

    // Forward the request to the backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subscriptions/status`, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    // Get the response data
    const data = await response.json();
    console.log('Response from backend:', data);

    // Return the response from the backend
    return new Response(
      JSON.stringify(data),
      { 
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error checking subscription status:', error);

    // Return an error response
    return new Response(
      JSON.stringify({
        hasActiveSubscription: false,
        subscriptions: [],
        message: 'Failed to check subscription status'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
