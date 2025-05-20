import { NextRequest } from 'next/server';
import { Checkout } from '@polar-sh/nextjs';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import axios from 'axios';

/**
 * Checkout handler for Polar subscription
 * This endpoint creates a checkout session with Polar and returns the redirect URL
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
    const { planId, email, successUrl, cancelUrl } = await req.json();

    if (!planId) {
      return new Response(
        JSON.stringify({ error: 'Missing planId' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Create a URL with query parameters for the Checkout handler
    const url = new URL(req.url);
    url.searchParams.set('productId', planId);

    // Use the email from the session if not provided
    const customerEmail = email || session.user.email;
    if (customerEmail) {
      url.searchParams.set('customerEmail', customerEmail);
    }

    // Create a new request with the updated URL
    const checkoutRequest = new Request(url, {
      headers: req.headers,
    });

    // Use the Checkout handler from @polar-sh/nextjs
    const checkoutHandler = Checkout({
      accessToken: process.env.POLAR_ACCESS_TOKEN || '',
      successUrl: successUrl || `${url.origin}/subscription/success`,
      cancelUrl: cancelUrl || `${url.origin}/subscription/cancel`,
      server: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
    });

    // Call the checkout handler
    const response = await checkoutHandler(checkoutRequest);

    // If the response is a redirect, return the redirect URL
    if (response.status === 302) {
      const redirectUrl = response.headers.get('Location');

      // Also notify our backend about the checkout attempt
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/subscriptions/checkout`,
          {
            planId,
            email: customerEmail,
            successUrl,
            cancelUrl
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.accessToken}`,
            },
          }
        );
      } catch (backendError) {
        console.error('Error notifying backend about checkout:', backendError);
        // Continue even if backend notification fails
      }

      // Return the redirect URL as a JSON response
      return new Response(JSON.stringify({ redirectUrl }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Otherwise, return the response directly
    return response;
  } catch (error) {
    console.error('Error creating checkout session:', error);

    // Return an error response
    return new Response(
      JSON.stringify({ error: 'Failed to create checkout session' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
