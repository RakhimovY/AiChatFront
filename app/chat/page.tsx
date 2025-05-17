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
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export default function ChatPage() {
  const searchParams = useSearchParams();
  const isDemoMode = searchParams.get("mode") === "demo";
  const { data: session, status } = useSession();
  const { language, t } = useLanguage();

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
        ? t.welcomeMessageDemo
        : t.welcomeMessage,
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
        setError(t.errorLoading);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    fetchChatHistory();
  }, [currentChatId, isDemoMode, status, language]); // Added language dependency to re-fetch when language changes

  // Update welcome message when language changes
  useEffect(() => {
    // Only update if there's no active chat (showing welcome message)
    if (!currentChatId && messages.length === 1 && messages[0].id === "welcome") {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: isDemoMode
            ? t.welcomeMessageDemo
            : t.welcomeMessage,
          timestamp: new Date(),
        },
      ]);
    }
  }, [language, isDemoMode, t]);

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
          setError(t.errorAuth);
        }
        // For other errors, don't show error messages to avoid disrupting the user experience
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(pollInterval);
  }, [currentChatId, isDemoMode, status, isLoading, messages.length, error, language]); // Added language dependency

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
              content: t.demoLimitReached,
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
            ? { 
                chatId: currentChatId, 
                content: input, 
                country: selectedCountry, 
                language,
                document: selectedFile 
              }
            : { 
                content: input, 
                country: selectedCountry, 
                language,
                document: selectedFile 
              }
        );

        // Update the current chat ID if this is a new chat
        if (!currentChatId && response.length > 0) {
          setCurrentChatId(response[0].chatId);
        }

        // Convert backend messages to frontend format and update the state
        const frontendMessages = response.map(convertToFrontendMessage);
        setMessages(frontendMessages);
        setIsLoading(false);

        // Clear the selected file after sending
        setSelectedFile(null);
      }
    } catch (error: unknown) {
      console.error("Error sending message:", error);
      setIsLoading(false);

      // Check if it's an authentication error (401)
      const isAuthError = (error as any)?.response?.status === 401;

      // Set appropriate error state
      if (isAuthError) {
        setError(t.errorAuth);
      } else {
        setError(t.errorSending);
      }

      // Add error message to chat
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${userMessageId}`,
          role: "assistant",
          content: isAuthError
            ? t.errorAuth
            : t.errorSending,
          timestamp: new Date(),
        },
      ]);

      // Clear the selected file on error
      setSelectedFile(null);
    }
  };

  // Clear chat history and start a new chat
  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: isDemoMode
          ? t.newChatMessageDemo
          : t.newChatMessage,
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
      .map((msg) => `${msg.role === "user" ? t.user : t.assistant}: ${msg.content}`)
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
              <span className="ml-2 text-sm text-muted-foreground">{t.loadingHistory}</span>
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
              onFileSelect={setSelectedFile}
              maxFileSize={10 * 1024 * 1024} // 10MB max file size
            />
          </div>
        </div>
      </div>
    </div>
  );
}
