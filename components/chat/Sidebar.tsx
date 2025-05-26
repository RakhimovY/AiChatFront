import { useState, useEffect } from "react";
import Link from "next/link";
import { Bot, PlusCircle } from "lucide-react";
import { getUserChats } from "@/lib/chatApi";
import { useSession } from "next-auth/react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import ChatList from "./ChatList";
import UserProfile from "./UserProfile";
import SubscriptionInfo from "./SubscriptionInfo";

type SidebarProps = {
  isSidebarOpen: boolean;
  setIsSidebarOpen?: (isOpen: boolean) => void;
  clearChat: () => void;
  onSelectChat: (chatId: number) => void;
  currentChatId: number | null;
};

export default function Sidebar({ isSidebarOpen, setIsSidebarOpen, clearChat, onSelectChat, currentChatId }: SidebarProps) {
  const { data: session, status } = useSession();
  const { t } = useLanguage();
  const [chats, setChats] = useState<Array<{ id: number; title: string | null; createdAt: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle chat deletion
  const handleChatDeleted = (chatId: number) => {
    // Update local state to remove the deleted chat
    setChats(prevChats => prevChats.filter(chat => chat.id !== chatId));
  };

  // Fetch user chats
  useEffect(() => {
    const fetchChats = async () => {
      if (status !== "authenticated") return;

      // Only show loading state if there are no chats yet
      if (chats.length === 0) {
        setIsLoading(true);
      }
      setError(null);
      try {
        const userChats = await getUserChats();
        // Ensure userChats is an array before setting state
        setChats(Array.isArray(userChats) ? userChats : []);
      } catch (error) {
        console.error("Error fetching chats:", error);
        setError(t.errorLoadingChats);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChats();
  }, [status, currentChatId]);

  // Function to close sidebar on mobile
  const closeSidebarOnMobile = () => {
    if (setIsSidebarOpen && window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  // Function to handle new chat button click
  const handleNewChat = () => {
    clearChat();
    closeSidebarOnMobile();
  };

  return (
    <div 
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-200 ease-in-out md:relative md:translate-x-0 md:h-full`}
    >
      <div className="flex flex-col h-full">
        <div className="py-2 md:py-4 px-2 md:px-4 border-b">
          <div className="flex justify-between items-center">
            <Link href="/chat" className="flex items-center space-x-2">
              <Bot className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">AIuris</span>
            </Link>
            <ThemeToggle />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 md:p-4">
          <h3 className="font-medium mb-2 text-sm text-muted-foreground">{t.recentChats}</h3>

          <ChatList 
            chats={chats}
            isLoading={isLoading}
            error={error}
            currentChatId={currentChatId}
            onSelectChat={onSelectChat}
            clearChat={clearChat}
            closeSidebarOnMobile={closeSidebarOnMobile}
            onChatDeleted={handleChatDeleted}
          />

          <div className="mt-6 mb-2">
            <button 
              onClick={handleNewChat}
              className="flex items-center justify-center space-x-1 md:space-x-2 text-sm w-full p-1 md:p-2 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <PlusCircle className="h-4 w-4" />
              <span>{t.startNewChat}</span>
            </button>
          </div>
        </div>

        <div className="py-2 md:py-4 px-2 md:px-4 space-y-1 md:space-y-2">
          {/* Subscription link */}
          {status === "authenticated" && <SubscriptionInfo />}

          {/* User profile link */}
          <UserProfile session={session} />
        </div>
      </div>
    </div>
  );
}
