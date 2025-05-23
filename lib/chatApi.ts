import api from './api';
import axios from 'axios';

// Types
export interface ChatMessage {
  id: number;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
  chatId: number;
}

export interface MessageRequest {
  chatId?: number;
  content: string;
  country?: string | null;
  language?: string;
  document?: File| null;
}

export interface ChatDTO {
  id: number;
  title: string | null;
  createdAt: string;
  messageCount: number;
}

export interface Chat {
  id: number;
  title: string | null;
  createdAt: string;
  messages: ChatMessage[];
}

// Simple in-memory cache for API responses
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresIn: number; // milliseconds
}

class ApiCache {
  private cache: Record<string, CacheEntry<any>> = {};

  // Set a cache entry with expiration
  set<T>(key: string, data: T, expiresIn: number = 60000): void { // Default: 1 minute
    this.cache[key] = {
      data,
      timestamp: Date.now(),
      expiresIn
    };
  }

  // Get a cache entry if it exists and is not expired
  get<T>(key: string): T | null {
    const entry = this.cache[key];
    if (!entry) return null;

    const isExpired = Date.now() > entry.timestamp + entry.expiresIn;
    if (isExpired) {
      delete this.cache[key];
      return null;
    }

    return entry.data as T;
  }

  // Invalidate a specific cache entry
  invalidate(key: string): void {
    delete this.cache[key];
  }

  // Invalidate all cache entries that match a prefix
  invalidateByPrefix(prefix: string): void {
    Object.keys(this.cache).forEach(key => {
      if (key.startsWith(prefix)) {
        delete this.cache[key];
      }
    });
  }

  // Clear the entire cache
  clear(): void {
    this.cache = {};
  }
}

// Create a singleton instance of the cache
export const apiCache = new ApiCache();

// API functions

// Helper function for exponential backoff retry
const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> => {
  let retries = 0;
  let lastError: any;

  while (retries < maxRetries) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry on 4xx errors (client errors)
      if (axios.isAxiosError(error) && error.response && error.response.status >= 400 && error.response.status < 500) {
        throw error;
      }

      // If this is the last retry, throw the error
      if (retries === maxRetries - 1) {
        throw error;
      }

      // Calculate backoff delay: 1s, 2s, 4s, etc.
      const delay = initialDelay * Math.pow(2, retries);
      console.log(`Retry attempt ${retries + 1} after ${delay}ms`);

      // Wait for the backoff period
      await new Promise(resolve => setTimeout(resolve, delay));

      retries++;
    }
  }

  // This should never be reached, but TypeScript requires a return
  throw lastError;
};

export const sendMessage = async (message: MessageRequest): Promise<ChatMessage[]> => {
  try {
    let response;

    // Check if there's a document to upload
    if (message.document) {
      // Create FormData for file upload
      const formData = new FormData();

      // Add message data
      formData.append('content', message.content);
      if (message.chatId) formData.append('chatId', message.chatId.toString());
      if (message.country) formData.append('country', message.country);
      if (message.language) formData.append('language', message.language);

      // Add document
      formData.append('document', message.document);

      // Use retry mechanism with exponential backoff
      response = await retryWithBackoff(() => 
        api.post<ChatMessage[]>('/chat/document', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      );
    } else {
      // Regular message without document
      response = await retryWithBackoff(() => 
        api.post<ChatMessage[]>('/chat', message)
      );
    }

    // Invalidate relevant cache entries
    if (message.chatId) {
      // Invalidate specific chat history
      apiCache.invalidate(`chat_history_${message.chatId}`);
    }
    // Invalidate user chats list as a new chat might have been created
    apiCache.invalidate('user_chats');

    return response.data;
  } catch (error) {
    console.error('Error sending message after retries:', error);
    throw error;
  }
};

// Function to get chat history with caching
export const getChatHistory = async (chatId: number): Promise<ChatMessage[]> => {
  const cacheKey = `chat_history_${chatId}`;

  try {
    // Check if we have a cached response
    const cachedData = apiCache.get<ChatMessage[]>(cacheKey);
    if (cachedData) {
      console.log(`Using cached chat history for chat ${chatId}`);
      return cachedData;
    }

    // If not in cache, fetch from API
    const response = await retryWithBackoff(() => 
      api.get<ChatMessage[]>(`/chat/${chatId}`)
    );

    // Cache the response for 5 minutes
    apiCache.set(cacheKey, response.data, 5 * 60 * 1000);

    return response.data;
  } catch (error) {
    console.error('Error fetching chat history after retries:', error);
    throw error;
  }
};

// Function to get all chats for the current user with caching
export const getUserChats = async (): Promise<Chat[]> => {
  const cacheKey = 'user_chats';

  try {
    // Check if we have a cached response
    const cachedData = apiCache.get<Chat[]>(cacheKey);
    if (cachedData) {
      console.log('Using cached user chats');
      return cachedData;
    }

    // If not in cache, fetch from API
    const response = await retryWithBackoff(() => 
      api.get<ChatDTO[]>('/chat')
    );

    // Ensure the response data is an array
    if (!Array.isArray(response.data)) {
      return [];
    }

    // Convert ChatDTO objects to Chat objects
    const chats = response.data.map(chatDTO => ({
      id: chatDTO.id,
      title: chatDTO.title,
      createdAt: chatDTO.createdAt,
      messages: [] // Initialize with empty messages array
    }));

    // Cache the response for 1 minute
    apiCache.set(cacheKey, chats, 60 * 1000);

    return chats;
  } catch (error) {
    console.error('Error fetching user chats after retries:', error);
    // Return empty array instead of throwing to prevent UI errors
    return [];
  }
};

// Function to delete a chat
export const deleteChat = async (chatId: number): Promise<void> => {
  try {
    await retryWithBackoff(() => 
      api.delete(`/chat/${chatId}`)
    );

    // Invalidate relevant cache entries
    apiCache.invalidate(`chat_history_${chatId}`);
    apiCache.invalidate('user_chats');
  } catch (error) {
    console.error('Error deleting chat after retries:', error);
    throw error;
  }
};

// Function to convert backend message format to frontend format
export const convertToFrontendMessage = (message: ChatMessage) => {
  return {
    id: message.id.toString(),
    role: message.role,
    content: message.content,
    timestamp: new Date(message.createdAt),
    chatId: message.chatId
  };
};
