# Subscription Feature Documentation

This document provides information about the subscription feature implementation, including how to use it, how to test it, and configuration requirements.

## Overview

The subscription feature allows users to subscribe to premium plans using Polar as the payment processor. The feature includes:

1. A subscription management page where users can view and cancel their subscriptions
2. A subscription promo component that can be used on any page to promote subscriptions
3. A subscribe button component that initiates the subscription process
4. Success and cancel pages for the subscription flow
5. Webhook handlers for Polar subscription events

## Configuration Requirements

### Frontend Configuration

1. Add the required packages to your project:
   ```bash
   npm install @polar-sh/sdk @polar-sh/nextjs
   ```

2. Set up the following environment variables in your `.env.local` file:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8080
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_POLAR_API_KEY=your-polar-api-key
   POLAR_ACCESS_TOKEN=your-polar-access-token
   POLAR_WEBHOOK_SECRET=your-polar-webhook-secret
   ```

3. Make sure your Polar account is set up with the correct plans and webhooks.

4. Get your API key from https://polar.sh/settings/developer and set it in the NEXT_PUBLIC_POLAR_API_KEY environment variable.

5. Get your access token from https://polar.sh/settings/developer and set it in the POLAR_ACCESS_TOKEN environment variable. This is used for server-side API calls.

6. Set up a webhook in your Polar dashboard to point to your webhook endpoint and get the webhook secret to set in the POLAR_WEBHOOK_SECRET environment variable.

### Backend Configuration

1. Create the necessary database tables for subscriptions (see the Subscription model).

2. Set up the webhook endpoint in your Polar dashboard to point to:
   ```
   https://your-domain.com/api/subscription/webhook
   ```

   Note: The webhook will be forwarded to the backend endpoint `/polar/webhook`.

## How to Use

### Adding the Subscription Promo to a Page

```jsx
import SubscriptionPromo from '@/components/subscription/SubscriptionPromo';

// In your component
<SubscriptionPromo className="max-w-md mx-auto" />
```

### Adding the Subscribe Button to a Page

```jsx
import SubscribeButton from '@/components/subscription/SubscribeButton';

// In your component
<SubscribeButton 
  planId="premium-monthly" 
  buttonText="Subscribe Now" 
  className="w-full md:w-auto"
/>
```

## Testing the Subscription Flow

### Prerequisites

1. Make sure both the frontend and backend are running.
2. Have a Polar account set up with test plans.
3. Be logged in to the application.

### Test Subscribing to a Plan

1. Navigate to the subscription page at `/subscription`.
2. Click on the "Subscribe Now" button.
3. You will be redirected to the Polar checkout page.
4. Complete the checkout process with test payment information.
5. After successful payment, you will be redirected to the success page.
6. From the success page, you can view your subscription details.

### Test Viewing Subscription Details

1. Navigate to the subscription page at `/subscription`.
2. Your active subscriptions will be displayed with details such as:
   - Plan name
   - Status
   - Current period
   - Cancellation status

### Test Canceling a Subscription

1. Navigate to the subscription page at `/subscription`.
2. Find the subscription you want to cancel.
3. Click the "Cancel Subscription" button.
4. Confirm the cancellation.
5. The subscription status will change to "Cancelling" and will be canceled at the end of the current period.

## Webhook Testing

To test webhooks locally, you can use a tool like ngrok to expose your local server to the internet:

1. Install ngrok: `npm install -g ngrok`
2. Start your frontend server: `npm run dev`
3. In a separate terminal, run: `ngrok http 3000`
4. Copy the ngrok URL (e.g., `https://abc123.ngrok.io`)
5. Set up the webhook in your Polar dashboard to point to: `https://abc123.ngrok.io/api/subscription/webhook` (this will be forwarded to the backend endpoint `/api/polar/webhook`)
6. Test the subscription flow as described above.

## Troubleshooting

### Webhook Not Received

If the webhook is not received, the frontend will attempt to notify the backend about the subscription after a successful checkout. You can check the logs for any errors.

### Subscription Not Created

If the subscription is not created after a successful checkout, you can try:

1. Check the browser console for any errors.
2. Check the backend logs for any errors.
3. Manually notify the backend by calling the `/subscription/notify` endpoint with the subscription ID.

## Implementation Details

### Frontend Components

- `SubscriptionPromo`: Displays a promo card for subscriptions.
- `SubscribeButton`: Initiates the subscription process using Polar.
- `SubscriptionPage`: Displays subscription details and allows cancellation.
- `SubscriptionSuccessPage`: Displayed after successful subscription.
- `SubscriptionCancelPage`: Displayed if the user cancels the subscription process.

### Backend Components

- `SubscriptionController`: Handles subscription-related API requests (subscriptions management, cancellation, etc.).
- `PolarWebhookController`: Handles webhook events from Polar (subscription creation, updates, cancellation, etc.).
- `SubscriptionService`: Manages subscription data and business logic.
- `Subscription`: Model for storing subscription data.
- `SubscriptionRepository`: Data access for subscriptions.
- `PolarWebhookEvent`: DTO for Polar webhook events.

### API Endpoints

- `GET /api/subscriptions`: Get all subscriptions for the authenticated user.
- `GET /api/subscriptions/active`: Get active subscriptions for the authenticated user.
- `GET /api/subscriptions/status`: Check subscription status for the authenticated user.
- `POST /api/subscriptions/cancel`: Cancel a subscription.
- `POST /polar/webhook`: Webhook endpoint for Polar subscription events (replaces the old `/subscriptions/webhook` endpoint).
- `POST /api/subscriptions/notify`: Manual notification endpoint for subscription events.

### Frontend API Routes

- `POST /api/subscription/webhook`: Receives webhook events from Polar and forwards them to the backend endpoint `/polar/webhook`. Uses the `Webhooks` function from `@polar-sh/nextjs` for signature verification and event handling.
- `POST /api/subscription/notify`: Notifies the backend about a subscription when the webhook might not be received.
- `POST /api/subscription/checkout`: Creates a checkout session and returns the redirect URL. Uses the `Checkout` function from `@polar-sh/nextjs` to handle the checkout process.
- `GET /api/subscriptions/status`: Checks the subscription status for the authenticated user and returns comprehensive information about their subscriptions.
- `GET /api/subscriptions`: Gets all subscriptions for the authenticated user.
- `GET /api/subscriptions/active`: Gets active subscriptions for the authenticated user.
- `POST /api/subscriptions/cancel`: Cancels a subscription.

### Server-Side Subscription Tracking

The subscription feature uses a server-side approach to track subscription status, which provides the following benefits:

1. **Reliability**: Subscription data is stored in the database, not in localStorage or other client-side storage mechanisms
2. **Security**: Sensitive subscription information is kept on the server
3. **Consistency**: All clients see the same subscription status
4. **Persistence**: Subscription status persists across sessions and devices

The flow for tracking subscription status is:

1. When a user initiates a subscription, they are redirected to Polar's checkout page
2. After successful payment, Polar sends a webhook to our webhook endpoint
3. The webhook handler forwards the event to the backend
4. The backend stores the subscription data in the database
5. The frontend can query the subscription status at any time using the `/subscriptions/status` endpoint

This approach eliminates the need for client-side storage of subscription data and ensures that the subscription status is always up-to-date.

### Integration with @polar-sh/nextjs

The project uses `@polar-sh/nextjs` for webhook handling and checkout functionality, which provides the following benefits:

1. Built-in signature verification for webhook events
2. Event-specific handlers for different types of subscription events
3. Simplified webhook handling with less boilerplate code
4. Server-side checkout handling with redirect support

#### Webhook Handler

The webhook handler is implemented using the `Webhooks` function from `@polar-sh/nextjs`:

```typescript
export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET || '',
  onPayload: async (payload) => {
    // Handle the payload
  },
  // Event-specific handlers
  onSubscriptionCreated: async (payload) => {
    // Handle subscription created event
  },
  // ... other event handlers
});
```

#### Checkout Handler

The checkout handler is implemented using the `Checkout` function from `@polar-sh/nextjs` as a direct GET handler:

```typescript
export const GET = Checkout({
  accessToken: process.env.POLAR_ACCESS_TOKEN || '',
  successUrl: process.env.NEXT_PUBLIC_APP_URL ? `${process.env.NEXT_PUBLIC_APP_URL}/subscription/success` : 'http://localhost:3000/subscription/success',
  cancelUrl: process.env.NEXT_PUBLIC_APP_URL ? `${process.env.NEXT_PUBLIC_APP_URL}/subscription/cancel` : 'http://localhost:3000/subscription/cancel',
  server: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
});
```

For backward compatibility, we also maintain a POST handler that converts the request to a GET request:

```typescript
export const POST = async (req: NextRequest) => {
  // Extract parameters from JSON body and add them to URL
  // Create a GET request and pass it to the Checkout handler
  // Return the response
};
```
