"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { 
  MessageSquare, 
  CreditCard, 
  HelpCircle, 
  LogOut,
  Menu,
  X,
  Mail,
  Phone,
  FileText
} from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

type SupportContentProps = {
  user: {
    name: string;
    email: string;
    image?: string;
  };
};

export default function SupportContent({ user }: SupportContentProps) {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
  };

  const menuItems = [
    { icon: MessageSquare, label: "Чаты", href: "/chat" },
    { icon: CreditCard, label: "Подписка", href: "/billing" },
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
            <Link href="/dashboard">
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
          <h1 className="text-2xl font-bold mb-6">Центр поддержки</h1>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="border rounded-lg p-6">
              <Mail className="h-8 w-8 text-primary mb-4" />
              <h2 className="text-xl font-semibold mb-2">Напишите нам</h2>
              <p className="text-muted-foreground mb-4">
                Отправьте нам сообщение, и мы ответим вам в течение 24 часов.
              </p>
              <a 
                href="mailto:support@legalgpt.ru" 
                className="text-primary hover:underline inline-flex items-center"
              >
                support@legalgpt.ru
              </a>
            </div>

            <div className="border rounded-lg p-6">
              <Phone className="h-8 w-8 text-primary mb-4" />
              <h2 className="text-xl font-semibold mb-2">Позвоните нам</h2>
              <p className="text-muted-foreground mb-4">
                Наша служба поддержки доступна с 9:00 до 18:00 по московскому времени.
              </p>
              <a 
                href="tel:+74951234567" 
                className="text-primary hover:underline inline-flex items-center"
              >
                +7 (495) 123-45-67
              </a>
            </div>
          </div>

          <h2 className="text-xl font-bold mb-4">Часто задаваемые вопросы</h2>

          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Как работает юридический ассистент?</h3>
              <p className="text-muted-foreground">
                Наш юридический ассистент использует искусственный интеллект для анализа вашего вопроса и предоставления релевантной информации на основе российского законодательства.
              </p>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Какие тарифные планы доступны?</h3>
              <p className="text-muted-foreground">
                У нас есть несколько тарифных планов, от базового до премиум, с различными функциями и ограничениями. Вы можете ознакомиться с ними в разделе "Подписка".
              </p>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Как обеспечивается конфиденциальность моих данных?</h3>
              <p className="text-muted-foreground">
                Мы используем шифрование данных и строго соблюдаем политику конфиденциальности. Ваши данные не передаются третьим лицам без вашего согласия.
              </p>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Могу ли я экспортировать историю чатов?</h3>
              <p className="text-muted-foreground">
                Да, вы можете экспортировать историю чатов в текстовый файл, нажав на кнопку экспорта в интерфейсе чата.
              </p>
            </div>
          </div>

          <div className="mt-8 p-6 border rounded-lg bg-primary/5">
            <div className="flex items-start">
              <FileText className="h-8 w-8 text-primary mr-4 flex-shrink-0" />
              <div>
                <h2 className="text-xl font-semibold mb-2">Документация</h2>
                <p className="text-muted-foreground mb-4">
                  Ознакомьтесь с нашей подробной документацией, чтобы узнать больше о возможностях сервиса и получить ответы на технические вопросы.
                </p>
                <Link 
                  href="/docs" 
                  className="text-primary hover:underline inline-flex items-center"
                >
                  Перейти к документации
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
