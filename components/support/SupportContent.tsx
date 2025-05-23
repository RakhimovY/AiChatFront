"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  MessageSquare, 
  CreditCard, 
  HelpCircle,
  Mail,
  FileText
} from "lucide-react";
import Sidebar, { MenuItem, User } from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

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
  const { t } = useLanguage();

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
    { icon: MessageSquare, label: t.chats || "Чаты", href: "/chat" },
    { icon: CreditCard, label: t.subscription || "Подписка", href: "/billing" },
    { icon: HelpCircle, label: t.help || "Помощь", href: "/support" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header component for both mobile and desktop */}
      <Header
        user={user}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        pageTitle={t.supportCenter || "Центр поддержки"}
        pageRoute="/support"
      />

      <div className="flex flex-1 pt-16 md:pt-20">
        {/* Sidebar */}
        <Sidebar 
          menuItems={menuItems}
          user={user}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          activePage="/support"
        />

        {/* Main content */}
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-6">{t.supportCenter || "Центр поддержки"}</h1>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="border rounded-lg p-6">
              <Mail className="h-8 w-8 text-primary mb-4" />
              <h2 className="text-xl font-semibold mb-2">{t.email || "Email"}</h2>
              <p className="text-muted-foreground mb-4">
                {t.emailSupportDescription || "Отправьте нам сообщение, и мы ответим вам в течение 24 часов."}
              </p>
              <a 
                href="mailto:erke.bulan622@gmail.com" 
                className="text-primary hover:underline inline-flex items-center"
              >
                erke.bulan622@gmail.com
              </a>
            </div>

            <div className="border rounded-lg p-6">
              <MessageSquare className="h-8 w-8 text-green-500 mb-4" />
              <h2 className="text-xl font-semibold mb-2">WhatsApp</h2>
              <p className="text-muted-foreground mb-4">
                {t.whatsappDescription || "Свяжитесь с нами через WhatsApp для быстрого ответа."}
              </p>
              <a 
                href="https://wa.me/77086934037?text=Здравствуйте!%20У%20меня%20вопрос%20о%20AIuris." 
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline inline-flex items-center"
              >
                +7 708 693 4037
              </a>
            </div>

            <div className="border rounded-lg p-6">
              <MessageSquare className="h-8 w-8 text-blue-500 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Telegram</h2>
              <p className="text-muted-foreground mb-4">
                {t.telegramDescription || "Напишите нам в Telegram для оперативной поддержки."}
              </p>
              <a 
                href="https://t.me/YerkebulanR" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline inline-flex items-center"
              >
                @YerkebulanR
              </a>
            </div>
          </div>

          <h2 className="text-xl font-bold mb-4">{t.faq || "Часто задаваемые вопросы"}</h2>

          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">{t.faqHowWorks}</h3>
              <p className="text-muted-foreground">
                {t.faqHowWorksAnswer}
              </p>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">{t.faqPlans}</h3>
              <p className="text-muted-foreground">
                {t.faqPlansAnswer}
              </p>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">{t.faqPrivacy}</h3>
              <p className="text-muted-foreground">
                {t.faqPrivacyAnswer}
              </p>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">{t.faqExport}</h3>
              <p className="text-muted-foreground">
                {t.faqExportAnswer}
              </p>
            </div>
          </div>

          <div className="mt-8 p-6 border rounded-lg bg-primary/5">
            <div className="flex items-start">
              <FileText className="h-8 w-8 text-primary mr-4 flex-shrink-0" />
              <div>
                <h2 className="text-xl font-semibold mb-2">{t.documentation}</h2>
                <p className="text-muted-foreground mb-4">
                  {t.documentationDescription}
                </p>
                <div className="flex items-center px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-md text-sm">
                  <span className="text-yellow-800 dark:text-yellow-200">
                    {t.documentationNotice}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
