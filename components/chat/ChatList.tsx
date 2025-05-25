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
  closeSidebarOnMobile
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
    } catch (error) {
      console.error("Error deleting chat:", error);
    } finally {
      setIsDeleting(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-4">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-destructive mb-2">
        {error}
      </div>
    );
  }

  if (!Array.isArray(chats)) {
    return (
      <div className="text-sm text-destructive py-2">
        {t.loadingChatsError}
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className="text-sm text-muted-foreground py-2">
        {t.noChatsYet}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {chats.map(chat => (
        <div 
          key={chat.id} 
          className={`flex items-center w-full text-left px-2 md:px-3 py-1 md:py-2 text-sm rounded-md hover:bg-primary/10 cursor-pointer ${
            currentChatId === chat.id ? "bg-primary/10 font-medium" : ""
          }`}
          onClick={() => handleSelectChat(chat.id)}
        >
          <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0" />
          <span className="truncate flex-1">{formatChatTitle(chat)}</span>
          <button
            onClick={(e) => handleDeleteChat(chat.id, e)}
            className="ml-2 p-1 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
            title={t.deleteChat}
          >
            {isDeleting === chat.id ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <X className="h-3 w-3" />
            )}
          </button>
        </div>
      ))}
    </div>
  );
}