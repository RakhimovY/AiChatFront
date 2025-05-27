"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { ChevronDown, ChevronRight, LogOut } from "lucide-react";
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

  const items = getMenuItems(activePage, t);

  const handleChatDeleted = (chatId: number) => {
    setChats(prevChats => prevChats.filter(chat => chat.id !== chatId));
  };

  // Fetch user chats if showRecentChats is true
  useEffect(() => {
    if (!showRecentChats) return;

    const fetchChats = async () => {
      if (status !== "authenticated") return;
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
        w-64 border-r bg-card fixed md:static inset-y-0 z-10 flex flex-col h-screen md:h-[calc(100dvh-5rem)]
        shadow-sm transition-all duration-300 ease-in-out
      `}
      aria-label="Main navigation"
      aria-hidden={!isMobileMenuOpen}
    >
      <div className="flex-1 overflow-y-auto min-h-0 flex flex-col py-16 md:py-0">
        <nav className="p-3 space-y-2 flex-grow" aria-label="Sidebar navigation">
          <ul className="space-y-2">
            {items.map((item, index) => {
              const Icon = item.icon;
              const isActive =
                activePage === item.href ||
                (item.subItems?.some((sub) => activePage === sub.href) ?? false);
              const hasSubItems = item.subItems && item.subItems.length > 0;
              const isSubmenuOpen = openSubmenus[index] || false;
              const menuId = `menu-${index}`;
              const submenuId = `submenu-${index}`;

              return (
                <li key={index} className="relative">
                  <div
                    className={`flex items-center p-2.5 rounded-md hover:bg-accent cursor-pointer
                      transition-all duration-200 ease-in-out
                      ${
                        isActive
                          ? "bg-accent/80 text-foreground font-medium shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    <Link
                      href={item.href}
                      id={menuId}
                      className="flex-1 flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md"
                      onClick={() => setIsMobileMenuOpen?.(false)}
                      aria-current={isActive ? "page" : undefined}
                      aria-expanded={hasSubItems ? isSubmenuOpen : undefined}
                      aria-controls={hasSubItems ? submenuId : undefined}
                    >
                      <Icon className="h-5 w-5 mr-3 flex-shrink-0" aria-hidden="true" />
                      <span>{item.label}</span>
                    </Link>
                    {hasSubItems && (
                      <button
                        onClick={() =>
                          setOpenSubmenus((prev) => ({
                            ...prev,
                            [index]: !prev[index],
                          }))
                        }
                        className="p-1.5 rounded-md hover:bg-accent/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        aria-label={isSubmenuOpen ? "Collapse submenu" : "Expand submenu"}
                        aria-expanded={isSubmenuOpen}
                        aria-controls={submenuId}
                      >
                        {isSubmenuOpen ? (
                          <ChevronDown className="h-4 w-4" aria-hidden="true" />
                        ) : (
                          <ChevronRight className="h-4 w-4" aria-hidden="true" />
                        )}
                      </button>
                    )}
                  </div>

                  {hasSubItems && (
                    <ul
                      id={submenuId}
                      className={`ml-6 pl-2 border-l space-y-1.5 overflow-hidden transition-all duration-300 ease-in-out ${
                        isSubmenuOpen ? 'max-h-96 opacity-100 py-1' : 'max-h-0 opacity-0 py-0'
                      }`}
                      aria-labelledby={menuId}
                      role="menu"
                    >
                      {item.subItems?.map((subItem, subIndex) => {
                        const isSubActive = activePage === subItem.href;
                        return (
                          <li key={`${index}-${subIndex}`} role="none">
                            <Link
                              href={subItem.href}
                              className={`flex items-center p-2.5 rounded-md hover:bg-accent 
                                transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary
                                ${
                                  isSubActive
                                    ? "bg-accent/70 text-foreground font-medium shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                                }`}
                              onClick={() => setIsMobileMenuOpen?.(false)}
                              aria-current={isSubActive ? "page" : undefined}
                              role="menuitem"
                            >
                              <span className="ml-1">{subItem.label}</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Recent Chats Section - Only shown on chat page */}
          {showRecentChats && (
            <div className="mt-8 space-y-3">
              {/* Only show header and divider if there are chats and not in loading state */}
              {chats.length > 0 && !isLoading && !error && (
                <div className="flex items-center justify-between px-2.5 mb-2">
                  <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
                    {t?.recentChats || "Recent Chats"}
                  </h3>
                </div>
              )}

              <div className="h-px bg-border/60 mx-2 my-1"></div>
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
        </nav>
      </div>

      {/* Footer with logout button and user info */}
      <div className="py-3 px-3 border-t mt-auto flex-shrink-0 sticky bottom-0 bg-card">
        {/* Logout button - separated from navigation */}
        <button
          onClick={handleSignOut}
          className="flex items-center p-2.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground w-full text-left transition-colors duration-200 mb-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="Logout"
        >
          <LogOut className="h-5 w-5 mr-3 flex-shrink-0" aria-hidden="true" />
          <span>{t?.logout || "Logout"}</span>
        </button>

        {/* User profile and subscription info - Only shown on chat page */}
        {showRecentChats && (
          <div className="space-y-2">
            {/* Subscription link */}
            {status === "authenticated" && <SubscriptionInfo />}

            {/* User profile link */}
            <UserProfile session={session} />
          </div>
        )}
      </div>
    </aside>
  );
}
