"use client";

import { Linkedin, Mail, MessageSquare } from "lucide-react";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";

interface ContactLinkProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ContactLink = ({ href, icon, title, description }: ContactLinkProps) => (
  <a 
    href={href}
    target="_blank" 
    rel="noopener noreferrer"
    className="flex flex-col items-center p-6 border rounded-lg hover:bg-secondary/50 transition-colors"
  >
    {icon}
    <h3 className="font-medium mb-1">{title}</h3>
    <p className="text-sm text-center text-muted-foreground">{description}</p>
  </a>
);

const AboutSection = () => (
  <section className="py-16">
    <div className="container max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center">О проекте AIuris</h1>

      <div className="prose prose-lg mx-auto">
        <p className="text-xl text-center mb-12">
          AIuris создан с целью сделать юридическую помощь доступной для всех людей.
        </p>

        <h2 className="text-2xl font-semibold mt-12 mb-6">Наша миссия</h2>
        <p>
          Мы верим, что каждый человек должен иметь доступ к качественной юридической информации и поддержке. 
          AIuris использует передовые технологии искусственного интеллекта, чтобы предоставить быстрые и точные 
          ответы на юридические вопросы, делая правовую помощь более доступной и понятной.
        </p>

        <h2 className="text-2xl font-semibold mt-12 mb-6">Основные возможности</h2>
        <ul className="space-y-4">
          <li>
            <strong>Чат с ИИ</strong> - Задавайте юридические вопросы и получайте мгновенные ответы от нашего 
            искусственного интеллекта, обученного на правовых документах и законодательстве.
          </li>
          <li>
            <strong>Загрузка документов</strong> - Загружайте юридические документы и задавайте вопросы, 
            основываясь на их содержании. Наш ИИ проанализирует документ и предоставит релевантные ответы.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-12 mb-6">О создателе</h2>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
          <div className="w-48 h-48 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
            <span className="text-6xl font-bold text-primary">YR</span>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Еркебулан Рахимов</h3>
            <p className="mb-4">
              Основатель и разработчик AIuris. Еркебулан создал этот проект с целью демократизировать 
              доступ к юридической информации и помочь людям лучше понимать свои права и обязанности.
            </p>
            <div className="flex items-center space-x-4">
              <a 
                href="https://www.linkedin.com/in/rakhimov-yerkebulan/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-primary hover:underline"
              >
                <Linkedin className="h-5 w-5 mr-2" />
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mt-12 mb-6">Связаться с нами</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <ContactLink
            href="https://wa.me/77086934037?text=Здравствуйте!%20У%20меня%20вопрос%20о%20AIuris."
            icon={<MessageSquare className="h-10 w-10 text-green-500 mb-3" />}
            title="WhatsApp"
            description="+7 708 693 4037"
          />
          <ContactLink
            href="https://t.me/YerkebulanR"
            icon={<MessageSquare className="h-10 w-10 text-blue-500 mb-3" />}
            title="Telegram"
            description="@YerkebulanR"
          />
          <ContactLink
            href="mailto:erke.bulan622@gmail.com"
            icon={<Mail className="h-10 w-10 text-primary mb-3" />}
            title="Email"
            description="erke.bulan622@gmail.com"
          />
        </div>
      </div>
    </div>
  </section>
);

export default function AboutPage() {
  return (
    <main className="flex flex-col min-h-screen pt-16">
      <Navigation activePage="about" />
      <AboutSection />
      <Footer />
    </main>
  );
}
