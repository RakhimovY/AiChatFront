/**
 * Type definitions for the chat components
 */

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  documentUrl?: string;
  documentName?: string;
  imageUrl?: string;
  imageId?: string;
  imageAlt?: string;
};
