"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Scale, Menu, X, MessageSquare, FileText } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import LanguageSelector from "@/components/layout/LanguageSelector";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useSession } from "next-auth/react";
import NavLink from "./NavLink";
import NavButton from "./NavButton";

type NavigationProps = {
  activePage?: "home" | "pricing" | "about";
};

const navigationItems = [
  { href: "/", label: "home" },
  { href: "/pricing", label: "pricing" },
  { href: "/about", label: "about" },
] as const;

export default function Navigation({ activePage }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLanguage();
  const { data: session, status } = useSession();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Handle ESC key to close mobile menu
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isMobileMenuOpen]);

  // Handle click outside to close mobile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="border-b fixed top-0 left-0 right-0 z-50 bg-background" aria-label="Main navigation">
      <div className="container flex justify-between items-center py-4 mx-auto max-w-6xl">
        <Link
          href="/"
          className="flex items-center space-x-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md"
          aria-label={t.appName}
        >
          <Scale className="h-6 w-6 text-primary" aria-hidden="true" />
          <span className="text-xl font-bold">{t.appName}</span>
        </Link>

        {/* Mobile menu button */}
        <button
          ref={menuButtonRef}
          className="md:hidden p-2 rounded-md hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? t.closeMenu || "Close menu" : t.openMenu || "Open menu"}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Menu className="h-6 w-6" aria-hidden="true" />
          )}
        </button>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center space-x-4" role="menubar" aria-label="Desktop navigation">
          <ul className="flex items-center space-x-4">
            {navigationItems.map(({ href, label }) => (
              <li key={href} role="none">
                <NavLink
                  href={href}
                  isActive={activePage === label}
                >
                  {t[label]}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center space-x-3">
            <LanguageSelector />
            <ThemeToggle />
          </div>

          <div className="flex items-center space-x-2">
            {status === "authenticated" ? (
              <>
                <NavButton
                  href="/chat"
                  icon={MessageSquare}
                >
                  {t.chat}
                </NavButton>
                <NavButton
                  href="/web"
                  variant="secondary"
                  icon={FileText}
                >
                  {t.documents}
                </NavButton>
              </>
            ) : (
              <>
                <NavButton
                  href="/auth/login"
                  variant="secondary"
                >
                  {t.login}
                </NavButton>
                <NavButton
                  href="/auth/register"
                >
                  {t.register}
                </NavButton>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      <div
        id="mobile-menu"
        ref={mobileMenuRef}
        className={`md:hidden border-t overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="container py-4 px-4">
          <nav aria-label="Mobile navigation">
            <ul className="flex flex-col space-y-3">
              {navigationItems.map(({ href, label }) => (
                <li key={href}>
                  <NavLink
                    href={href}
                    isActive={activePage === label}
                    onClick={closeMobileMenu}
                    isMobile
                  >
                    {t[label]}
                  </NavLink>
                </li>
              ))}
            </ul>

            <div className="mt-4 space-y-3">
              <div className="flex items-center py-2 px-3 bg-accent/20 rounded-md">
                <span className="text-sm text-muted-foreground mr-3">{t.selectLanguage}:</span>
                <LanguageSelector isMobile={true} />
              </div>
              <div className="flex items-center py-2 px-3 bg-accent/20 rounded-md">
                <span className="text-sm text-muted-foreground mr-3">{t.theme}:</span>
                <ThemeToggle />
              </div>
            </div>

            <div className="flex flex-col space-y-2 mt-4">
              {status === "authenticated" ? (
                <>
                  <NavButton
                    href="/chat"
                    icon={MessageSquare}
                    onClick={closeMobileMenu}
                    isMobile
                  >
                    {t.chat}
                  </NavButton>
                  <NavButton
                    href="/web"
                    variant="secondary"
                    icon={FileText}
                    onClick={closeMobileMenu}
                    isMobile
                  >
                    {t.documents}
                  </NavButton>
                </>
              ) : (
                <>
                  <NavButton
                    href="/auth/login"
                    variant="secondary"
                    onClick={closeMobileMenu}
                    isMobile
                  >
                    {t.login}
                  </NavButton>
                  <NavButton
                    href="/auth/register"
                    onClick={closeMobileMenu}
                    isMobile
                  >
                    {t.register}
                  </NavButton>
                </>
              )}
            </div>
          </nav>
        </div>
      </div>
    </nav>
  );
}
