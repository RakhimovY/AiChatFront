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
  userImage?: string;
};

export default function ChatMessages({ messages, isLoading, userImage }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <Message
          key={message.id}
          id={message.id}
          role={message.role}
          content={message.content}
          documentUrl={message.documentUrl}
          documentName={message.documentName}
          userImage={userImage}
        />
      ))}

      {isLoading && (
        <Message
          id="loading"
          role="assistant"
          content={t.assistantTyping}
          isLoading={true}
          userImage={userImage}
        />
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
