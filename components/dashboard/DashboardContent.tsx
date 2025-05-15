"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { 
  MessageSquare, 
  FileText, 
  Settings, 
  CreditCard, 
  HelpCircle, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

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

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
  };

  const menuItems = [
    { icon: MessageSquare, label: "Чаты", href: "/chat" },
    // { icon: FileText, label: "Документы", href: "/documents" },
    { icon: CreditCard, label: "Подписка", href: "/billing" },
    // { icon: Settings, label: "Настройки", href: "/settings" },
    { icon: HelpCircle, label: "Помощь", href: "/support" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container flex justify-between items-center py-4">
          <div className="flex items-center">
            <button 
              className="md:hidden mr-4"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
            <Link href="/dashboard" className="text-xl font-bold">
              LegalGPT
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <div className="text-sm text-right">
              <div className="font-medium">{user.name}</div>
              <div className="text-muted-foreground">{user.email}</div>
            </div>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
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
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside 
          className={`
            ${isMobileMenuOpen ? 'block' : 'hidden'} 
            md:block w-64 border-r bg-card fixed md:static inset-y-0 z-10 pt-16 md:pt-0
          `}
        >
          <nav className="p-4 space-y-1">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link
                  key={index}
                  href={item.href}
                  className="flex items-center p-2 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground"
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.label}
                </Link>
              );
            })}
            <button
              onClick={handleSignOut}
              className="flex items-center p-2 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground w-full text-left"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Выйти
            </button>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-6">Личный кабинет</h1>
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
            <div className="border rounded-lg p-6">
              <MessageSquare className="h-8 w-8 text-primary mb-4" />
              <h2 className="text-xl font-semibold mb-2">Начать чат</h2>
              <p className="text-muted-foreground mb-4">
                Задайте вопрос юридическому ассистенту и получите мгновенный ответ.
              </p>
              <Link 
                href="/chat" 
                className="text-primary hover:underline inline-flex items-center"
              >
                Перейти к чату
              </Link>
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

            <div className="border rounded-lg p-6">
              <CreditCard className="h-8 w-8 text-primary mb-4" />
              <h2 className="text-xl font-semibold mb-2">Управление подпиской</h2>
              <p className="text-muted-foreground mb-4">
                Просмотр и изменение вашего текущего тарифного плана.
              </p>
              <Link 
                href="/billing" 
                className="text-primary hover:underline inline-flex items-center"
              >
                Управление подпиской
              </Link>
            </div>

            <div className="border rounded-lg p-6">
              <HelpCircle className="h-8 w-8 text-primary mb-4" />
              <h2 className="text-xl font-semibold mb-2">Центр поддержки</h2>
              <p className="text-muted-foreground mb-4">
                Получите ответы на часто задаваемые вопросы или свяжитесь с нашей службой поддержки.
              </p>
              <Link 
                href="/support" 
                className="text-primary hover:underline inline-flex items-center"
              >
                Перейти в центр поддержки
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
