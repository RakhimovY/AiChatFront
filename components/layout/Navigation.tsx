"use client";

import { useState } from "react";
import Link from "next/link";
import { Scale, Menu, X, MessageSquare, FileText } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import LanguageSelector from "@/components/layout/LanguageSelector";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useSession } from "next-auth/react";

type NavigationProps = {
  activePage?: "home" | "pricing" | "about";
};

export default function Navigation({ activePage }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLanguage();
  const { data: session, status } = useSession();

  return (
    <nav className="border-b fixed top-0 left-0 right-0 z-50 bg-background">
      <div className="container flex justify-between items-center py-4 mx-auto max-w-6xl">
        <Link href="/" className="flex items-center space-x-2">
          <Scale className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">{t.appName}</span>
        </Link>

        {/* Mobile menu button */}
        <button 
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Закрыть меню" : "Открыть меню"}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <Link 
            href="/" 
            className={`text-sm ${
              activePage === "home" 
                ? "text-foreground" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.home}
          </Link>
          <Link 
            href="/pricing" 
            className={`text-sm ${
              activePage === "pricing" 
                ? "text-foreground" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.pricing}
          </Link>
          <Link 
            href="/about" 
            className={`text-sm ${
              activePage === "about" 
                ? "text-foreground" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.about}
          </Link>
          <LanguageSelector />
          <ThemeToggle />
          {status === "authenticated" ? (
            <>
              <Link 
                href="/chat" 
                className="text-sm px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                {t.chat}
              </Link>
              <Link 
                href="/web" 
                className="text-sm px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                {t.documents}
              </Link>
            </>
          ) : (
            <>
              <Link 
                href="/auth/login" 
                className="text-sm px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80"
              >
                {t.login}
              </Link>
              <Link 
                href="/auth/register" 
                className="text-sm px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {t.register}
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container py-3 md:py-4 flex flex-col space-y-2 md:space-y-4">
            <Link 
              href="/" 
              className={`text-sm ${
                activePage === "home" 
                  ? "text-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t.home}
            </Link>
            <Link 
              href="/pricing" 
              className={`text-sm ${
                activePage === "pricing" 
                  ? "text-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t.pricing}
            </Link>
            <Link 
              href="/about" 
              className={`text-sm ${
                activePage === "about" 
                  ? "text-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t.about}
            </Link>
            <div className="flex items-center py-1 md:py-2">
              <span className="text-sm text-muted-foreground mr-2">{t.selectLanguage}:</span>
              <LanguageSelector isMobile={true} />
            </div>
            <div className="flex items-center py-1 md:py-2">
              <span className="text-sm text-muted-foreground mr-2">{t.theme}:</span>
              <ThemeToggle />
            </div>
            <div className="flex flex-col space-y-1 md:space-y-2 pt-1 md:pt-2">
              {status === "authenticated" ? (
                <>
                  <Link 
                    href="/chat" 
                    className="text-sm px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-center flex items-center justify-center gap-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <MessageSquare className="h-4 w-4" />
                    {t.chat}
                  </Link>
                  <Link 
                    href="/web" 
                    className="text-sm px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 text-center flex items-center justify-center gap-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FileText className="h-4 w-4" />
                    {t.documents}
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    href="/auth/login" 
                    className="text-sm px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t.login}
                  </Link>
                  <Link 
                    href="/auth/register" 
                    className="text-sm px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t.register}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
