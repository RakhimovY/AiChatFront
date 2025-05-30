"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  MessageSquare, 
  FileText, 
  Settings, 
  CreditCard, 
  HelpCircle
} from "lucide-react";
import Sidebar, { MenuItem, User } from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

type DashboardContentProps = {
  user: {
    name: string;
    email: string;
    image?: string;
  };
};

export default function DashboardContent({ user }: DashboardContentProps) {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Reference to the sidebar element
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside the sidebar to close it on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Only proceed if the sidebar is open and we're on mobile
      if (!isMobileMenuOpen || window.innerWidth >= 768) return;

      // Check if the click was outside the sidebar
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);

    // Clean up
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const menuItems: MenuItem[] = [
    { icon: MessageSquare, label: "Чаты", href: "/chat" },
    // { icon: FileText, label: "Документы", href: "/documents" },
    { icon: CreditCard, label: "Подписка", href: "/billing" },
    // { icon: Settings, label: "Настройки", href: "/settings" },
    { icon: HelpCircle, label: "Помощь", href: "/support" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header component for both mobile and desktop */}
      <Header
        user={user}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        pageTitle="Личный кабинет"
        pageRoute="/dashboard"
      />

      <div className="flex flex-1 pt-16 md:pt-20">
        {/* Sidebar */}
        <Sidebar 
          menuItems={menuItems}
          user={user}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          activePage="/dashboard"
        />

        {/* Main content */}
        <main className="flex-1 p-6">
          <div className="flex items-center mb-6 p-4 border rounded-lg bg-primary/5">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mr-4">
              {user.image ? (
                <img 
                  src={user.image} 
                  alt={user.name} 
                  className="h-16 w-16 rounded-full" 
                />
              ) : (
                <span className="text-primary text-2xl font-medium">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border rounded-lg p-6 flex flex-col h-full">
              <div>
                <MessageSquare className="h-8 w-8 text-primary mb-4" />
                <h2 className="text-xl font-semibold mb-2">Начать чат</h2>
                <p className="text-muted-foreground mb-4">
                  Задайте вопрос юридическому ассистенту и получите мгновенный ответ.
                </p>
              </div>
              <div className="mt-auto pt-2">
                <Link 
                  href="/chat" 
                  className="text-primary hover:underline inline-flex items-center"
                >
                  Перейти к чату
                </Link>
              </div>
            </div>

            {/*<div className="border rounded-lg p-6">*/}
            {/*  <FileText className="h-8 w-8 text-primary mb-4" />*/}
            {/*  <h2 className="text-xl font-semibold mb-2">Документы</h2>*/}
            {/*  <p className="text-muted-foreground mb-4">*/}
            {/*    Создавайте и управляйте юридическими документами.*/}
            {/*  </p>*/}
            {/*  <Link */}
            {/*    href="/documents" */}
            {/*    className="text-primary hover:underline inline-flex items-center"*/}
            {/*  >*/}
            {/*    Перейти к документам*/}
            {/*  </Link>*/}
            {/*</div>*/}

            <div className="border rounded-lg p-6 flex flex-col h-full">
              <div>
                <CreditCard className="h-8 w-8 text-primary mb-4" />
                <h2 className="text-xl font-semibold mb-2">Управление подпиской</h2>
                <p className="text-muted-foreground mb-4">
                  Просмотр и изменение вашего текущего тарифного плана.
                </p>
              </div>
              <div className="mt-auto pt-2">
                <Link 
                  href="/billing" 
                  className="text-primary hover:underline inline-flex items-center"
                >
                  Управление подпиской
                </Link>
              </div>
            </div>

            <div className="border rounded-lg p-6 flex flex-col h-full">
              <div>
                <HelpCircle className="h-8 w-8 text-primary mb-4" />
                <h2 className="text-xl font-semibold mb-2">Центр поддержки</h2>
                <p className="text-muted-foreground mb-4">
                  Получите ответы на часто задаваемые вопросы или свяжитесь с нашей службой поддержки.
                </p>
              </div>
              <div className="mt-auto pt-2">
                <Link 
                  href="/support" 
                  className="text-primary hover:underline inline-flex items-center"
                >
                  Перейти в центр поддержки
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
