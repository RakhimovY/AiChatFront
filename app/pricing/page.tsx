"use client";

import { Plan } from "@/components/pricing/types";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import PricingHeader from "@/components/pricing/PricingHeader";
import PricingPlans from "@/components/pricing/PricingPlans";
import FAQ from "@/components/pricing/FAQ";
import CTASection from "@/components/ui/CTASection";

export default function PricingPage() {
  const plans: Plan[] = [
    {
      id: "free",
      name: "Бесплатный",
      price: 0,
      description: "Идеально для ознакомления с сервисом",
      features: [
        { name: "До 30 запросов в чате с ИИ", included: true },
        { name: "Базовые юридические консультации", included: true },
        { name: "Ограниченный анализ документов (до 5 страниц)", included: true },
        { name: "История чатов (до 7 дней)", included: true },
        { name: "Экспорт чатов", included: true },
        { name: "Расширенные юридические консультации", included: false },
        { name: "Полный анализ документов", included: false },
        { name: "Приоритетная поддержка", included: false },
        { name: "Неограниченная история чатов", included: false },
      ],
    },
    {
      id: "monthly",
      name: "Месячный",
      price: 9.99,
      description: "Оптимальный выбор для активных пользователей и малого бизнеса",
      features: [
        { name: "Безлимитные запросы в чате с ИИ", included: true },
        { name: "Расширенные юридические консультации", included: true },
        { name: "Полный анализ документов (до 50 страниц)", included: true },
        { name: "История чатов (до 30 дней)", included: true },
        { name: "Экспорт чатов", included: true },
        { name: "Приоритетная поддержка", included: false },
        { name: "Неограниченный анализ документов", included: false },
        { name: "Неограниченная история чатов", included: false },
      ],
      popular: true,
    },
    {
      id: "yearly",
      name: "Годовой",
      price: 99.99,
      description: "Максимальная выгода для долгосрочного использования (экономия более 15%)",
      features: [
        { name: "Безлимитные запросы в чате с ИИ", included: true },
        { name: "Расширенные юридические консультации", included: true },
        { name: "Неограниченный анализ документов", included: true },
        { name: "Неограниченная история чатов", included: true },
        { name: "Экспорт чатов", included: true },
        { name: "Приоритетная поддержка", included: true },
      ],
    },
  ];

  // Define FAQ items
  const faqItems = [
    {
      question: "Как работает пробный период?",
      answer: "При регистрации вы получаете 7-дневный бесплатный доступ к выбранному тарифу. Оплата будет списана только после окончания пробного периода, если вы не отмените подписку."
    },
    {
      question: "Могу ли я сменить тариф?",
      answer: "Да, вы можете изменить свой тариф в любое время. При повышении тарифа изменения вступят в силу немедленно, при понижении - с начала следующего платежного периода."
    },
    {
      question: "Какие способы оплаты вы принимаете?",
      answer: "Мы принимаем все основные кредитные и дебетовые карты (Visa, MasterCard, МИР), а также электронные платежи через ЮMoney, QIWI и СБП."
    },
    {
      question: "Как отменить подписку?",
      answer: "Вы можете отменить подписку в любое время в разделе \"Настройки\" вашего личного кабинета. После отмены вы сможете пользоваться сервисом до конца оплаченного периода."
    },
    {
      question: "Как работает функция загрузки документов?",
      answer: "Вы можете загрузить юридический документ в формате PDF или DOC, и наш ИИ проанализирует его содержание. После этого вы сможете задавать вопросы, основываясь на содержании документа, и получать релевантные ответы."
    },
    {
      question: "Предоставляете ли вы юридические услуги?",
      answer: "AIuris предоставляет информационные услуги и не заменяет консультацию с квалифицированным юристом. Мы рекомендуем обращаться к профессиональным юристам для решения конкретных правовых вопросов."
    }
  ];

  return (
    <main className="flex flex-col min-h-screen pt-16">
      {/* Navigation */}
      <Navigation activePage="pricing" />

      {/* Header */}
      <PricingHeader 
        title="Выберите подходящий тариф" 
        description="Все тарифы включают 7-дневный пробный период. Отмените в любое время."
      />

      {/* Pricing Table */}
      <PricingPlans plans={plans} />

      {/* FAQ Section */}
      <FAQ items={faqItems} />

      {/* CTA Section */}
      <CTASection 
        title="Остались вопросы?"
        description="Наша команда поддержки готова помочь вам с любыми вопросами о тарифах и возможностях сервиса."
        buttonText="Связаться с поддержкой"
        buttonLink="/support"
      />

      {/* Footer */}
      <Footer />
    </main>
  );
}
