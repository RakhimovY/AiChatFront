import axios from 'axios';
import { signOut } from 'next-auth/react';

// Create an axios instance with the base URL and timeout configuration
const api = axios.create({
  baseURL: '/api', // Use relative URL to route through Next.js API routes
  // Set a longer timeout (2 minutes) for AI responses which might take time
  timeout: 120000,
});

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If the error is unauthorized (401), it's due to token expiration
    if (error.response?.status === 401) {
      console.error('Authentication error:', error);

      // Add a custom property to the error to indicate it's an auth error
      error.isSessionExpired = true;

      // Sign out the user and redirect to login page with a message
      await signOut({
        redirect: true,
        callbackUrl: '/auth/login?error=session_expired'
      });
    }
    return Promise.reject(error);
  }
);

export default api;
