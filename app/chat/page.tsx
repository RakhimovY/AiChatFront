"use client";

import { useState } from "react";
import { Message } from "@/components/chat/types";
import { getSimulatedResponse } from "@/components/chat/utils";
import Sidebar from "@/components/chat/Sidebar";
import MobileHeader from "@/components/chat/MobileHeader";
import ChatMessages from "@/components/chat/ChatMessages";
import ChatInput from "@/components/chat/ChatInput";

export default function ChatPage() {
  // State for messages, loading state, and sidebar
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Здравствуйте! Я ваш юридический ассистент. Чем я могу вам помочь сегодня?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isLoading) return;

    // Generate a unique ID for the message
    const userMessageId = Date.now().toString();

    // Add user message to the chat
    const userMessage: Message = {
      id: userMessageId,
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // In a real application, this would be an API call to your backend
      // For demo purposes, we'll simulate a response after a delay
      setTimeout(() => {
        const assistantMessage: Message = {
          id: `response-${userMessageId}`,
          role: "assistant",
          content: getSimulatedResponse(input),
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 1500);

    } catch (error) {
      console.error("Error sending message:", error);
      setIsLoading(false);

      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${userMessageId}`,
          role: "assistant",
          content: "Извините, произошла ошибка при обработке вашего запроса. Пожалуйста, попробуйте еще раз.",
          timestamp: new Date(),
        },
      ]);
    }
  };

  // Clear chat history
  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "Чат очищен. Чем я могу вам помочь?",
        timestamp: new Date(),
      },
    ]);
  };

  // Export chat history
  const exportChat = () => {
    const chatText = messages
      .map((msg) => `${msg.role === "user" ? "Вы" : "Ассистент"}: ${msg.content}`)
      .join("\n\n");

    const blob = new Blob([chatText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `legal-gpt-chat-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar 
        isSidebarOpen={isSidebarOpen}
        clearChat={clearChat}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col h-full">
        {/* Mobile header */}
        <MobileHeader 
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          exportChat={exportChat}
        />

        {/* Chat container */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4">
            <ChatMessages 
              messages={messages}
              isLoading={isLoading}
            />
          </div>

          {/* Input area */}
          <div className="border-t p-4">
            <ChatInput 
              input={input}
              setInput={setInput}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
