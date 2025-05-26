import api from './api';
import { retryWithBackoff } from './retryUtils';

// Define types for subscription-related data
export interface Subscription {
  id: number;
  polarSubscriptionId: string;
  status: string;
  planId: string;
  planName: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  canceledAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionCancellationResponse {
  success: boolean;
  message: string;
  subscription: Subscription | null;
}

// Define interface for subscription status response
export interface SubscriptionStatusResponse {
  hasActiveSubscription: boolean;
  subscriptions: Subscription[];
  message: string;
}

// API client for subscription management
const subscriptionApi = {
  // Get all subscriptions for the authenticated user
  getUserSubscriptions: async (): Promise<Subscription[]> => {
    try {
      const response = await retryWithBackoff(() => 
        api.get('/subscriptions')
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching user subscriptions after retries:', error);
      throw error;
    }
  },

  // Get active subscriptions for the authenticated user
  getActiveSubscriptions: async (): Promise<Subscription[]> => {
    try {
      const response = await retryWithBackoff(() => 
        api.get('/subscriptions/active')
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching active subscriptions after retries:', error);
      throw error;
    }
  },

  // Check subscription status for the authenticated user
  checkSubscriptionStatus: async (): Promise<SubscriptionStatusResponse> => {
    try {
      const response = await retryWithBackoff(() => 
        api.get('/subscriptions/status')
      );
      return response.data;
    } catch (error) {
      console.error('Error checking subscription status after retries:', error);
      throw error;
    }
  },

  // Cancel a subscription
  cancelSubscription: async (polarSubscriptionId: string): Promise<SubscriptionCancellationResponse> => {
    try {
      const response = await retryWithBackoff(() => 
        api.post('/subscriptions/cancel', { polarSubscriptionId })
      );
      return response.data;
    } catch (error) {
      console.error('Error canceling subscription after retries:', error);
      throw error;
    }
  },

  // Notify the backend about a new subscription
  notifySubscriptionCreated: async (polarSubscriptionId: string): Promise<void> => {
    try {
      await retryWithBackoff(() => 
        api.post('/subscriptions/notify', { polarSubscriptionId })
      );
    } catch (error) {
      console.error('Error notifying subscription creation after retries:', error);
      throw error;
    }
  }
};

export default subscriptionApi;
