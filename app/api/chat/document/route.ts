import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { validateIIN, validateBIN, checkLegalCompliance } from '@/lib/utils/kazakhstanLegal';
import { kazakhstanIINSchema, kazakhstanBINSchema } from '@/lib/types/kazakhstanLegal';

/**
 * Handler for POST /api/chat/document
 * This endpoint forwards document upload requests to the backend
 * 
 * Enhanced with support for Kazakhstan legal documents validation
 */
export async function POST(req: NextRequest) {
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

    // Get the form data from the request
    const formData = await req.formData();

    // Check if this is a Kazakhstan legal document
    const documentType = formData.get('documentType') as string;
    const isKazakhstanLegal = documentType?.startsWith('kazakhstan-legal');

    // Validate Kazakhstan-specific fields if applicable
    if (isKazakhstanLegal) {
      try {
        // Extract Kazakhstan-specific fields
        const iinFields = ['employeeIin', 'sellerIin', 'buyerIin', 'landlordIin', 'tenantIin'];
        const binFields = ['employerBin'];

        // Validate IIN fields
        for (const field of iinFields) {
          const value = formData.get(field) as string;
          if (value) {
            const isValid = validateIIN(value);
            if (!isValid) {
              return new Response(
                JSON.stringify({ error: `Invalid IIN in field ${field}` }),
                { 
                  status: 400,
                  headers: { 'Content-Type': 'application/json' }
                }
              );
            }
          }
        }

        // Validate BIN fields
        for (const field of binFields) {
          const value = formData.get(field) as string;
          if (value) {
            const isValid = validateBIN(value);
            if (!isValid) {
              return new Response(
                JSON.stringify({ error: `Invalid BIN in field ${field}` }),
                { 
                  status: 400,
                  headers: { 'Content-Type': 'application/json' }
                }
              );
            }
          }
        }

        // Check document content for legal compliance
        const content = formData.get('content') as string;
        if (content) {
          const docType = documentType.replace('kazakhstan-legal-', '');
          const compliance = checkLegalCompliance(docType, content);

          if (!compliance.compliant) {
            return new Response(
              JSON.stringify({ 
                error: 'Document does not comply with Kazakhstan legislation',
                issues: compliance.issues
              }),
              { 
                status: 400,
                headers: { 'Content-Type': 'application/json' }
              }
            );
          }
        }
      } catch (validationError) {
        console.error('Kazakhstan document validation error:', validationError);
        return new Response(
          JSON.stringify({ error: 'Failed to validate Kazakhstan document fields' }),
          { 
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
    }

    // Forward the request to the backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/ask-with-document`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`
        // Don't set Content-Type here, it will be set automatically with the boundary
      },
      body: formData
    });

    // Get the response data
    const data = await response.json();

    // Return the response from the backend
    return new Response(
      JSON.stringify(data),
      { 
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error sending message with document:', error);

    // Return an error response
    return new Response(
      JSON.stringify({ error: 'Failed to send message with document' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
