"use client";

import { useRef, useState, useEffect } from "react";
import Sidebar from "@/components/chat/Sidebar";
import MobileHeader from "@/components/chat/MobileHeader";
import ChatMessages from "@/components/chat/ChatMessages";
import ChatInput from "@/components/chat/ChatInput";
import { useChat } from "@/lib/hooks/useChat";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

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
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen]);


  return (
    <div className="flex h-screen bg-background">
      <div ref={sidebarRef} className="h-full">
        <Sidebar 
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          clearChat={clearChat}
          onSelectChat={(chatId) => setCurrentChatId(chatId)}
          currentChatId={currentChatId}
        />
      </div>

      <div className="flex-1 flex flex-col h-full">
        <MobileHeader
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          exportChat={exportChat}
        />

        <div className="flex-1 flex flex-col h-full overflow-hidden pt-16">
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 m-4 rounded-md">
              {error}
            </div>
          )}

          {isLoadingHistory && currentChatId && (
            <div className="flex justify-center items-center p-4">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
              <span className="ml-2 text-sm text-muted-foreground">{t.loadingHistory}</span>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-4">
            <ChatMessages
              messages={messages}
              isLoading={isLoading}
              isLoadingHistory={isLoadingHistory && currentChatId !== null}
            />
          </div>

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
