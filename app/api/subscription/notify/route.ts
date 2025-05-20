import { NextRequest } from 'next/server';
import axios from 'axios';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

/**
 * Notification handler for manual subscription notifications
 * This endpoint is called by the frontend to notify the backend about a subscription
 * when the webhook might not be received (e.g., during development)
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
    const { polarSubscriptionId } = await req.json();

    if (!polarSubscriptionId) {
      return new Response(
        JSON.stringify({ error: 'Missing polarSubscriptionId' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Forward the notification to the backend
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/subscriptions/notify`,
      { 
        polarSubscriptionId,
        email: session.user.email 
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.accessToken}`,
        },
      }
    );

    // Return the response from the backend
    return new Response(
      JSON.stringify({ status: 'success', message: 'Subscription notification sent successfully' }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error sending subscription notification:', error);

    // Return an error response
    return new Response(
      JSON.stringify({ error: 'Failed to send subscription notification' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
