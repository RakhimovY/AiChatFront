# Google Authentication Implementation

This document summarizes the changes made to implement Google authentication in the LegalGPT application.

## Backend Changes

### 1. User Model Updates

The User model was updated to store Google-specific information:

- Added `googleId` field to store the user's Google ID
- Added `picture` field to store the URL of the user's profile picture
- Added `provider` field to indicate the authentication provider
- Made `passwordHash` field nullable since Google-authenticated users won't have a password

### 2. New DTO for Google Authentication

Created a new DTO for Google authentication:

```kotlin
data class GoogleAuthRequest(
    val token: String,
    val email: String,
    val name: String? = null,
    val picture: String? = null,
    val googleId: String
)
```

### 3. UserRepository Updates

Added a method to find a user by Google ID:

```kotlin
fun findByGoogleId(googleId: String): Optional<User>
```

### 4. UserService Updates

Added a method to find or create a user by Google ID:

```kotlin
fun findOrCreateGoogleUser(googleAuthRequest: GoogleAuthRequest): User
```

This method:
- Checks if a user with the given Google ID exists
- If not, checks if a user with the given email exists
- If a user with the email exists, updates it with Google information
- If no user exists, creates a new one with Google information

### 5. AuthService Updates

Added a method to authenticate a user with Google credentials:

```kotlin
fun authenticateWithGoogle(googleAuthRequest: GoogleAuthRequest): ResponseEntity<LoginResponse>
```

This method:
- Finds or creates a user with the Google credentials
- Generates a JWT token for the user
- Returns a LoginResponse with the token and user information

### 6. New Endpoint for Google Authentication

Added a new endpoint to the AuthController to handle Google authentication:

```kotlin
@PostMapping("/google")
fun googleAuth(@RequestBody googleAuthRequest: GoogleAuthRequest): ResponseEntity<LoginResponse>
```

## Frontend Changes

### 1. NextAuth Configuration Updates

Updated the NextAuth configuration to handle Google authentication:

- Added a profile function to the GoogleProvider to map Google profile data
- Added a signIn callback to authenticate with the backend when a user signs in with Google
- Updated the JWT and session callbacks to handle Google authentication

### 2. Documentation

Created documentation files:

- `GOOGLE_AUTH_SETUP.md`: Instructions for setting up Google OAuth credentials
- Updated `BACKEND_INTEGRATION.md`: Added information about Google authentication

## Testing Instructions

1. Follow the instructions in `GOOGLE_AUTH_SETUP.md` to set up Google OAuth credentials
2. Start the backend server
3. Start the frontend development server
4. Navigate to the login page
5. Click the "Google" button to sign in with Google
6. Follow the Google authentication flow
7. Verify that you are redirected to the dashboard after successful authentication
8. Check the user information in the dashboard to ensure it includes the Google profile data

## Troubleshooting

If you encounter any issues with Google authentication, check the following:

1. Verify that the Google OAuth credentials are correctly set in the `.env.local` file
2. Check the browser console and server logs for any error messages
3. Ensure that the backend server is running and accessible
4. Verify that the Google API is enabled in the Google Cloud Console