import { Checkout } from '@polar-sh/nextjs';

export const GET = Checkout({
      accessToken: process.env.POLAR_ACCESS_TOKEN!,
      successUrl: 'subscription/success',
      server: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
    });
