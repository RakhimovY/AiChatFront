import { useRef, useEffect, useState } from "react";
import Message from "./Message";
import { Loader2, ArrowDown } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  documentUrl?: string;
  documentName?: string;
};

type ChatMessagesProps = {
  messages: Message[];
  isLoading: boolean;
  isLoadingHistory: boolean;
  userImage?: string;
};

export default function ChatMessages({ messages, isLoading, isLoadingHistory, userImage }: ChatMessagesProps) {
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const { t } = useLanguage();

  // Function to scroll to the bottom of the chat
  const scrollToBottom = () => {
    lastMessageRef.current?.scrollIntoView({ 
      behavior: "smooth", 
      block: "end" 
    });
  };

  // Check scroll position to show/hide scroll button
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      // Show button if scrolled up more than 200px from bottom
      const isScrolledUp = container.scrollHeight - container.scrollTop - container.clientHeight > 200;
      setShowScrollButton(isScrolledUp);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-scroll to the beginning of the last message when messages change
  useEffect(() => {
    if (messages.length > 0) {
      // Use a small timeout to ensure the DOM has updated before scrolling
      const scrollTimer = setTimeout(() => {
        scrollToBottom();
      }, 100);

      return () => clearTimeout(scrollTimer);
    }
  }, [messages]);

  return (
    <div className="space-y-6 p-1 md:p-2 relative" ref={messagesContainerRef}>
        {messages.map((message, index) => (
            <div 
              key={message.id} 
              ref={index === messages.length - 1 ? lastMessageRef : null}
              className={`animate-fadeIn ${index === messages.length - 1 ? 'animate-highlight' : ''}`}
            >
              <Message
                id={message.id}
                role={message.role}
                content={message.content}
                documentUrl={message.documentUrl}
                documentName={message.documentName}
              />
            </div>
          ))
        }

        {/* Scroll to bottom button */}
        {showScrollButton && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-4 right-4 bg-primary text-primary-foreground rounded-full p-2 shadow-md hover:shadow-lg transition-all duration-200 animate-fadeIn"
            aria-label="Scroll to latest messages"
          >
            <ArrowDown className="h-5 w-5" />
          </button>
        )}

      {/* Only show loading indicator if there are more than 1 message (not a new chat with just the first question) */}
      {isLoading && messages.length > 1 && (
        <Message
          id="loading"
          role="assistant"
          content={t.assistantTyping}
          isLoading={true}
        />
      )}
    </div>
  );
}
