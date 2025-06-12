"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import LanguageSelector from "@/components/layout/LanguageSelector";
import Navigation from "@/components/layout/Navigation";
import { Mail, MessageCircle, Phone } from "lucide-react";

interface ContactCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
}

interface FAQItemProps {
  question: string;
  answer: string;
}

const ContactCard = ({ icon, title, description, link }: ContactCardProps) => (
  <a
    href={link}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-start space-x-4 p-6 bg-card rounded-lg border hover:shadow-md transition-shadow"
  >
    <div className="p-2 bg-primary/10 rounded-lg">{icon}</div>
    <div>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  </a>
);

const FAQItem = ({ question, answer }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.maxHeight = isOpen ? `${contentRef.current.scrollHeight}px` : "0px";
    }
  }, [isOpen]);

  return (
    <div className="border-b last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 text-left flex justify-between items-center"
      >
        <span className="font-medium">{question}</span>
        <span className={`transform transition-transform ${isOpen ? "rotate-180" : ""}`}>
          ▼
        </span>
      </button>
      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: "0px" }}
      >
        <div className="pb-4 text-muted-foreground">{answer}</div>
      </div>
    </div>
  );
};

export default function SupportPage() {
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const contactMethods = [
    {
      icon: <Mail className="h-6 w-6 text-primary" />,
      title: t.email || "Email",
      description: t.emailSupportDescription || "Отправьте нам сообщение, и мы ответим вам в течение 24 часов.",
      link: "mailto:support@aiuris.ru"
    },
    {
      icon: <MessageCircle className="h-6 w-6 text-primary" />,
      title: "WhatsApp",
      description: t.whatsappDescription || "Свяжитесь с нами через WhatsApp для быстрого ответа.",
      link: "https://wa.me/your-number"
    },
    {
      icon: <Phone className="h-6 w-6 text-primary" />,
      title: "Telegram",
      description: t.telegramDescription || "Напишите нам в Telegram для оперативной поддержки.",
      link: "https://t.me/your-username"
    }
  ];

  const faqItems = [
    {
      question: t.faqHowWorks || "Как работает сервис?",
      answer: t.faqHowWorksAnswer || "Наш сервис использует искусственный интеллект для анализа юридических документов и предоставления консультаций."
    },
    {
      question: t.faqPlans || "Какие тарифные планы доступны?",
      answer: t.faqPlansAnswer || "У нас есть бесплатный план и несколько платных тарифов с расширенными возможностями."
    },
    {
      question: t.faqPrivacy || "Как обеспечивается конфиденциальность?",
      answer: t.faqPrivacyAnswer || "Мы используем современные методы шифрования и строгие политики безопасности для защиты ваших данных."
    }
  ];

  return (
    <main className="flex flex-col min-h-screen bg-background">
      <Navigation activePage="home" />
      <div className="container py-12 mt-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">{t.supportCenter || "Центр поддержки"}</h1>
            <p className="text-xl text-muted-foreground">{t.supportDescription || "Мы всегда готовы помочь вам с любыми вопросами"}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 mb-12">
            {contactMethods.map((method, index) => (
              <ContactCard key={index} {...method} />
            ))}
          </div>

          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-2xl font-bold mb-6">{t.faq || "Часто задаваемые вопросы"}</h2>
            <div className="space-y-2">
              {faqItems.map((item, index) => (
                <FAQItem key={index} {...item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
