import axios from 'axios';
import { getSession, signOut } from 'next-auth/react';

// Create an axios instance with the base URL
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Add a request interceptor to add the authorization header
api.interceptors.request.use(async (config) => {
  // Get the session
  const session = await getSession();

  // If there's a session with an access token, add it to the headers
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }

  return config;
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
