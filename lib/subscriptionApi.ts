import axios from 'axios';

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

// API client for subscription management
const subscriptionApi = {
  // Get all subscriptions for the authenticated user
  getUserSubscriptions: async (): Promise<Subscription[]> => {
    try {
      const response = await axios.get('/api/subscriptions');
      return response.data;
    } catch (error) {
      console.error('Error fetching user subscriptions:', error);
      throw error;
    }
  },

  // Get active subscriptions for the authenticated user
  getActiveSubscriptions: async (): Promise<Subscription[]> => {
    try {
      const response = await axios.get('/api/subscriptions/active');
      return response.data;
    } catch (error) {
      console.error('Error fetching active subscriptions:', error);
      throw error;
    }
  },

  // Cancel a subscription
  cancelSubscription: async (polarSubscriptionId: string): Promise<SubscriptionCancellationResponse> => {
    try {
      const response = await axios.post('/api/subscriptions/cancel', { polarSubscriptionId });
      return response.data;
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  },

  // Notify the backend about a new subscription
  notifySubscriptionCreated: async (polarSubscriptionId: string): Promise<void> => {
    try {
      await axios.post('/api/subscriptions/notify', { polarSubscriptionId });
    } catch (error) {
      console.error('Error notifying subscription creation:', error);
      throw error;
    }
  }
};

export default subscriptionApi;
