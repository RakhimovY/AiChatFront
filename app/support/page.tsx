"use client";

import { useEffect, useRef, useState } from "react";
import { Mail, MessageSquare } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import AuthCheck from "@/components/common/AuthCheck";

export default function SupportPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLanguage();
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!isMobileMenuOpen || window.innerWidth >= 768) return;
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  return (
    <AuthCheck>
      <div className="flex flex-col h-full">
        {/* Header component for both mobile and desktop */}
        <Header
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          pageTitle={t.supportCenter || "Центр поддержки"}
          pageRoute="/support"
        />

        <div className="flex flex-1 pt-16 md:pt-20">
          {/* Sidebar */}
          <div ref={sidebarRef}>
            <Sidebar
              isMobileMenuOpen={isMobileMenuOpen}
              setIsMobileMenuOpen={setIsMobileMenuOpen}
              activePage="/support"
            />
          </div>

          {/* Main content */}
          <main className="flex-1 p-6 md:ml-16">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="border rounded-lg p-6">
                <Mail className="h-8 w-8 text-primary mb-4" />
                <h2 className="text-xl font-semibold mb-2">
                  {t.email || "Email"}
                </h2>
                <p className="text-muted-foreground mb-4">
                  {t.emailSupportDescription ||
                    "Отправьте нам сообщение, и мы ответим вам в течение 24 часов."}
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
                  {t.whatsappDescription ||
                    "Свяжитесь с нами через WhatsApp для быстрого ответа."}
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
                  {t.telegramDescription ||
                    "Напишите нам в Telegram для оперативной поддержки."}
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

            <h2 className="text-xl font-bold mb-4">
              {t.faq || "Часто задаваемые вопросы"}
            </h2>

            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">{t.faqHowWorks}</h3>
                <p className="text-muted-foreground">{t.faqHowWorksAnswer}</p>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">{t.faqPlans}</h3>
                <p className="text-muted-foreground">{t.faqPlansAnswer}</p>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">{t.faqPrivacy}</h3>
                <p className="text-muted-foreground">{t.faqPrivacyAnswer}</p>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">{t.faqExport}</h3>
                <p className="text-muted-foreground">{t.faqExportAnswer}</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </AuthCheck>
  );
}
