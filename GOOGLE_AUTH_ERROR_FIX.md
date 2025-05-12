# Fixing "OAuth client was not found" Error

## Issue Description

You encountered the following error when trying to authenticate with Google:

```
Доступ заблокирован: ошибка авторизации 
The OAuth client was not found.
Если вы разработчик этого приложения, изучите подробную информацию об ошибке.
Ошибка 401: invalid_client
```

## Cause of the Error

This error occurs because the application is using placeholder values for the Google OAuth credentials instead of actual valid credentials. The error message "The OAuth client was not found" indicates that Google's authentication servers cannot find a valid OAuth client with the provided credentials.

## Solution

To fix this issue, you need to:

1. Obtain valid Google OAuth credentials from the Google Cloud Console
2. Update the `.env.local` file with these credentials

### Step 1: Obtain Google OAuth Credentials

Follow the instructions in the `GOOGLE_AUTH_SETUP.md` file to create a project in the Google Cloud Console and obtain OAuth credentials. Here's a summary of the steps:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" and select "OAuth client ID"
5. Select "Web application" as the application type
6. Enter a name for your OAuth client (e.g., "LegalGPT")
7. Add authorized JavaScript origins:
   - `http://localhost:3000` (for development)
   - Your production URL (if applicable)
8. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - Your production callback URL (if applicable)
9. Click "Create"
10. Copy the generated Client ID and Client Secret

### Step 2: Update Environment Variables

1. Open the `.env.local` file in the root of the project
2. Replace the placeholder values with your actual Google OAuth credentials:
   ```
   GOOGLE_CLIENT_ID=your-actual-client-id-from-google-cloud-console
   GOOGLE_CLIENT_SECRET=your-actual-client-secret-from-google-cloud-console
   ```

### Step 3: Restart the Application

After updating the `.env.local` file, restart the application:

```
npm run dev
```

## Verification

To verify that the issue is fixed:

1. Navigate to the login page
2. Click the "Google" button to sign in with Google
3. You should be redirected to Google's authentication page
4. After authenticating, you should be redirected back to the application

## Additional Troubleshooting

If you still encounter issues:

1. Verify that the Client ID and Client Secret are correctly copied from the Google Cloud Console
2. Ensure that the authorized redirect URIs are correctly configured in the Google Cloud Console
3. Check the browser console and server logs for any error messages
4. Verify that the backend server is running and accessible
5. Ensure that the Google API is enabled in the Google Cloud Console (OAuth2 API)

For more detailed troubleshooting, refer to the `GOOGLE_AUTH_SETUP.md` file.