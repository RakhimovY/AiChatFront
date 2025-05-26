"use client";

import { useRef, useState, useEffect } from "react";
import Sidebar from "@/components/chat/Sidebar";
import MobileHeader from "@/components/chat/MobileHeader";
import ChatMessages from "@/components/chat/ChatMessages";
import ChatInput from "@/components/chat/ChatInput";
import { useChat } from "@/lib/hooks/useChat";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export default function ChatPage() {
  // Get translations
  const { t } = useLanguage();

  // State for sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Reference to the sidebar element
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Use the chat hook to handle all chat functionality
  const {
    messages,
    input,
    setInput,
    isLoading,
    currentChatId,
    setCurrentChatId,
    isLoadingHistory,
    error,
    selectedCountry,
    setSelectedCountry,
    selectedFile,
    setSelectedFile,
    handleSubmit,
    clearChat,
    exportChat,
    status,
  } = useChat();

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


  return (
    <div className="flex h-screen bg-background">
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

        {/* Chat container */}
        <div className="flex-1 flex flex-col h-full overflow-hidden pt-16">
          {/* Error message */}
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 m-4 rounded-md">
              {error}
            </div>
          )}

          {/* Loading history indicator - only show for existing chats */}
          {isLoadingHistory && currentChatId && (
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
              isLoadingHistory={isLoadingHistory && currentChatId !== null}
            />
          </div>

          {/* Input area */}
          <div className="border-t p-4">
            <ChatInput
              input={input}
              setInput={setInput}
              handleSubmit={handleSubmit}
              isLoading={isLoading || (isLoadingHistory && currentChatId !== null)}
              disabled={status === "loading"}
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
