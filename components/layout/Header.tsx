"use client";

import Link from "next/link";
import { ArrowLeft, Download, Menu, Scale, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import LanguageSelector from "@/components/layout/LanguageSelector";
import { useSession } from "next-auth/react";

type HeaderProps = {
  isMobileMenuOpen?: boolean;
  setIsMobileMenuOpen?: (isOpen: boolean) => void;
  exportChat?: () => void;
  showThemeToggle?: boolean;
  showUserInfo?: boolean;
  showBackButton?: boolean;
};

export default function Header({
  isMobileMenuOpen = false,
  setIsMobileMenuOpen,
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
  const { data: session } = useSession();

  const user = {
    name: session?.user?.name || "User",
    email: session?.user?.email || "",
    image: session?.user?.image || undefined,
  };

  return (
    <>
      {/* Mobile Header - Only visible on mobile */}
      <header className="border-b p-2 md:p-4 flex items-center justify-between md:hidden fixed top-0 left-0 right-0 z-50 bg-background shadow-sm">
        <button
          onClick={toggleMobileMenu}
          className="p-2 rounded-md hover:bg-secondary transition-colors duration-200"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? (
            showBackButton ? (
              <ArrowLeft className="h-5 w-5" />
            ) : (
              <X className="h-5 w-5" />
            )
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
        <Link href="/" className="flex items-center space-x-2 transition-transform duration-200 hover:scale-105">
          <Scale className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">AIuris</span>
        </Link>
        <div className="flex items-center space-x-3">
          <LanguageSelector />
          {showThemeToggle && <ThemeToggle />}
          {exportChat && (
            <button
              onClick={exportChat}
              className="p-2 rounded-md hover:bg-secondary transition-colors duration-200"
              title="Export chat"
              aria-label="Export chat"
            >
              <Download className="h-5 w-5" />
            </button>
          )}
        </div>
      </header>

      {/* Desktop Header - Only visible on desktop */}
      <header className="border-b hidden md:block fixed top-0 left-0 right-0 z-50 bg-background shadow-sm">
        <div className="container flex justify-between items-center py-3 md:py-4">
          <Link href="/settings" className="flex items-center space-x-2 transition-transform duration-200 hover:scale-105">
            <Scale className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">AIuris</span>
          </Link>
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            {showThemeToggle && <ThemeToggle />}
            {exportChat && (
              <button
                onClick={exportChat}
                className="p-2 rounded-md hover:bg-secondary transition-colors duration-200"
                title="Export chat"
                aria-label="Export chat"
              >
                <Download className="h-5 w-5" />
              </button>
            )}
            {showUserInfo && user && (
              <>
                <div className="text-sm text-right hidden sm:block">
                  <div className="font-medium">{user.name}</div>
                  <div className="text-muted-foreground">{user.email}</div>
                </div>
                <Link href="/settings">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center cursor-pointer hover:bg-primary/20 transition-colors duration-200">
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
