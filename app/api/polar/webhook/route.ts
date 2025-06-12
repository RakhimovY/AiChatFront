import { Webhooks } from '@polar-sh/nextjs';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'X-Webhook-Verified': 'true'
};

const forwardWebhook = async (type: string, payload: unknown) => {
  try {
    console.log(`${type} webhook received:`, payload);
    await fetch(`${API_URL}/polar/webhook`, {
      method: 'POST',
      headers: DEFAULT_HEADERS,
      body: JSON.stringify({ type, data: payload })
    });
    console.log(`${type} webhook processed successfully`);
  } catch (error) {
    console.error(`Error processing ${type} webhook:`, error);
  }
};

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
      console.log('Received Polar webhook event:', payload);
      if (!payload || !payload.type || !payload.data) {
        console.error('Invalid webhook payload');
        return;
      }
      await fetch(`${API_URL}/polar/webhook`, {
        method: 'POST',
        headers: DEFAULT_HEADERS,
        body: JSON.stringify(payload)
      });
      console.log('Webhook processed successfully');
    } catch (error) {
      console.error('Error processing webhook:', error);
    }
  },
  onSubscriptionCreated: (payload) => forwardWebhook('subscription.created', payload),
  onSubscriptionActive: (payload) => forwardWebhook('subscription.active', payload),
  onSubscriptionUpdated: (payload) => forwardWebhook('subscription.updated', payload),
  onSubscriptionCanceled: (payload) => forwardWebhook('subscription.canceled', payload),
  onOrderPaid: (payload) => forwardWebhook('order.paid', payload),
  onCheckoutCreated: (payload) => forwardWebhook('checkout.created', payload),
  onCheckoutUpdated: (payload) => forwardWebhook('checkout.updated', payload)
});
