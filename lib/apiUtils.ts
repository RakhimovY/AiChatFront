/**
 * Utility functions for API response handling
 */

/**
 * Creates a standardized error response
 * @param message Error message
 * @param status HTTP status code
 * @returns Response object
 */
export function createErrorResponse(message: string, status: number = 500): Response {
  return new Response(
    JSON.stringify({ error: message }),
    { 
      status,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}

/**
 * Creates an unauthorized error response
 * @returns Response object with 401 status
 */
export function createUnauthorizedResponse(): Response {
  return createErrorResponse('Unauthorized', 401);
}

/**
 * Creates a success response with the provided data
 * @param data Response data
 * @param status HTTP status code
 * @returns Response object
 */
export function createSuccessResponse(data: any, status: number = 200): Response {
  return new Response(
    JSON.stringify(data),
    { 
      status,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}

/**
 * Checks if an error is an authentication error (401)
 * @param error Error object to check
 * @returns True if the error is an authentication error
 */
export function isAuthenticationError(error: unknown): boolean {
  return (
    error && 
    typeof error === 'object' && 
    ('status' in error && error.status === 401 || 
     'response' in error && error.response?.status === 401)
  );
}