import { NextRequest } from 'next/server';
import { Checkout } from '@polar-sh/nextjs';

/**
 * Checkout handler for Polar subscription
 * This endpoint creates a checkout session and returns the redirect URL
 */
export const POST = async (req: NextRequest) => {
  try {
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

    if (email) {
      url.searchParams.set('customerEmail', email);
    }

    // Create a new request with the updated URL
    const checkoutRequest = new Request(url, {
      headers: req.headers,
    });

    // Use the Checkout handler from @polar-sh/nextjs
    const checkoutHandler = Checkout({
      accessToken: process.env.POLAR_ACCESS_TOKEN || '',
      successUrl: successUrl || `${url.origin}/subscription/success`,
      server: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
    });

    // Call the checkout handler
    const response = await checkoutHandler(checkoutRequest);

    // If the response is a redirect, return the redirect URL
    if (response.status === 302) {
      const redirectUrl = response.headers.get('Location');
      return new Response(
        JSON.stringify({ redirectUrl }),
        { headers: { 'Content-Type': 'application/json' } }
      );
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
};
