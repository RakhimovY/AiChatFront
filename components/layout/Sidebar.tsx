"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Bot, ChevronDown, ChevronRight, LogOut, PlusCircle } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { getMenuItems, MenuItem, SubMenuItem } from "@/lib/constants/menuItems";
import { getUserChats } from "@/lib/chatApi";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import ChatList from "@/components/chat/ChatList";
import UserProfile from "@/components/chat/UserProfile";
import SubscriptionInfo from "@/components/chat/SubscriptionInfo";

// Re-export types for backward compatibility
export type { MenuItem, SubMenuItem };

// Define types for user
export type User = {
  name: string;
  email: string;
  image?: string;
};

// Define props for the Sidebar component
type SidebarProps = {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen?: (isOpen: boolean) => void;
  activePage?: string;
  showRecentChats?: boolean;
  clearChat?: () => void;
  onSelectChat?: (chatId: number) => void;
  currentChatId?: number | null;
};

export default function Sidebar({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  activePage = "",
  showRecentChats = false,
  clearChat,
  onSelectChat,
  currentChatId = null,
}: SidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [openSubmenus, setOpenSubmenus] = useState<Record<number, boolean>>({});
  const { data: session, status } = useSession();
  const { t } = useLanguage();
  const [chats, setChats] = useState<Array<{ id: number; title: string | null; createdAt: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get menu items based on the current path
  const items = getMenuItems(activePage);

  // Handle chat deletion
  const handleChatDeleted = (chatId: number) => {
    // Update local state to remove the deleted chat
    setChats(prevChats => prevChats.filter(chat => chat.id !== chatId));
  };

  // Fetch user chats if showRecentChats is true
  useEffect(() => {
    if (!showRecentChats) return;

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
        setError(t?.errorLoadingChats || "Error loading chats");
      } finally {
        setIsLoading(false);
      }
    };

    fetchChats();
  }, [showRecentChats, status, currentChatId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!isMobileMenuOpen || window.innerWidth >= 768) return;
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen?.(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen, setIsMobileMenuOpen]);

  // Function to close sidebar on mobile
  const closeSidebarOnMobile = () => {
    if (setIsMobileMenuOpen && window.innerWidth < 768) {
      setIsMobileMenuOpen(false);
    }
  };

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  return (
    <aside
      ref={sidebarRef}
      className={`
        ${isMobileMenuOpen ? "block" : "hidden"} 
        md:block w-64 border-r bg-card fixed md:static inset-y-0 z-10 md:pt-0 flex flex-col h-full
        shadow-sm transition-all duration-300 ease-in-out
      `}
    >
      <div className="py-2 md:py-4 px-2 md:px-4 border-b md:hidden">
        <div className="flex justify-between items-center">
          <Link href="/chat" className="flex items-center space-x-2">
            <Bot className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">AIuris</span>
          </Link>
          <ThemeToggle />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <nav className="p-2 md:p-4 space-y-1">
          {items.map((item, index) => {
            const Icon = item.icon;
            const isActive =
              activePage === item.href ||
              (item.subItems?.some((sub) => activePage === sub.href) ?? false);
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isSubmenuOpen = openSubmenus[index] || false;

            return (
              <div key={index} className="space-y-1">
                <div
                  className={`flex items-center p-2 rounded-md hover:bg-accent cursor-pointer
                    transition-all duration-200 ease-in-out
                    ${
                      isActive
                        ? "bg-accent/50 text-foreground font-medium"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  <Link
                    href={item.href}
                    className="flex-1 flex items-center"
                    onClick={() => setIsMobileMenuOpen?.(false)}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {item.label}
                  </Link>
                  {hasSubItems && (
                    <button
                      onClick={() =>
                        setOpenSubmenus((prev) => ({
                          ...prev,
                          [index]: !prev[index],
                        }))
                      }
                      className="p-1 rounded-md hover:bg-accent/50"
                    >
                      {isSubmenuOpen ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                  )}
                </div>

                {hasSubItems && (
                  <div 
                    className={`ml-6 pl-2 border-l space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${
                      isSubmenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    {item.subItems?.map((subItem, subIndex) => {
                      const isSubActive = activePage === subItem.href;
                      return (
                        <Link
                          key={`${index}-${subIndex}`}
                          href={subItem.href}
                          className={`flex items-center p-2 rounded-md hover:bg-accent 
                            transition-colors duration-200
                            ${
                              isSubActive
                                ? "bg-accent/50 text-foreground font-medium"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          onClick={() => setIsMobileMenuOpen?.(false)}
                        >
                          {subItem.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* Recent Chats Section - Only shown on chat page */}
          {showRecentChats && (
            <div className="mt-6 space-y-2">
              <h3 className="font-medium text-sm text-muted-foreground px-2">
                {t?.recentChats || "Recent Chats"}
              </h3>

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
            </div>
          )}

          <button
            onClick={handleSignOut}
            className="flex items-center p-2 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground w-full text-left transition-colors duration-200"
          >
            <LogOut className="h-5 w-5 mr-3" />
            {t?.logout || "Logout"}
          </button>
        </nav>
      </div>

      {/* User profile and subscription info - Only shown on chat page */}
      {showRecentChats && (
        <div className="py-2 md:py-4 px-2 md:px-4 space-y-1 md:space-y-2 border-t">
          {/* Subscription link */}
          {status === "authenticated" && <SubscriptionInfo />}

          {/* User profile link */}
          <UserProfile session={session} />
        </div>
      )}
    </aside>
  );
}
