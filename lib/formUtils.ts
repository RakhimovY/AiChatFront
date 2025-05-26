/**
 * Utility functions for handling form data
 */

import { MessageRequest } from './chatApi';

/**
 * Create FormData from a message request with document
 * 
 * @param message Message request containing document and other data
 * @returns FormData object with all message data
 */
export const createMessageFormData = (message: MessageRequest): FormData => {
  const formData = new FormData();

  // Add message data
  formData.append('content', message.content);
  if (message.chatId) formData.append('chatId', message.chatId.toString());
  if (message.country) formData.append('country', message.country);
  if (message.language) formData.append('language', message.language);

  // Add document if present
  if (message.document) {
    formData.append('document', message.document);
  }

  return formData;
};