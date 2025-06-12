import { useCallback, useMemo } from "react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { deleteChat } from "@/lib/chatApi";
import { Loader2, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface Chat {
  id: number;
  title: string;
  createdAt: Date;
}

interface ChatListProps {
  chats: Chat[];
  isLoading: boolean;
  error: string | null;
  onSelectChat: (chatId: number) => void;
  onDeleteChat: (chatId: number) => void;
  selectedChatId: number | null;
}

export default function ChatList({
  chats,
  isLoading,
  error,
  onSelectChat,
  onDeleteChat,
  selectedChatId,
}: ChatListProps) {
  const { t } = useLanguage();

  const formatChatTitle = useCallback((title: string) => {
    return title.length > 30 ? `${title.substring(0, 30)}...` : title;
  }, []);

  const handleSelectChat = useCallback((chatId: number) => {
    onSelectChat(chatId);
  }, [onSelectChat]);

  const handleDeleteChat = useCallback(async (chatId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      await deleteChat(chatId);
      onDeleteChat(chatId);
    } catch (error) {
      console.error("Failed to delete chat:", error);
    }
  }, [onDeleteChat]);

  const formatDate = useCallback((date: Date | string) => {
    const now = new Date();
    const chatDate = new Date(date);
    
    // Check if the date is valid
    if (isNaN(chatDate.getTime())) {
      return '';
    }
    
    const diffDays = Math.floor((now.getTime() - chatDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return format(chatDate, "HH:mm");
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return format(chatDate, "EEEE", { locale: ru });
    } else {
      return format(chatDate, "dd.MM.yyyy");
    }
  }, []);

  const sortedChats = useMemo(() => {
    return [...chats].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }, [chats]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <p className="text-destructive mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        No chats yet
      </div>
    );
  }

  return (
    <div className="space-y-2 p-2">
      {sortedChats.map((chat) => (
        <div
          key={chat.id}
          onClick={() => handleSelectChat(chat.id)}
          className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
            selectedChatId === chat.id
              ? "bg-primary/10 hover:bg-primary/20"
              : "hover:bg-muted"
          }`}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleSelectChat(chat.id);
            }
          }}
        >
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">{formatChatTitle(chat.title)}</h3>
            <p className="text-sm text-muted-foreground">{formatDate(chat.createdAt)}</p>
          </div>
          <button
            onClick={(e) => handleDeleteChat(chat.id, e)}
            className="p-2 text-muted-foreground hover:text-destructive transition-colors"
            aria-label="Delete chat"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
