import api from './api';
import { getSession } from 'next-auth/react';

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
  country?: string;
  language?: string;
}

export interface StreamCallbacks {
  onMessage: (content: string, messageId: string) => void;
  onComplete: () => void;
  onError: (error: any) => void;
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
    const response = await api.post<ChatMessage[]>('/chat/ask', message);
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
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

// Function to send a message and receive streaming response
export const sendMessageStream = async (
  message: MessageRequest,
  callbacks: StreamCallbacks
): Promise<() => void> => {
  let abortController = new AbortController();

  // Set up a timeout to prevent hanging connections
  // Using 3 minutes (180000ms) to match the backend timeout
  const timeoutId = setTimeout(() => {
    console.warn('Stream request timed out after 3 minutes');
    abortController.abort();
    callbacks.onError(new Error('Request timed out'));
  }, 180000); // 3 minute timeout

  try {
    // Get the session to access the token
    const session = await getSession();

    // Prepare headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'text/event-stream',
    };

    // Add Authorization header if session has an access token
    if (session?.accessToken) {
      headers['Authorization'] = `Bearer ${session.accessToken}`;
    }

    // Make a POST request to the streaming endpoint
    const response = await fetch(`${api.defaults.baseURL}/chat/ask/stream`, {
      method: 'POST',
      headers,
      body: JSON.stringify(message),
      credentials: 'include', // Include cookies for authentication
      signal: abortController.signal,
      // Add cache control to prevent caching of the response
      cache: 'no-store',
      // Ensure proper handling of chunked encoding
      keepalive: true,
      // Disable request timeout to prevent ERR_INCOMPLETE_CHUNKED_ENCODING
      timeout: 0,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (!response.body) {
      throw new Error('Response body is null');
    }

    // Get a reader from the response body stream
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    // Function to process the stream
    const processStream = async () => {
      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            // Clear the timeout and call onComplete when the stream is done
            clearTimeout(timeoutId);

            // Ensure we process any remaining data in the buffer before completing
            if (buffer.trim()) {
              try {
                const eventMatch = buffer.match(/^id:\s*(.+)$/m);
                const dataMatch = buffer.match(/^data:\s*(.+)$/m);

                if (dataMatch) {
                  const data = dataMatch[1];
                  const eventId = eventMatch ? eventMatch[1] : '';

                  // Process the final chunk
                  if (eventId === 'complete') {
                    // This is a completion event
                  } else if (eventId === 'error') {
                    callbacks.onError(new Error(data));
                    return;
                  } else if (eventId === 'timeout') {
                    callbacks.onError(new Error('Request timed out on the server'));
                    return;
                  } else {
                    // Handle regular message chunks
                    callbacks.onMessage(data, eventId);
                  }
                }
              } catch (finalParseError) {
                console.error('Error parsing final SSE message:', finalParseError, 'Message:', buffer);
              }
            }

            callbacks.onComplete();
            break;
          }

          // Decode the chunk and add it to the buffer
          // Use { stream: true } to handle multi-chunk messages correctly
          buffer += decoder.decode(value, { stream: true });

          // Process complete SSE messages in the buffer
          // In SSE format, each message is separated by double newlines
          // and consists of fields like "id: value" and "data: value" on separate lines
          const lines = buffer.split('\n\n');
          buffer = lines.pop() || ''; // Keep the last incomplete chunk in the buffer

          for (const line of lines) {
            if (!line.trim()) continue;

            try {
              // Parse the SSE message - more robust parsing
              // Look for id and data fields in any order
              const eventMatch = line.match(/^id:\s*(.+)$/m);
              const dataMatch = line.match(/^data:\s*(.+)$/m);

              // If we have data, process it
              if (dataMatch) {
                const data = dataMatch[1];
                const eventId = eventMatch ? eventMatch[1] : '';

                // Check if this is a completion event
                if (eventId === 'complete') {
                  // Clear the timeout and call onComplete when we receive a completion event
                  clearTimeout(timeoutId);
                  callbacks.onComplete();
                  return;
                }

                // Check if this is an error event
                if (eventId === 'error') {
                  // Clear the timeout and call onError when we receive an error event
                  clearTimeout(timeoutId);
                  callbacks.onError(new Error(data));
                  return;
                }

                // Check if this is a timeout event
                if (eventId === 'timeout') {
                  // Clear the timeout and call onError when we receive a timeout event
                  clearTimeout(timeoutId);
                  callbacks.onError(new Error('Request timed out on the server'));
                  return;
                }

                // Handle regular message chunks
                callbacks.onMessage(data, eventId);
              }
            } catch (parseError) {
              console.error('Error parsing SSE message:', parseError, 'Message:', line);
              // Continue processing other messages even if one fails
            }
          }
        }
      } catch (error) {
        // Clear the timeout when there's an error processing the stream
        clearTimeout(timeoutId);

        // Close the reader if possible to properly terminate the stream
        try {
          reader.cancel().catch(cancelError => {
            console.error('Error cancelling reader:', cancelError);
          });
        } catch (readerError) {
          console.error('Error accessing reader for cancellation:', readerError);
        }

        if (error.name !== 'AbortError') {
          console.error('Error processing stream:', error);
          callbacks.onError(error);
        }
      }
    };

    // Start processing the stream
    processStream();

    // Return a function to abort the request and clean up resources
    return () => {
      clearTimeout(timeoutId);

      // Cancel the reader if it's still active
      try {
        reader.cancel().catch(cancelError => {
          console.error('Error cancelling reader during cleanup:', cancelError);
        });
      } catch (readerError) {
        console.error('Error accessing reader for cancellation during cleanup:', readerError);
      }

      // Abort the request
      abortController.abort();
    };
  } catch (error) {
    // Clean up the timeout if there's an error
    clearTimeout(timeoutId);

    // If we have a reader, try to cancel it
    if (typeof reader !== 'undefined') {
      try {
        reader.cancel().catch(cancelError => {
          console.error('Error cancelling reader during error handling:', cancelError);
        });
      } catch (readerError) {
        console.error('Error accessing reader for cancellation during error handling:', readerError);
      }
    }

    console.error('Error setting up streaming connection:', error);
    callbacks.onError(error);

    // Return a function that aborts the request if it's still active
    return () => {
      try {
        abortController.abort();
      } catch (abortError) {
        console.error('Error aborting request during cleanup:', abortError);
      }
    };
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
