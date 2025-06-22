import { NextRequest } from 'next/server';
import { withAuth, createSuccessResponse, createErrorResponse, isAuthError } from '@/lib/apiUtils';
import { z } from 'zod';
import { lawyerRequestSchema } from '@/lib/types/lawyerRequest';

/**
 * GET /api/lawyer-requests/[id]
 * 
 * Retrieves a specific lawyer request by ID.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(req, async (token) => {
    try {
      const { id } = params;
      if (!id) {
        return createErrorResponse('Request ID is required', 400);
      }

      // Forward the request to the backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/lawyer-requests/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        return createErrorResponse('Unauthorized', 401);
      }

      if (response.status === 404) {
        return createErrorResponse('Lawyer request not found', 404);
      }

      const data = await response.json();
      return createSuccessResponse(data, response.status);
    } catch (error) {
      console.error(`Error fetching lawyer request ${params.id}:`, error);

      if (isAuthError(error)) {
        return createErrorResponse('Unauthorized', 401);
      }

      return createErrorResponse('Failed to fetch lawyer request', 500);
    }
  });
}

/**
 * PUT /api/lawyer-requests/[id]
 * 
 * Updates a specific lawyer request by ID.
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(req, async (token) => {
    try {
      const { id } = params;
      if (!id) {
        return createErrorResponse('Request ID is required', 400);
      }

      // Parse request body
      const body = await req.json();

      // Create a partial schema for updates
      const updateSchema = lawyerRequestSchema.partial();

      try {
        // Validate the request data
        const validatedData = updateSchema.parse(body);

        // Forward the request to the backend
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/lawyer-requests/${id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(validatedData)
        });

        if (response.status === 401) {
          return createErrorResponse('Unauthorized', 401);
        }

        if (response.status === 404) {
          return createErrorResponse('Lawyer request not found', 404);
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
      console.error(`Error updating lawyer request ${params.id}:`, error);

      if (isAuthError(error)) {
        return createErrorResponse('Unauthorized', 401);
      }

      return createErrorResponse('Failed to update lawyer request', 500);
    }
  });
}

/**
 * DELETE /api/lawyer-requests/[id]
 * 
 * Deletes (or cancels) a specific lawyer request by ID.
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(req, async (token) => {
    try {
      const { id } = params;
      if (!id) {
        return createErrorResponse('Request ID is required', 400);
      }

      // Forward the request to the backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/lawyer-requests/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        return createErrorResponse('Unauthorized', 401);
      }

      if (response.status === 404) {
        return createErrorResponse('Lawyer request not found', 404);
      }

      const data = await response.json();
      return createSuccessResponse(data, response.status);
    } catch (error) {
      console.error(`Error deleting lawyer request ${params.id}:`, error);

      if (isAuthError(error)) {
        return createErrorResponse('Unauthorized', 401);
      }

      return createErrorResponse('Failed to delete lawyer request', 500);
    }
  });
}
