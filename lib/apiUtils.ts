/**
 * API utility functions for handling common API operations
 */

import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

/**
 * Creates a standardized error response
 */
export const createErrorResponse = (message: string, status: number = 500) => {
  return new Response(
    JSON.stringify({ error: message }),
    { 
      status,
      headers: { 'Content-Type': 'application/json' }
    }
  );
};

/**
 * Creates a standardized success response
 */
export const createSuccessResponse = (data: any | null = null, status: number = 200) => {
  return new Response(
    data !== null ? JSON.stringify(data) : null,
    { 
      status,
      headers: { 'Content-Type': 'application/json' }
    }
  );
};

/**
 * Checks if an error is an authentication error (401)
 */
export const isAuthError = (error: any): boolean => {
  return (
    error && 
    typeof error === 'object' && 
    ('status' in error && error.status === 401 || 
     'response' in error && error.response?.status === 401)
  );
};

/**
 * Gets the session and validates authentication
 * Returns null if not authenticated
 */
export const getAuthSession = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return null;
  }

  return session;
};

/**
 * Handles API requests with authentication
 * @param handler - The function to handle the request if authenticated
 */
export const withAuth = async (
  req: NextRequest, 
  handler: (token: string) => Promise<Response>
): Promise<Response> => {
  try {
    const session = await getAuthSession();

    if (!session) {
      return createErrorResponse('Unauthorized', 401);
    }

    return await handler(session.accessToken);
  } catch (error) {
    console.error('API error:', error);

    if (isAuthError(error)) {
      return createErrorResponse('Unauthorized', 401);
    }

    return createErrorResponse('Internal server error');
  }
};
