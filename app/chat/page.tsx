"use client";

import { useEffect, useRef, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import ChatMessages from "@/components/chat/ChatMessages";
import ChatInput from "@/components/chat/ChatInput";
import { useChat } from "@/lib/hooks/useChat";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { PlusCircle } from "lucide-react";

export default function ChatPage() {
  const { t } = useLanguage();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!isSidebarOpen || window.innerWidth >= 768) return;
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header
        isMobileMenuOpen={isSidebarOpen}
        setIsMobileMenuOpen={setIsSidebarOpen}
        exportChat={exportChat}
        showThemeToggle={true}
        showUserInfo={false}
        showBackButton={true}
      />

      <div className="flex flex-1 pt-16 md:pt-20">
        <div ref={sidebarRef} className="h-full">
          <Sidebar
            isMobileMenuOpen={isSidebarOpen}
            setIsMobileMenuOpen={setIsSidebarOpen}
            activePage="/chat"
            showRecentChats={true}
            clearChat={clearChat}
            onSelectChat={(chatId) => setCurrentChatId(chatId)}
            currentChatId={currentChatId}
          />
        </div>

        <main className="flex-1 flex flex-col overflow-hidden p-6">
          <div className="mb-6">
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-4 mb-4 rounded-md border border-destructive/20 shadow-sm flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 flex-shrink-0"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>{error}</span>
              </div>
            )}

            {isLoadingHistory && currentChatId && (
              <div className="flex justify-center items-center mb-4">
                <div className="flex items-center justify-center space-x-2 bg-muted/50 px-4 py-3 rounded-md shadow-sm">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent"></div>
                  <span className="text-sm font-medium text-muted-foreground">
                    {t.loadingHistory}
                  </span>
                </div>
              </div>
            )}

            {/* New Chat Button */}
            <button
              onClick={clearChat}
              className="flex items-center justify-center space-x-2 text-sm w-full p-3 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 shadow-sm hover:shadow mb-4"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              <span>{t.startNewChat || "Start New Chat"}</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto scroll-smooth mb-4 border rounded-lg">
            <ChatMessages
              messages={messages}
              isLoading={isLoading}
              isLoadingHistory={isLoadingHistory && currentChatId !== null}
            />
          </div>

          <div className="border rounded-lg p-4 bg-background/50 backdrop-blur-sm">
            <ChatInput
              input={input}
              setInput={setInput}
              handleSubmit={handleSubmit}
              isLoading={
                isLoading || (isLoadingHistory && currentChatId !== null)
              }
              disabled={status === "loading"}
              selectedCountry={selectedCountry}
              onSelectCountry={setSelectedCountry}
              onFileSelect={setSelectedFile}
              maxFileSize={10 * 1024 * 1024} // 10MB max file size
            />
          </div>
        </main>
      </div>
    </div>
  );
}
