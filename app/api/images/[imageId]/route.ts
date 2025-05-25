import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

/**
 * Handler for GET /api/images/[imageId]
 * This endpoint forwards image retrieval requests to the backend
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { imageId: string } }
) {
  try {
    // Get the session to access the token
    const session = await getServerSession(authOptions);
    
    if (!session?.accessToken) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Get the image ID from the URL params
    const { imageId } = params;
    
    // Forward the request to the backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/images/${imageId}`, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`
      }
    });

    // If the response is not OK, return the error
    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: `Failed to fetch image: ${response.statusText}` }),
        { 
          status: response.status,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Get the image data as a buffer
    const imageBuffer = await response.arrayBuffer();
    
    // Get the content type from the response headers
    const contentType = response.headers.get('Content-Type') || 'image/jpeg';

    // Return the image data
    return new Response(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400' // Cache for 24 hours
      }
    });
  } catch (error) {
    console.error('Error fetching image:', error);

    // Return an error response
    return new Response(
      JSON.stringify({ error: 'Failed to fetch image' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}