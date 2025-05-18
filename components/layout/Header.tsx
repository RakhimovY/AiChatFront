"use client";

import Link from "next/link";
import { Bot, Menu, X, ArrowLeft, Download } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import LanguageSelector from "@/components/layout/LanguageSelector";

type HeaderProps = {
  // Common props
  user?: {
    name: string;
    email: string;
    image?: string;
  };
  // Mobile header props
  isMobileMenuOpen?: boolean;
  setIsMobileMenuOpen?: (isOpen: boolean) => void;
  // Page specific props
  pageTitle?: string;
  pageRoute: string;
  // Optional actions
  exportChat?: () => void;
  showThemeToggle?: boolean;
  showUserInfo?: boolean;
  showBackButton?: boolean;
};

export default function Header({
  user,
  isMobileMenuOpen = false,
  setIsMobileMenuOpen,
  pageTitle = "LegalGPT",
  pageRoute,
  exportChat,
  showThemeToggle = true,
  showUserInfo = true,
  showBackButton = false,
}: HeaderProps) {
  const toggleMobileMenu = () => {
    if (setIsMobileMenuOpen) {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    }
  };

  return (
    <>
      {/* Mobile Header - Only visible on mobile */}
      <header className="border-b p-4 flex items-center justify-between md:hidden fixed top-0 left-0 right-0 z-50 bg-background">
        <button
          onClick={toggleMobileMenu}
          className="p-2 rounded-md hover:bg-secondary"
        >
          {isMobileMenuOpen 
            ? (showBackButton ? <ArrowLeft className="h-5 w-5" /> : <X className="h-5 w-5" />)
            : <Menu className="h-5 w-5" />
          }
        </button>
        <Link href={pageRoute} className="flex items-center space-x-2">
          <Bot className="h-5 w-5 text-primary" />
          <span className="font-bold">{pageTitle}</span>
        </Link>
        <div className="flex items-center space-x-2">
          <LanguageSelector />
          {showThemeToggle && <ThemeToggle />}
          {exportChat && (
            <button 
              onClick={exportChat}
              className="p-2 rounded-md hover:bg-secondary"
              title="Export chat"
            >
              <Download className="h-5 w-5" />
            </button>
          )}
        </div>
      </header>

      {/* Desktop Header - Only visible on desktop */}
      <header className="border-b hidden md:block fixed top-0 left-0 right-0 z-50 bg-background">
        <div className="container flex justify-between items-center py-4">
          <Link href={pageRoute} className="text-xl font-bold">
            {pageTitle}
          </Link>
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            {showThemeToggle && <ThemeToggle />}
            {exportChat && (
              <button 
                onClick={exportChat}
                className="p-2 rounded-md hover:bg-secondary"
                title="Export chat"
              >
                <Download className="h-5 w-5" />
              </button>
            )}
            {showUserInfo && user && (
              <>
                <div className="text-sm text-right">
                  <div className="font-medium">{user.name}</div>
                  <div className="text-muted-foreground">{user.email}</div>
                </div>
                <Link href="/account">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center cursor-pointer">
                    {user.image ? (
                      <img 
                        src={user.image} 
                        alt={user.name} 
                        className="h-8 w-8 rounded-full" 
                      />
                    ) : (
                      <span className="text-primary font-medium">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
