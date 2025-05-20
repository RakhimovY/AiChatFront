import { NextRequest } from 'next/server';
import axios from 'axios';
import { Webhooks } from '@polar-sh/nextjs';

/**
 * Webhook handler for Polar subscription events
 * This endpoint receives webhook events from Polar and forwards them to the backend
 */
export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET || '',
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
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/subscriptions/webhook`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            // Add a custom header to indicate that the webhook has been verified
            'X-Webhook-Verified': 'true',
          },
        }
      );

      console.log('Webhook processed successfully');
    } catch (error) {
      console.error('Error processing webhook:', error);
    }
  },
  // You can also add specific handlers for different event types
  onSubscriptionCreated: async (payload) => {
    console.log('Subscription created:', payload.id);
  },
  onSubscriptionUpdated: async (payload) => {
    console.log('Subscription updated:', payload.id);
  },
  onSubscriptionActive: async (payload) => {
    console.log('Subscription active:', payload.id);
  },
  onSubscriptionCanceled: async (payload) => {
    console.log('Subscription canceled:', payload.id);
  },
});
