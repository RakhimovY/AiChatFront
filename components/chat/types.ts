/**
 * Type definitions for the chat components
 */

export type MessageRole = "user" | "assistant";

export type Message = {
  /** Unique identifier for the message */
  id: string;
  /** Role of the message sender */
  role: MessageRole;
  /** Content of the message */
  content: string;
  /** Timestamp when the message was sent */
  timestamp: Date;
  /** Optional URL to an attached document */
  documentUrl?: string;
  /** Optional name of the attached document */
  documentName?: string;
  /** Optional loading state of the message */
  isLoading?: boolean;
};

export type ListItemType = 'bullet' | 'numbered';

export type ListItem = {
  /** Type of list item (bullet or numbered) */
  type: ListItemType;
  /** Content of the list item */
  content: string;
  /** Number for numbered lists */
  number?: number;
  /** Nested list items */
  nested: ListItem[];
};
