import { NextRequest } from "next/server";
import { createErrorResponse, createSuccessResponse, isAuthError, withAuth } from "@/lib/apiUtils";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json'
};

const handleApiResponse = async (response: Response) => {
  if (response.status === 401) {
    return createErrorResponse('Unauthorized', 401);
  }
  if (response.status === 400) {
    const errorData = await response.json();
    return createErrorResponse(errorData.error || 'Invalid request', 400);
  }
  if (response.status === 404) {
    return createErrorResponse('Template not found', 404);
  }
  const data = await response.json();
  return createSuccessResponse(data, response.status);
};

const handleApiError = (error: unknown, errorMessage: string) => {
  console.error(errorMessage, error);
  if (isAuthError(error)) {
    return createErrorResponse('Unauthorized', 401);
  }
  return createErrorResponse(errorMessage, 500);
};

/**
 * Handler for GET /api/web/documents
 * This endpoint forwards the request to get all user documents
 */
export async function GET(req: NextRequest) {
  return withAuth(req, async (token) => {
    try {
      const response = await fetch(`${API_URL}/web/documents`, {
        headers: {
          ...DEFAULT_HEADERS,
          'Authorization': `Bearer ${token}`
        }
      });
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error, 'Failed to fetch documents');
    }
  });
}

/**
 * Handler for POST /api/web/documents
 * This endpoint forwards the request to create a new document
 */
export async function POST(req: NextRequest) {
  return withAuth(req, async (token) => {
    try {
      const body = await req.json();
      const response = await fetch(`${API_URL}/web/documents`, {
        method: 'POST',
        headers: {
          ...DEFAULT_HEADERS,
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error, 'Failed to create document');
    }
  });
}
