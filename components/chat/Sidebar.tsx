import { useState, useEffect } from "react";
import Link from "next/link";
import { Bot, Trash2, User, MessageSquare, X, Loader2 } from "lucide-react";
import { getUserChats, deleteChat } from "@/lib/chatApi";
import { useSession } from "next-auth/react";

type SidebarProps = {
  isSidebarOpen: boolean;
  clearChat: () => void;
  onSelectChat: (chatId: number) => void;
  currentChatId: number | null;
};

export default function Sidebar({ isSidebarOpen, clearChat, onSelectChat, currentChatId }: SidebarProps) {
  const { data: session, status } = useSession();
  const [chats, setChats] = useState<Array<{ id: number; title: string | null; createdAt: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  // Fetch user chats
  useEffect(() => {
    const fetchChats = async () => {
      if (status !== "authenticated") return;

      setIsLoading(true);
      setError(null);
      try {
        const userChats = await getUserChats();
        // Ensure userChats is an array before setting state
        setChats(Array.isArray(userChats) ? userChats : []);
      } catch (error) {
        console.error("Error fetching chats:", error);
        setError("Не удалось загрузить чаты");
      } finally {
        setIsLoading(false);
      }
    };

    fetchChats();
  }, [status]);

  // Handle chat selection
  const handleSelectChat = (chatId: number) => {
    onSelectChat(chatId);
  };

  // Handle chat deletion
  const handleDeleteChat = async (chatId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent chat selection when clicking delete button

    if (isDeleting) return; // Prevent multiple deletion requests

    setIsDeleting(chatId);
    try {
      await deleteChat(chatId);
      setChats(chats.filter(chat => chat.id !== chatId));

      // If the deleted chat was selected, clear the selection
      if (currentChatId === chatId) {
        clearChat();
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
      setError("Не удалось удалить чат");
    } finally {
      setIsDeleting(null);
    }
  };

  // Format chat title
  const formatChatTitle = (chat: { title: string | null; createdAt: string }) => {
    if (chat.title) return chat.title;

    // Format date for display
    const date = new Date(chat.createdAt);
    return `Чат от ${date.toLocaleDateString()}`;
  };

  return (
    <div 
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-200 ease-in-out md:relative md:translate-x-0`}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b">
          <Link href="/" className="flex items-center space-x-2">
            <Bot className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">LegalGPT</span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="font-medium mb-2 text-sm text-muted-foreground">Недавние чаты</h3>

          {error && (
            <div className="text-sm text-destructive mb-2">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          ) : !Array.isArray(chats) ? (
            <div className="text-sm text-destructive py-2">
              Ошибка загрузки чатов
            </div>
          ) : chats.length === 0 ? (
            <div className="text-sm text-muted-foreground py-2">
              У вас пока нет чатов
            </div>
          ) : (
            <div className="space-y-1">
              {chats.map(chat => (
                <div 
                  key={chat.id} 
                  className={`flex items-center w-full text-left px-3 py-2 text-sm rounded-md hover:bg-primary/10 cursor-pointer ${
                    currentChatId === chat.id ? "bg-primary/10 font-medium" : ""
                  }`}
                  onClick={() => handleSelectChat(chat.id)}
                >
                  <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate flex-1">{formatChatTitle(chat)}</span>
                  <button
                    onClick={(e) => handleDeleteChat(chat.id, e)}
                    className="ml-2 p-1 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                    title="Удалить чат"
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
          )}

          <div className="mt-6">
            <button 
              onClick={clearChat}
              className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <Trash2 className="h-4 w-4" />
              <span>Новый чат</span>
            </button>
          </div>
        </div>

        <div className="p-4 border-t">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">{session?.user?.name || "Пользователь"}</p>
              <p className="text-xs text-muted-foreground">{session?.user?.email || "Гость"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
