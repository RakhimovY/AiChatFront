"use client";

import { useEffect, useRef, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import ChatMessages from "@/components/chat/ChatMessages";
import ChatInput from "@/components/chat/ChatInput";
import { useChat } from "@/lib/hooks/useChat";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { AlertCircle, PlusCircle } from "lucide-react";

// Error message component for better reusability
const ErrorMessage = ({ message }: { message: string }) => (
  <div className="bg-destructive/10 text-destructive text-sm p-4 mb-4 rounded-md border border-destructive/20 shadow-sm flex items-center" role="alert" aria-live="assertive">
    <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
    <span>{message}</span>
  </div>
);

// Loading indicator component
const LoadingIndicator = ({ message }: { message: string }) => (
  <div className="flex justify-center items-center mb-4">
    <div className="flex items-center justify-center space-x-2 bg-muted/50 px-4 py-3 rounded-md shadow-sm">
      <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent" aria-hidden="true"></div>
      <span className="text-sm font-medium text-muted-foreground">{message}</span>
    </div>
  </div>
);

// New Chat Button component
const NewChatButton = ({ onClick, label }: { onClick: () => void; label: string }) => (
  <button
    onClick={onClick}
    className="flex items-center justify-center space-x-2 text-sm w-full p-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-all duration-200 shadow-sm hover:shadow"
    aria-label={label}
  >
    <PlusCircle className="h-4 w-4 mr-1.5" />
    <span>{label}</span>
  </button>
);

export default function ChatPage() {
  const { t } = useLanguage();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Set initial sidebar state based on screen width after component mounts
  useEffect(() => {
    setIsSidebarOpen(window.innerWidth >= 768);
  }, []);

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
      // Only close sidebar on outside clicks when it's open on mobile
      if (!isSidebarOpen || window.innerWidth >= 768) return;

      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    // Clean up event listener on component unmount
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
        {/* Sidebar container with ref for click-outside detection */}
        <aside ref={sidebarRef} className="h-full absolute md:relative top-0 left-0 z-10">
          <Sidebar
            isMobileMenuOpen={isSidebarOpen}
            setIsMobileMenuOpen={setIsSidebarOpen}
            activePage="/chat"
            showRecentChats={true}
            clearChat={clearChat}
            onSelectChat={(chatId) => setCurrentChatId(chatId)}
            currentChatId={currentChatId}
          />
        </aside>

        {/* Main chat area */}
        <main className="flex-1 flex flex-col overflow-hidden p-3" aria-label="Chat interface">
          {(error || isLoadingHistory && currentChatId) && <div className="mb-6">
            {/* Error message display */}
            {error && <ErrorMessage message={error}/>}

            {/* Loading history indicator */}
            {isLoadingHistory && currentChatId && (
                <LoadingIndicator message={t.loadingHistory}/>
            )}
          </div>}

          {/* Chat messages container */}
          <div 
            className="flex-1 overflow-y-auto scroll-smooth mb-4 border rounded-lg shadow-sm bg-background/50 chat-messages"
            aria-live="polite"
            aria-atomic="false"
            aria-relevant="additions"
            role="log"
          >
            <ChatMessages
              messages={messages}
              isLoading={isLoading}
              isLoadingHistory={isLoadingHistory && currentChatId !== null}
            />
          </div>

          {/* New Chat Button - only shown when chat is not new */}
          {messages.length > 1 || (messages.length === 1 && (messages[0].id !== "welcome" || messages[0].role !== "assistant")) ? (
            <div className="mb-4 px-1">
              <NewChatButton 
                onClick={clearChat} 
                label={t.startNewChat || "Start New Chat"} 
              />
            </div>
          ) : null}

          {/* Chat input area */}
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
