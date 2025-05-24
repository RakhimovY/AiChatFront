import api from './api';

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
      const response = await api.get('/subscriptions');
      return response.data;
    } catch (error) {
      console.error('Error fetching user subscriptions:', error);
      throw error;
    }
  },

  // Get active subscriptions for the authenticated user
  getActiveSubscriptions: async (): Promise<Subscription[]> => {
    try {
      const response = await api.get('/subscriptions/active');
      return response.data;
    } catch (error) {
      console.error('Error fetching active subscriptions:', error);
      throw error;
    }
  },

  // Check subscription status for the authenticated user
  checkSubscriptionStatus: async (): Promise<SubscriptionStatusResponse> => {
    try {
      const response = await api.get('/subscriptions/status');
      return response.data;
    } catch (error) {
      console.error('Error checking subscription status:', error);
      throw error;
    }
  },

  // Cancel a subscription
  cancelSubscription: async (polarSubscriptionId: string): Promise<SubscriptionCancellationResponse> => {
    try {
      const response = await api.post('/subscriptions/cancel', { polarSubscriptionId });
      return response.data;
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  },

  // Notify the backend about a new subscription
  notifySubscriptionCreated: async (polarSubscriptionId: string): Promise<void> => {
    try {
      await api.post('/subscriptions/notify', { polarSubscriptionId });
    } catch (error) {
      console.error('Error notifying subscription creation:', error);
      throw error;
    }
  }
};

export default subscriptionApi;
