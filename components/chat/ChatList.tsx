import { useState } from "react";
import { MessageSquare, X, Loader2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { deleteChat } from "@/lib/chatApi";

interface Chat {
  id: number;
  title: string | null;
  createdAt: string;
}

interface ChatListProps {
  chats: Chat[];
  isLoading: boolean;
  error: string | null;
  currentChatId: number | null;
  onSelectChat: (chatId: number) => void;
  clearChat: () => void;
  closeSidebarOnMobile?: () => void;
  onChatDeleted?: (chatId: number) => void;
}

/**
 * Component for displaying a list of chats
 */
export default function ChatList({
  chats,
  isLoading,
  error,
  currentChatId,
  onSelectChat,
  clearChat,
  closeSidebarOnMobile,
  onChatDeleted
}: ChatListProps) {
  const { t } = useLanguage();
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  // Format chat title
  const formatChatTitle = (chat: Chat) => {
    if (chat.title) return chat.title;

    // Format date for display
    const date = new Date(chat.createdAt);
    return `${t.chatFrom} ${date.toLocaleDateString()}`;
  };

  // Handle chat selection
  const handleSelectChat = (chatId: number) => {
    onSelectChat(chatId);
    // Close sidebar on mobile after selecting a chat
    if (closeSidebarOnMobile && window.innerWidth < 768) {
      closeSidebarOnMobile();
    }
  };

  // Handle chat deletion
  const handleDeleteChat = async (chatId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent chat selection when clicking delete button

    if (isDeleting) return; // Prevent multiple deletion requests

    setIsDeleting(chatId);
    try {
      await deleteChat(chatId);

      // If the deleted chat was selected, clear the selection
      if (currentChatId === chatId) {
        clearChat();
      }

      // Notify parent component about the deletion
      if (onChatDeleted) {
        onChatDeleted(chatId);
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
    } finally {
      setIsDeleting(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center py-6 px-3 space-y-2 border border-dashed border-muted rounded-md">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        <p className="text-xs text-muted-foreground">{t?.loadingChats || "Loading your conversations..."}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center py-4 px-3 space-y-2 border border-dashed border-destructive/30 rounded-md bg-destructive/5">
        <p className="text-sm text-destructive text-center">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="text-xs px-2 py-1 rounded-md bg-background hover:bg-muted text-muted-foreground transition-colors"
        >
          {t?.retry || "Retry"}
        </button>
      </div>
    );
  }

  if (!Array.isArray(chats)) {
    return (
      <div className="flex flex-col items-center py-4 px-3 space-y-2 border border-dashed border-destructive/30 rounded-md bg-destructive/5">
        <p className="text-sm text-destructive text-center">{t?.loadingChatsError || "Error loading chats"}</p>
        <button 
          onClick={() => window.location.reload()}
          className="text-xs px-2 py-1 rounded-md bg-background hover:bg-muted text-muted-foreground transition-colors"
        >
          {t?.retry || "Retry"}
        </button>
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className="flex flex-col items-center py-6 px-3 space-y-3 border border-dashed border-muted rounded-md">
        <MessageSquare className="h-8 w-8 text-muted-foreground/50" />
        <p className="text-sm text-muted-foreground text-center">{t?.noChatsYet || "No conversations yet"}</p>
        <button 
          onClick={clearChat}
          className="text-xs px-3 py-1.5 rounded-md bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
        >
          {t?.startNewChat || "Start a new chat"}
        </button>
      </div>
    );
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    // If today, show time
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    // If yesterday, show "Yesterday"
    else if (date.toDateString() === yesterday.toDateString()) {
      return t?.yesterday || "Yesterday";
    }
    // Otherwise show date
    else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="space-y-1.5 px-1">
      {chats.map((chat, index) => {
        // Determine if this is a new chat (for animation purposes)
        // In a real app, you'd use a timestamp or unread status from the API
        const isNew = index === 0 && chats.length > 1;

        // Simulate some chats as unread (in a real app, this would come from the API)
        // For demo purposes, we'll mark every third chat as unread
        const isUnread = index % 3 === 0 && currentChatId !== chat.id;

        return (
          <div 
            key={chat.id} 
            className={`group relative flex items-center w-full text-left px-3 py-2 text-sm rounded-md transition-all duration-200 hover:bg-primary/10 cursor-pointer ${
              currentChatId === chat.id 
                ? "bg-primary/15 text-primary-foreground shadow-sm" 
                : "text-foreground hover:text-primary-foreground"
            } ${isNew ? "animate-fade-in" : ""}`}
            onClick={() => handleSelectChat(chat.id)}
          >
            {/* Unread indicator */}
            {isUnread && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-primary rounded-r-full" 
                   aria-hidden="true" />
            )}

            <MessageSquare className={`h-4 w-4 mr-2.5 flex-shrink-0 ${
              currentChatId === chat.id 
                ? "text-primary" 
                : isUnread 
                  ? "text-primary/70" 
                  : "text-muted-foreground group-hover:text-primary/70"
            }`} />

            <div className="flex flex-col flex-1 min-w-0">
              <span className={`truncate ${isUnread ? "font-semibold" : "font-medium"}`}>
                {formatChatTitle(chat)}
              </span>
              <span className="text-xs text-muted-foreground truncate">{formatDate(chat.createdAt)}</span>
            </div>

            <button
              onClick={(e) => handleDeleteChat(chat.id, e)}
              className="ml-2 p-1.5 rounded-full md:opacity-0 opacity-100 group-hover:opacity-100 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-opacity duration-200 focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              title={t?.deleteChat || "Delete chat"}
              aria-label={t?.deleteChat || "Delete chat"}
            >
              {isDeleting === chat.id ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <X className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
}
