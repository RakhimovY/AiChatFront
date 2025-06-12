"use client";

import { useEffect, useRef, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import ChatMessages from "@/components/chat/ChatMessages";
import ChatInput from "@/components/chat/ChatInput";
import { useChat } from "@/lib/hooks/useChat";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { AlertCircle } from "lucide-react";

type ErrorMessageProps = {
  message: string;
};

const ErrorMessage = ({ message }: ErrorMessageProps) => (
  <div
    className="bg-destructive/10 text-destructive text-sm p-4 mb-4 rounded-md border border-destructive/20 shadow-sm flex items-center"
    role="alert"
    aria-live="assertive"
  >
    <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
    <span>{message}</span>
  </div>
);

type LoadingIndicatorProps = {
  message: string;
};

const LoadingIndicator = ({ message }: LoadingIndicatorProps) => (
  <div className="flex justify-center items-center mb-4">
    <div className="flex items-center justify-center space-x-2 bg-muted/50 px-4 py-3 rounded-md shadow-sm">
      <div
        className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent"
        aria-hidden="true"
      />
      <span className="text-sm font-medium text-muted-foreground">
        {message}
      </span>
    </div>
  </div>
);

type ChatContainerProps = {
  children: React.ReactNode;
};

const ChatContainer = ({ children }: ChatContainerProps) => (
  <div
    className="flex-1 overflow-y-auto scroll-smooth mb-4 border rounded-lg shadow-sm bg-background/50 chat-messages"
    aria-live="polite"
    aria-atomic="false"
    aria-relevant="additions"
    role="log"
  >
    {children}
  </div>
);

type ChatInputContainerProps = {
  children: React.ReactNode;
};

const ChatInputContainer = ({ children }: ChatInputContainerProps) => (
  <>  
  {children}
  </>  
);

const ChatPage = () => {
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
    setIsSidebarOpen(window.innerWidth >= 768);
  }, []);

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSidebarOpen]);

  const handleChatSelect = (chatId: number) => {
    setCurrentChatId(chatId);
  };

  const handleCountryChange = (country: string | null) => {
    setSelectedCountry(country);
  };

  const handleSendMessage = (message: string, file?: File) => {
    setInput(message);
    if (file) {
      setSelectedFile(file);
    }
    handleSubmit(new Event('submit') as any);
  };

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
        <aside ref={sidebarRef}>
          <Sidebar
            isMobileMenuOpen={isSidebarOpen}
            setIsMobileMenuOpen={setIsSidebarOpen}
            activePage="/chat"
            showRecentChats={true}
            clearChat={clearChat}
            onSelectChat={handleChatSelect}
            currentChatId={currentChatId}
          />
        </aside>

        <main className="flex-1 flex flex-col overflow-hidden p-3" aria-label="Chat interface">
          {(error || (isLoadingHistory && currentChatId)) && (
            <div className="mb-6">
              {error && <ErrorMessage message={error} />}
              {isLoadingHistory && currentChatId && (
                <LoadingIndicator message={t.loadingHistory} />
              )}
            </div>
          )}

          <ChatContainer>
            <ChatMessages
              messages={messages}
              isLoading={isLoading}
              isLoadingHistory={isLoadingHistory && currentChatId !== null}
            />
          </ChatContainer>

          <ChatInputContainer>
            <ChatInput
              onSendMessage={handleSendMessage}
              isLoading={isLoading || (isLoadingHistory && currentChatId !== null)}
              selectedCountry={selectedCountry}
              onCountryChange={handleCountryChange}
            />
          </ChatInputContainer>
        </main>
      </div>
    </div>
  );
};

export default ChatPage;
