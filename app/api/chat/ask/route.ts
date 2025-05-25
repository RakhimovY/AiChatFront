import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { 
  createUnauthorizedResponse, 
  createSuccessResponse, 
  createErrorResponse,
  isAuthenticationError
} from '@/lib/apiUtils';

/**
 * Handler for POST /api/chat/ask
 * This endpoint forwards the request to send a message
 * It handles both JSON and form data requests (for files)
 */
export async function POST(req: NextRequest) {
    try {
        // Get the session to access the token
        const session = await getServerSession(authOptions);

        if (!session?.accessToken) {
            return createUnauthorizedResponse();
        }

        // Determine content type
        const contentType = req.headers.get('content-type') || '';
        let response;

        if (contentType.includes('multipart/form-data')) {
            // Handle form data (for file uploads)
            const formData = await req.formData();

            // Forward the request to the backend
            response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/ask`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session.accessToken}`
                    // Don't set Content-Type here, it will be set automatically with the boundary
                },
                body: formData
            });
        } else {
            // Handle JSON data
            const body = await req.json();

            // Forward the request to the backend
            response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/ask`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });
        }

        // Check if response is 401 Unauthorized
        if (response.status === 401) {
            return createUnauthorizedResponse();
        }

        // Get the response data
        const data = await response.json();

        // Return the response from the backend
        return createSuccessResponse(data, response.status);
    } catch (error) {
        console.error('Error sending message:', error);

        // Check if it's an authentication error
        if (isAuthenticationError(error)) {
            return createUnauthorizedResponse();
        }

        // Return an error response
        return createErrorResponse('Failed to send message');
    }
}
