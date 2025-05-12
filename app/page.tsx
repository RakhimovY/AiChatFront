import { ArrowRight, MessageSquare, FileText } from "lucide-react";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import PricingPreview from "@/components/landing/PricingPreview";
import CTASection from "@/components/ui/CTASection";

export default function Home() {
  // Define features
  const features = [
    {
      icon: MessageSquare,
      title: "Чат с ИИ",
      description: "Задавайте юридические вопросы и получайте мгновенные ответы от нашего искусственного интеллекта, обученного на правовых документах."
    },
    {
      icon: FileText,
      title: "Загрузка документов",
      description: "Загружайте юридические документы и задавайте вопросы, основываясь на их содержании. Наш ИИ проанализирует документ и предоставит релевантные ответы."
    }
  ];

  // Define pricing plans
  const pricingPlans = [
    {
      id: "free",
      name: "Бесплатный",
      price: 0,
      description: "Для ознакомления",
      features: [
        "До 30 запросов в чате с ИИ",
        "Базовые юридические консультации",
        "Ограниченный анализ документов (до 5 страниц)"
      ]
    },
    {
      id: "monthly",
      name: "Месячный",
      price: 9.99,
      description: "Для активных пользователей",
      features: [
        "Безлимитные запросы в чате с ИИ",
        "Расширенные юридические консультации",
        "Полный анализ документов (до 50 страниц)",
        "История чатов (до 30 дней)"
      ],
      popular: true
    },
    {
      id: "yearly",
      name: "Годовой",
      price: 99.99,
      description: "Максимальная выгода (экономия более 15%)",
      features: [
        "Все функции Месячного тарифа",
        "Приоритетная поддержка",
        "Неограниченный анализ документов",
        "Неограниченная история чатов"
      ]
    }
  ];

  return (
    <main className="flex flex-col min-h-screen">
      {/* Navigation */}
      <Navigation activePage="home" />

      {/* Hero Section */}
      <Hero 
        title="Юридический ассистент на базе искусственного интеллекта"
        description="Получите мгновенные ответы на юридические вопросы, составьте документы и проконсультируйтесь по правовым вопросам с помощью передовых технологий ИИ."
        primaryButtonText="Начать бесплатно"
        primaryButtonLink="/auth/register"
        secondaryButtonText="Попробовать демо"
        secondaryButtonLink="/demo"
      />

      {/* Features Section */}
      <Features 
        title="Возможности LegalGPT"
        features={features}
      />

      {/* Pricing Section Preview */}
      <PricingPreview 
        title="Доступные тарифы"
        description="Выберите подходящий тариф для ваших потребностей. От базового плана для личного использования до расширенных возможностей для профессионалов."
        plans={pricingPlans}
      />

      {/* CTA Section */}
      <CTASection 
        title="Готовы начать?"
        description="Зарегистрируйтесь сейчас и получите 7 дней бесплатного доступа к Стандарт-тарифу."
        buttonText="Создать аккаунт"
        buttonLink="/auth/register"
        icon={<ArrowRight className="ml-2 h-5 w-5" />}
        bgClass="py-20 bg-primary/5"
      />

      {/* Footer */}
      <Footer />
    </main>
  );
}
