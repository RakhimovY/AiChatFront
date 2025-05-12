# Google Authentication Setup

This document provides instructions on how to set up Google OAuth credentials for the LegalGPT application.

## Prerequisites

- A Google account
- Access to the [Google Cloud Console](https://console.cloud.google.com/)

## Steps to Create Google OAuth Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" and select "OAuth client ID"
5. Select "Web application" as the application type
6. Enter a name for your OAuth client (e.g., "LegalGPT")
7. Add authorized JavaScript origins:
   - `http://localhost:3000` (for development)
   - Your production URL (e.g., `https://your-domain.com`)
8. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - `https://your-domain.com/api/auth/callback/google` (for production)
9. Click "Create"
10. Copy the generated Client ID and Client Secret

## Update Environment Variables

1. Open the `.env.local` file in the root of the frontend project
2. Update the Google OAuth credentials:
   ```
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```
3. Replace `your-google-client-id` and `your-google-client-secret` with the values you copied from the Google Cloud Console

## Testing Google Authentication

1. Start the backend server:
   ```
   cd /path/to/backend
   ./gradlew bootRun
   ```

2. Start the frontend development server:
   ```
   cd /path/to/frontend
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000/auth/login`
4. Click the "Google" button to sign in with Google
5. Follow the Google authentication flow
6. You should be redirected to the dashboard after successful authentication

## Troubleshooting

If you encounter any issues with Google authentication, check the following:

1. Verify that the Client ID and Client Secret are correctly set in the `.env.local` file
2. Ensure that the authorized redirect URIs are correctly configured in the Google Cloud Console
3. Check the browser console and server logs for any error messages
4. Verify that the backend server is running and accessible
5. Ensure that the Google API is enabled in the Google Cloud Console (OAuth2 API)

## Security Considerations

- Never commit your Client Secret to version control
- Use environment variables to store sensitive information
- Implement proper CSRF protection (NextAuth.js handles this for you)
- Regularly rotate your Client Secret
- Limit the scopes requested to only what is necessary