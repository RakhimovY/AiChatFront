"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Message } from "@/components/chat/types";
import { getSimulatedResponse } from "@/components/chat/utils";
import Sidebar from "@/components/chat/Sidebar";
import MobileHeader from "@/components/chat/MobileHeader";
import ChatMessages from "@/components/chat/ChatMessages";
import ChatInput from "@/components/chat/ChatInput";
import DemoLimitModal from "@/components/ui/DemoLimitModal";
import DemoInfo from "@/components/ui/DemoInfo";
import { useDemoStore, useInitializeDemoStore } from "@/store/demoStore";
import { sendMessage, convertToFrontendMessage, getChatHistory } from "@/lib/chatApi";

export default function ChatPage() {
  const searchParams = useSearchParams();
  const isDemoMode = searchParams.get("mode") === "demo";
  const { data: session, status } = useSession();

  // Initialize demo store if in demo mode
  useInitializeDemoStore();

  // Get demo store state and actions
  const {
    incrementRequestCount,
    isLimitExceeded,
    requestCount
  } = useDemoStore();

  // State for messages, loading state, and sidebar
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: isDemoMode
        ? "Здравствуйте! Вы используете демо-режим с ограничением в 10 запросов. Чем я могу вам помочь сегодня?"
        : "Здравствуйте! Я ваш юридический ассистент. Чем я могу вам помочь сегодня?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<number | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(session?.user?.country || null);

  // Reference to the sidebar element
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Fetch chat history when the component mounts or when the chat ID changes
  useEffect(() => {
    // Skip if in demo mode or not authenticated
    if (isDemoMode || status !== "authenticated" || !currentChatId) {
      return;
    }

    const fetchChatHistory = async () => {
      setIsLoadingHistory(true);
      setError(null);
      try {
        const chatHistory = await getChatHistory(currentChatId);
        if (chatHistory.length > 0) {
          const frontendMessages = chatHistory.map(convertToFrontendMessage);
          setMessages(frontendMessages);
        }
      } catch (error) {
        console.error("Error fetching chat history:", error);
        setError("Не удалось загрузить историю чата. Пожалуйста, попробуйте еще раз.");
      } finally {
        setIsLoadingHistory(false);
      }
    };

    fetchChatHistory();
  }, [currentChatId, isDemoMode, status]);

  // Handle clicks outside the sidebar to close it on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Only proceed if the sidebar is open and we're on mobile
      if (!isSidebarOpen || window.innerWidth >= 768) return;

      // Check if the click was outside the sidebar
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsSidebarOpen(false);
      }
    };

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);

    // Clean up
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen]);

  // Poll for new messages every 5 seconds
  useEffect(() => {
    // Skip if in demo mode, not authenticated, or no chat ID
    if (isDemoMode || status !== "authenticated" || !currentChatId || isLoading) {
      return;
    }

    const pollInterval = setInterval(async () => {
      try {
        const chatHistory = await getChatHistory(currentChatId);
        if (chatHistory.length > 0) {
          const frontendMessages = chatHistory.map(convertToFrontendMessage);
          // Only update if there are new messages
          if (frontendMessages.length > messages.length) {
            setMessages(frontendMessages);
          }
        }
        // Clear any previous errors if successful
        if (error) {
          setError(null);
        }
      } catch (error) {
        console.error("Error polling for new messages:", error);

        // Check if it's an authentication error (401)
        const isAuthError = (error as any)?.response?.status === 401;

        if (isAuthError) {
          // For auth errors, set a specific error message but don't disrupt the experience
          setError("Ошибка авторизации при обновлении чата. Пожалуйста, обновите страницу.");
        }
        // For other errors, don't show error messages to avoid disrupting the user experience
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(pollInterval);
  }, [currentChatId, isDemoMode, status, isLoading, messages.length, error]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isLoading) return;

    // Check if demo limit is exceeded
    if (isDemoMode && isLimitExceeded) {
      return;
    }

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

    // Increment request count if in demo mode
    if (isDemoMode) {
      incrementRequestCount();
    }

    setError(null);
    try {
      // If in demo mode or not authenticated, use simulated response
      if (isDemoMode || status !== "authenticated") {
        setTimeout(() => {
          // If demo limit was exceeded after incrementing, show a special message
          if (isDemoMode && isLimitExceeded) {
            const limitMessage: Message = {
              id: `limit-${userMessageId}`,
              role: "assistant",
              content: "Вы достигли лимита в 10 запросов в демо-режиме. Пожалуйста, зарегистрируйтесь или выберите тариф, чтобы продолжить использование сервиса.",
              timestamp: new Date(),
            };

            setMessages((prev) => [...prev, limitMessage]);
          } else {
            // Normal response
            const assistantMessage: Message = {
              id: `response-${userMessageId}`,
              role: "assistant",
              content: getSimulatedResponse(input),
              timestamp: new Date(),
            };

            setMessages((prev) => [...prev, assistantMessage]);
          }

          setIsLoading(false);
        }, 1500);
      } else {
        // Use the backend API for authenticated users
        const response = await sendMessage(
          currentChatId
            ? { chatId: currentChatId, content: input, country: selectedCountry }
            : { content: input, country: selectedCountry }
        );

        // Update the current chat ID if this is a new chat
        if (!currentChatId && response.length > 0) {
          setCurrentChatId(response[0].chatId);
        }

        // Convert backend messages to frontend format and update the state
        const frontendMessages = response.map(convertToFrontendMessage);
        setMessages(frontendMessages);
        setIsLoading(false);
      }
    } catch (error: unknown) {
      console.error("Error sending message:", error);
      setIsLoading(false);

      // Check if it's an authentication error (401)
      const isAuthError = (error as any)?.response?.status === 401;

      // Set appropriate error state
      if (isAuthError) {
        setError("Ошибка авторизации. Пожалуйста, обновите страницу или войдите в систему заново.");
      } else {
        setError("Произошла ошибка при отправке сообщения. Пожалуйста, попробуйте еще раз.");
      }

      // Add error message to chat
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${userMessageId}`,
          role: "assistant",
          content: isAuthError
            ? "Извините, возникла проблема с авторизацией. Пожалуйста, обновите страницу или войдите в систему заново."
            : "Извините, произошла ошибка при обработке вашего запроса. Пожалуйста, попробуйте еще раз.",
          timestamp: new Date(),
        },
      ]);
    }
  };

  // Clear chat history and start a new chat
  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: isDemoMode
          ? "Здравствуйте! Вы начали новый чат. Вы используете демо-режим с ограничением в 10 запросов. Чем я могу вам помочь сегодня?"
          : "Здравствуйте! Вы начали новый чат. Я ваш юридический ассистент, готовый ответить на ваши вопросы. Чем я могу вам помочь сегодня?",
        timestamp: new Date(),
      },
    ]);
    // Reset the current chat ID to allow creating a new chat
    setCurrentChatId(null);
    // Clear input field if there's any text
    setInput("");
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
      {/* Demo limit modal */}
      {isDemoMode && <DemoLimitModal />}

      {/* Sidebar */}
      <div ref={sidebarRef} className="h-full">
        <Sidebar 
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          clearChat={clearChat}
          onSelectChat={(chatId) => setCurrentChatId(chatId)}
          currentChatId={currentChatId}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col h-full">
        {/* Mobile header */}
        <MobileHeader
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          exportChat={exportChat}
        />

        {/* Demo mode info */}
        {isDemoMode && <DemoInfo />}

        {/* Chat container */}
        <div className="flex-1 flex flex-col h-full overflow-hidden pt-16">
          {/* Error message */}
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 m-4 rounded-md">
              {error}
            </div>
          )}

          {/* Loading history indicator */}
          {isLoadingHistory && (
            <div className="flex justify-center items-center p-4">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
              <span className="ml-2 text-sm text-muted-foreground">Загрузка истории чата...</span>
            </div>
          )}

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
              isLoading={isLoading || isLoadingHistory}
              disabled={(isDemoMode && isLimitExceeded) || status === "loading"}
              selectedCountry={selectedCountry}
              onSelectCountry={setSelectedCountry}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
