import api from './api';

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
export const sendMessage = async (message: MessageRequest): Promise<ChatMessage[]> => {
  try {
    // Enhance the message with formatting instructions
    const enhancedMessage: MessageRequest = {
      ...message,
      content: enhancePromptWithFormatting(message.content)
    };

    const response = await api.post<ChatMessage[]>('/chat/ask', enhancedMessage);
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// Function to enhance the prompt with formatting instructions
const enhancePromptWithFormatting = (content: string): string => {
  // Simply return the original content without adding formatting instructions
  return content;
};

// Function to get chat history
export const getChatHistory = async (chatId: number): Promise<ChatMessage[]> => {
  try {
    const response = await api.get<ChatMessage[]>(`/chat/${chatId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching chat history:', error);
    throw error;
  }
};

// Function to get all chats for the current user
export const getUserChats = async (): Promise<Chat[]> => {
  try {
    const response = await api.get<ChatDTO[]>('/chat/user');

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
  } catch (error) {
    console.error('Error fetching user chats:', error);
    // Return empty array instead of throwing to prevent UI errors
    return [];
  }
};

// Function to delete a chat
export const deleteChat = async (chatId: number): Promise<void> => {
  try {
    await api.delete(`/chat/${chatId}`);
  } catch (error) {
    console.error('Error deleting chat:', error);
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
