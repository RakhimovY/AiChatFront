import api from './api';
import axios from 'axios';
import { apiCache } from './apiCache';
import { retryWithBackoff } from './retryUtils';
import { createMessageFormData } from './formUtils';
import { getWithCache } from './cacheUtils';

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

// API functions


/**
 * Send a message with a document attachment
 */
const sendDocumentMessage = async (message: MessageRequest): Promise<ChatMessage[]> => {
  // Create FormData for file upload
  const formData = createMessageFormData(message);

  // Use retry mechanism with exponential backoff
  const response = await retryWithBackoff(() => 
    api.post<ChatMessage[]>('/chat/document', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  );

  return response.data;
};

/**
 * Send a text message without document
 */
const sendTextMessage = async (message: MessageRequest): Promise<ChatMessage[]> => {
  // Regular message without document
  const response = await retryWithBackoff(() => 
    api.post<ChatMessage[]>('/chat', message)
  );

  return response.data;
};

/**
 * Invalidate cache entries related to a message
 */
const invalidateMessageCache = (chatId?: number): void => {
  if (chatId) {
    // Invalidate specific chat history
    apiCache.invalidate(`chat_history_${chatId}`);
  }
  // Invalidate user chats list as a new chat might have been created
  apiCache.invalidate('user_chats');
};

/**
 * Send a message to the chat API
 */
export const sendMessage = async (message: MessageRequest): Promise<ChatMessage[]> => {
  try {
    let response;

    // Check if there's a document to upload
    if (message.document) {
      response = await sendDocumentMessage(message);
    } else {
      response = await sendTextMessage(message);
    }

    // Invalidate relevant cache entries
    invalidateMessageCache(message.chatId);

    return response;
  } catch (error) {
    console.error('Error sending message after retries:', error);
    throw error;
  }
};

// Function to get chat history with caching
export const getChatHistory = async (chatId: number): Promise<ChatMessage[]> => {
  const cacheKey = `chat_history_${chatId}`;

  try {
    return await getWithCache(
      cacheKey,
      async () => {
        const response = await retryWithBackoff(() => 
          api.get<ChatMessage[]>(`/chat/${chatId}`)
        );
        return response.data;
      },
      5 * 60 * 1000, // Cache for 5 minutes
      `Using cached chat history for chat ${chatId}`
    );
  } catch (error) {
    console.error('Error fetching chat history after retries:', error);
    throw error;
  }
};

// Function to get all chats for the current user with caching
export const getUserChats = async (): Promise<Chat[]> => {
  const cacheKey = 'user_chats';

  try {
    return await getWithCache(
      cacheKey,
      async () => {
        const response = await retryWithBackoff(() => 
          api.get<ChatDTO[]>('/chat')
        );

        // Ensure the response data is an array
        if (!Array.isArray(response.data)) {
          return [];
        }

        // Convert ChatDTO objects to Chat objects
        return response.data.map(chatDTO => ({
          id: chatDTO.id,
          title: chatDTO.title,
          createdAt: chatDTO.createdAt,
          messages: [] // Initialize with empty messages array
        }));
      },
      60 * 1000, // Cache for 1 minute
      'Using cached user chats'
    );
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
