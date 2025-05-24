import { useRef, useEffect } from "react";
import Message from "./Message";
import { Loader2 } from "lucide-react";
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
  const { t } = useLanguage();

  // Auto-scroll to the beginning of the last message when messages change
  useEffect(() => {
    if (messages.length > 0) {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="space-y-4">
        {messages.map((message, index) => (
            <div 
              key={message.id} 
              ref={index === messages.length - 1 ? lastMessageRef : null}
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
