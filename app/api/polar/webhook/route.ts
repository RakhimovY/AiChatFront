import { Webhooks } from '@polar-sh/nextjs';

/**
 * Webhook handler for Polar subscription events
 * This endpoint receives webhook events from Polar and forwards them to the backend
 * 
 * Note: This is a server-side API route, so localStorage is not available here.
 * All subscription data is stored in the backend database.
 */
export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,
  onPayload: async (payload) => {
    try {
      // Log the webhook event (for debugging)
      console.log('Received Polar webhook event:', payload);

      // Validate the webhook payload
      if (!payload || !payload.type || !payload.data) {
        console.error('Invalid webhook payload');
        return;
      }

      // Forward the webhook event to the backend
      // Note: For webhooks, we don't need authentication as they come directly from Polar
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/polar/webhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Verified': 'true',
        },
        body: JSON.stringify(payload)
      });

      console.log('Webhook processed successfully');
    } catch (error) {
      console.error('Error processing webhook:', error);
    }
  },
  // Add event-specific handlers
  onSubscriptionCreated: async (payload) => {
    try {
      console.log('Subscription created webhook received:', payload);

      // Forward the subscription created event to the backend
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/polar/webhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Verified': 'true',
        },
        body: JSON.stringify({
          type: 'subscription.created',
          data: payload
        })
      });

      console.log('Subscription created webhook processed successfully');
    } catch (error) {
      console.error('Error processing subscription created webhook:', error);
    }
  },
  onSubscriptionActive: async (payload) => {
    try {
      console.log('Subscription active webhook received:', payload);

      // Forward the subscription active event to the backend
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/polar/webhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Verified': 'true',
        },
        body: JSON.stringify({
          type: 'subscription.active',
          data: payload
        })
      });

      console.log('Subscription active webhook processed successfully');
    } catch (error) {
      console.error('Error processing subscription active webhook:', error);
    }
  },
  onSubscriptionUpdated: async (payload) => {
    try {
      console.log('Subscription updated webhook received:', payload);

      // Forward the subscription updated event to the backend
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/polar/webhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Verified': 'true',
        },
        body: JSON.stringify({
          type: 'subscription.updated',
          data: payload
        })
      });

      console.log('Subscription updated webhook processed successfully');
    } catch (error) {
      console.error('Error processing subscription updated webhook:', error);
    }
  },
  onSubscriptionCanceled: async (payload) => {
    try {
      console.log('Subscription canceled webhook received:', payload);

      // Forward the subscription canceled event to the backend
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/polar/webhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Verified': 'true',
        },
        body: JSON.stringify({
          type: 'subscription.canceled',
          data: payload
        })
      });

      console.log('Subscription canceled webhook processed successfully');
    } catch (error) {
      console.error('Error processing subscription canceled webhook:', error);
    }
  },
  onOrderPaid: async (payload) => {
    try {
      console.log('Order paid webhook received:', payload);

      // Forward the order paid event to the backend
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/polar/webhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Verified': 'true',
        },
        body: JSON.stringify({
          type: 'order.paid',
          data: payload
        })
      });

      console.log('Order paid webhook processed successfully');
    } catch (error) {
      console.error('Error processing order paid webhook:', error);
    }
  },
  onCheckoutCreated: async (payload) => {
    try {
      console.log('Checkout created webhook received:', payload);

      // Forward the checkout created event to the backend
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/polar/webhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Verified': 'true',
        },
        body: JSON.stringify({
          type: 'checkout.created',
          data: payload
        })
      });

      console.log('Checkout created webhook processed successfully');
    } catch (error) {
      console.error('Error processing checkout created webhook:', error);
    }
  },
  onCheckoutUpdated: async (payload) => {
    try {
      console.log('Checkout updated webhook received:', payload);

      // Forward the checkout updated event to the backend
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/polar/webhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Verified': 'true',
        },
        body: JSON.stringify({
          type: 'checkout.updated',
          data: payload
        })
      });

      console.log('Checkout updated webhook processed successfully');
    } catch (error) {
      console.error('Error processing checkout updated webhook:', error);
    }
  },
});
