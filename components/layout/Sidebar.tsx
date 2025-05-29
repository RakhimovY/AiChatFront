"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { ChevronDown, ChevronRight, LogOut, PlusCircle } from "lucide-react";
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
  const [chats, setChats] = useState<
    Array<{ id: number; title: string | null; createdAt: string }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const items = getMenuItems(activePage, t);

  const handleChatDeleted = (chatId: number) => {
    setChats((prevChats) => prevChats.filter((chat) => chat.id !== chatId));
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
        // Add a small delay to ensure smooth transitions
        await new Promise((resolve) => setTimeout(resolve, 100));
        const userChats = await getUserChats();
        // Ensure userChats is an array before setting state
        setChats(Array.isArray(userChats) ? userChats : []);
      } catch (error) {
        console.error("Error fetching chats:", error);
        setError(t.errorLoadingChats || "Error loading chats");
      } finally {
        setIsLoading(false);
      }
    };

    fetchChats();
  }, [showRecentChats, status, currentChatId]);

  // We don't need to handle clicks outside the sidebar anymore since it's always visible
  // in either expanded or collapsed state

  // Add CSS to document head to ensure transitions are applied consistently
  useEffect(() => {
    // Create a style element
    const style = document.createElement("style");
    // Add CSS rules for smoother transitions
    style.textContent = `
      .sidebar-transition {
        transition: width 300ms ease-in-out;
        will-change: width;
      }
      .sidebar-content-transition {
        transition: opacity 300ms ease-in-out, max-width 300ms ease-in-out, max-height 300ms ease-in-out;
      }
    `;
    // Append the style element to the document head
    document.head.appendChild(style);

    // Clean up function to remove the style element when the component unmounts
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const collapseSidebarOnMobile = () => {
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
        border-r bg-card fixed md:sticky inset-y-0 z-10 flex flex-col h-screen md:h-[calc(100dvh-5rem)] md:top-[80px] md:bottom-[0]
        shadow-sm overflow-hidden sidebar-transition
        ${isMobileMenuOpen ? "w-64" : "md:w-16 w-0"} 
      `}
      aria-label="Main navigation"
    >
      <div className="flex-1 overflow-y-auto min-h-0 flex flex-col py-16 md:py-0">
        <nav
          className="p-3 space-y-2 flex-grow relative"
          aria-label="Sidebar navigation"
        >
          {/* New Chat Button - Always visible */}
          {showRecentChats && (
            <button
              onClick={clearChat}
              className="flex items-center gap-2 p-2.5 rounded-md bg-primary/10 hover:bg-primary/20 text-primary w-full mb-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary h-10 sidebar-transition transition-all duration-200 ease-in-out"
              aria-label="Start a new chat"
            >
              <div className="w-5 flex-shrink-0 flex justify-center">
                <PlusCircle
                  className="h-5 w-5 sidebar-content-transition"
                  aria-hidden="true"
                />
              </div>
              <div className="overflow-hidden flex-1">
                <span
                  className={`sidebar-content-transition whitespace-nowrap overflow-hidden ${isMobileMenuOpen ? "opacity-100 max-w-[150px]" : "opacity-0 max-w-0"}`}
                >
                  {t.startNewChat || "New Chat"}
                </span>
              </div>
            </button>
          )}
          <ul className="space-y-2">
            {items.map((item, index) => {
              const Icon = item.icon;
              const isActive =
                activePage === item.href ||
                (item.subItems?.some((sub) => activePage === sub.href) ??
                  false);
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
                      className="flex-1 flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md"
                      onClick={collapseSidebarOnMobile}
                      aria-current={isActive ? "page" : undefined}
                      aria-expanded={hasSubItems ? isSubmenuOpen : undefined}
                      aria-controls={hasSubItems ? submenuId : undefined}
                    >
                      <div className="w-5 flex-shrink-0 flex justify-center">
                        <Icon
                          className="h-5 w-5 sidebar-content-transition"
                          aria-hidden="true"
                        />
                      </div>
                      <span
                        className={`sidebar-content-transition whitespace-nowrap overflow-hidden ${isMobileMenuOpen ? "opacity-100 max-w-[150px]" : "opacity-0 max-w-0"}`}
                      >
                        {item.label}
                      </span>
                    </Link>
                    {hasSubItems && isMobileMenuOpen && (
                      <button
                        onClick={() =>
                          setOpenSubmenus((prev) => ({
                            ...prev,
                            [index]: !prev[index],
                          }))
                        }
                        className="p-1 rounded-md hover:bg-accent/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        aria-label={
                          isSubmenuOpen ? "Collapse submenu" : "Expand submenu"
                        }
                        aria-expanded={isSubmenuOpen}
                        aria-controls={submenuId}
                      >
                        {isSubmenuOpen ? (
                          <ChevronDown className="h-4 w-4" aria-hidden="true" />
                        ) : (
                          <ChevronRight
                            className="h-4 w-4"
                            aria-hidden="true"
                          />
                        )}
                      </button>
                    )}
                  </div>

                  {hasSubItems && isMobileMenuOpen && (
                    <ul
                      id={submenuId}
                      className={`ml-6 pl-2 border-l space-y-1.5 overflow-hidden transition-all duration-300 ease-in-out ${
                        isSubmenuOpen
                          ? "max-h-96 opacity-100 py-1"
                          : "max-h-0 opacity-0 py-0"
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
                              onClick={collapseSidebarOnMobile}
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

          {/* Recent Chats Section - Only shown on chat page and when sidebar is open */}
          <div
            className={`mt-8 space-y-3 sidebar-content-transition ${showRecentChats && isMobileMenuOpen ? "opacity-100 max-h-[2000px]" : "opacity-0 max-h-0 overflow-hidden"}`}
          >
            {/* Only show header and divider if there are chats and not in loading state */}
            <div
              className={`flex items-center justify-between px-2.5 mb-2 sidebar-content-transition ${chats.length > 0 && !isLoading && !error ? "opacity-100" : "opacity-0 h-0 overflow-hidden"}`}
            >
              <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider sidebar-content-transition whitespace-nowrap overflow-hidden">
                {t.recentChats || "Recent Chats"}
              </h3>
            </div>

            <div
              className={`h-px bg-border/60 mx-2 my-1 sidebar-content-transition opacity-100`}
            ></div>
            <div className="sidebar-content-transition">
              <div className="w-full">
                <ChatList
                  chats={chats}
                  isLoading={isLoading}
                  error={error}
                  currentChatId={currentChatId}
                  onSelectChat={onSelectChat}
                  clearChat={clearChat}
                  closeSidebarOnMobile={collapseSidebarOnMobile}
                  onChatDeleted={handleChatDeleted}
                />
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Footer with logout button and user info */}
      <div className="py-3 px-3 border-t mt-auto flex-shrink-0 sticky bottom-0 bg-card sidebar-transition">
        {/* User profile and subscription info  */}
        <div className="space-y-2">
          {/* Subscription link */}
          <div
            className={`sidebar-content-transition ${status === "authenticated" ? "opacity-100" : "opacity-0 h-0 overflow-hidden"}`}
          >
            <SubscriptionInfo expanded={isMobileMenuOpen} />
          </div>

          {/* User profile link */}
          <UserProfile session={session} expanded={isMobileMenuOpen} />
        </div>

        {/* Logout button - separated from navigation */}
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 p-2.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground w-full text-left transition-colors duration-200 mb-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary h-10"
          aria-label="Logout"
        >
          <div className="w-5 flex-shrink-0 flex justify-center">
            <LogOut
              className="h-5 w-5 sidebar-content-transition"
              aria-hidden="true"
            />
          </div>
          <span
            className={`sidebar-content-transition whitespace-nowrap overflow-hidden ${isMobileMenuOpen ? "opacity-100 max-w-[150px]" : "opacity-0 max-w-0"}`}
          >
            {t.logout || "Logout"}
          </span>
        </button>
      </div>
    </aside>
  );
}
