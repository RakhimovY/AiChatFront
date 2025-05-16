import { useRef, useEffect } from "react";
import Message from "./Message";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
};

type ChatMessagesProps = {
  messages: Message[];
  isLoading: boolean;
};

export default function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  // Auto-scroll to bottom only in specific cases to avoid disrupting user's reading
  useEffect(() => {
    // Check if we should auto-scroll
    const shouldAutoScroll = () => {
      // Always scroll if this is the first set of messages
      if (messages.length <= 1) return true;

      // Check if the user is already near the bottom
      const container = messagesEndRef.current?.parentElement;
      if (container) {
        const { scrollTop, scrollHeight, clientHeight } = container;
        // If user is within 100px of the bottom, auto-scroll
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
        return isNearBottom;
      }

      // Check if the latest message is being streamed (show new content as it arrives)
      const latestMessage = messages[messages.length - 1];
      if (latestMessage?.isStreaming) return true;

      return false;
    };

    // Only scroll if conditions are met
    if (shouldAutoScroll()) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <Message
          key={message.id}
          id={message.id}
          role={message.role}
          content={message.content}
          isStreaming={message.isStreaming}
        />
      ))}

      {isLoading && (
        <Message
          id="loading"
          role="assistant"
          content={t.assistantTyping}
          isLoading={true}
        />
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
