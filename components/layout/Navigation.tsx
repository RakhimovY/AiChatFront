"use client";

import { useState } from "react";
import Link from "next/link";
import { Scale, Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

type NavigationProps = {
  activePage?: "home" | "pricing" | "about";
};

export default function Navigation({ activePage }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="border-b fixed top-0 left-0 right-0 z-50 bg-background">
      <div className="container flex justify-between items-center py-4">
        <Link href="/" className="flex items-center space-x-2">
          <Scale className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">LegalGPT</span>
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
            Главная
          </Link>
          <Link 
            href="/pricing" 
            className={`text-sm ${
              activePage === "pricing" 
                ? "text-foreground" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Тарифы
          </Link>
          <Link 
            href="/about" 
            className={`text-sm ${
              activePage === "about" 
                ? "text-foreground" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            О сервисе
          </Link>
          <ThemeToggle />
          <Link 
            href="/auth/login" 
            className="text-sm px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80"
          >
            Войти
          </Link>
          <Link 
            href="/auth/register" 
            className="text-sm px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Регистрация
          </Link>
        </div>
      </div>

      {/* Mobile navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container py-4 flex flex-col space-y-4">
            <Link 
              href="/" 
              className={`text-sm ${
                activePage === "home" 
                  ? "text-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Главная
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
              Тарифы
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
              О сервисе
            </Link>
            <div className="flex items-center py-2">
              <span className="text-sm text-muted-foreground mr-2">Тема:</span>
              <ThemeToggle />
            </div>
            <div className="flex flex-col space-y-2 pt-2">
              <Link 
                href="/auth/login" 
                className="text-sm px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Войти
              </Link>
              <Link 
                href="/auth/register" 
                className="text-sm px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Регистрация
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
