import { NextRequest } from 'next/server';
import { withAuth, createSuccessResponse, createErrorResponse, isAuthError } from '@/lib/apiUtils';
import { z } from 'zod';
import { lawyerRequestSchema } from '@/lib/types/lawyerRequest';

/**
 * GET /api/lawyer-requests
 * 
 * Retrieves a list of lawyer requests.
 * Can be filtered by status, urgency, and other parameters.
 */
export async function GET(req: NextRequest) {
  return withAuth(req, async (token) => {
    try {
      // Get query parameters
      const { searchParams } = new URL(req.url);
      const status = searchParams.get('status');
      const urgency = searchParams.get('urgency');
      const page = searchParams.get('page') || '1';
      const limit = searchParams.get('limit') || '10';

      // Build query string
      const queryParams = new URLSearchParams();
      if (status) queryParams.append('status', status);
      if (urgency) queryParams.append('urgency', urgency);
      queryParams.append('page', page);
      queryParams.append('limit', limit);

      // Forward the request to the backend
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/lawyer-requests?${queryParams.toString()}`, 
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 401) {
        return createErrorResponse('Unauthorized', 401);
      }

      const data = await response.json();
      return createSuccessResponse(data, response.status);
    } catch (error) {
      console.error('Error fetching lawyer requests:', error);

      if (isAuthError(error)) {
        return createErrorResponse('Unauthorized', 401);
      }

      return createErrorResponse('Failed to fetch lawyer requests', 500);
    }
  });
}

/**
 * POST /api/lawyer-requests
 * 
 * Creates a new lawyer request.
 */
export async function POST(req: NextRequest) {
  return withAuth(req, async (token) => {
    try {
      // Parse request body
      const body = await req.json();

      try {
        // Validate the request data
        const validatedData = lawyerRequestSchema.parse(body);

        // Forward the request to the backend
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/lawyer-requests`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(validatedData)
        });

        if (response.status === 401) {
          return createErrorResponse('Unauthorized', 401);
        }

        const data = await response.json();
        return createSuccessResponse(data, response.status);
      } catch (validationError) {
        if (validationError instanceof z.ZodError) {
          return new Response(
            JSON.stringify({ 
              error: 'Validation error', 
              details: validationError.errors 
            }),
            { 
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            }
          );
        }
        throw validationError;
      }
    } catch (error) {
      console.error('Error creating lawyer request:', error);

      if (isAuthError(error)) {
        return createErrorResponse('Unauthorized', 401);
      }

      return createErrorResponse('Failed to create lawyer request', 500);
    }
  });
}
