import { Plan } from "@/components/pricing/types";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import PricingHeader from "@/components/pricing/PricingHeader";
import PricingPlans from "@/components/pricing/PricingPlans";
import FAQ from "@/components/pricing/FAQ";
import CTASection from "@/components/ui/CTASection";

export default function PricingPage() {
  // Define pricing plans
  const plans: Plan[] = [
    {
      id: "basic",
      name: "Базовый",
      price: 990,
      description: "Идеально для личного использования и базовых юридических вопросов",
      features: [
        { name: "До 50 запросов в день", included: true },
        { name: "Базовые юридические консультации", included: true },
        { name: "Простые шаблоны документов", included: true },
        { name: "История чатов (до 7 дней)", included: true },
        { name: "Экспорт чатов", included: true },
        { name: "Расширенные юридические консультации", included: false },
        { name: "Все шаблоны документов", included: false },
        { name: "Анализ документов", included: false },
        { name: "Приоритетная поддержка", included: false },
        { name: "API-доступ", included: false },
      ],
    },
    {
      id: "standard",
      name: "Стандарт",
      price: 1990,
      description: "Оптимальный выбор для активных пользователей и малого бизнеса",
      features: [
        { name: "До 200 запросов в день", included: true },
        { name: "Базовые юридические консультации", included: true },
        { name: "Простые шаблоны документов", included: true },
        { name: "История чатов (до 30 дней)", included: true },
        { name: "Экспорт чатов", included: true },
        { name: "Расширенные юридические консультации", included: true },
        { name: "Все шаблоны документов", included: true },
        { name: "Анализ документов", included: true },
        { name: "Приоритетная поддержка", included: false },
        { name: "API-доступ", included: false },
      ],
      popular: true,
    },
    {
      id: "professional",
      name: "Профессиональный",
      price: 4990,
      description: "Полный набор возможностей для юристов и компаний",
      features: [
        { name: "Безлимитные запросы", included: true },
        { name: "Базовые юридические консультации", included: true },
        { name: "Простые шаблоны документов", included: true },
        { name: "История чатов (неограниченно)", included: true },
        { name: "Экспорт чатов", included: true },
        { name: "Расширенные юридические консультации", included: true },
        { name: "Все шаблоны документов", included: true },
        { name: "Анализ документов", included: true },
        { name: "Приоритетная поддержка", included: true },
        { name: "API-доступ", included: true },
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
      question: "Предоставляете ли вы юридические услуги?",
      answer: "LegalGPT предоставляет информационные услуги и не заменяет консультацию с квалифицированным юристом. Мы рекомендуем обращаться к профессиональным юристам для решения конкретных правовых вопросов."
    }
  ];

  return (
    <main className="flex flex-col min-h-screen">
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
