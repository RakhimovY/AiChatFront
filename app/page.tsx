import { ArrowRight, BookOpen, Shield, Scale } from "lucide-react";
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
      icon: BookOpen,
      title: "Юридические консультации",
      description: "Получите ответы на вопросы по гражданскому, трудовому, налоговому и другим отраслям права."
    },
    {
      icon: Shield,
      title: "Составление документов",
      description: "Создавайте договоры, заявления, жалобы и другие юридические документы с помощью ИИ."
    },
    {
      icon: Scale,
      title: "Анализ правовых рисков",
      description: "Оценка юридических рисков в договорах и других документах с рекомендациями по их минимизации."
    }
  ];

  // Define pricing plans
  const pricingPlans = [
    {
      id: "basic",
      name: "Базовый",
      price: 990,
      description: "Для личного использования",
      features: [
        "До 50 запросов в день",
        "Базовые юридические консультации",
        "Простые шаблоны документов"
      ]
    },
    {
      id: "standard",
      name: "Стандарт",
      price: 1990,
      description: "Для активных пользователей",
      features: [
        "До 200 запросов в день",
        "Расширенные юридические консультации",
        "Все шаблоны документов",
        "Анализ документов"
      ],
      popular: true
    },
    {
      id: "professional",
      name: "Профессиональный",
      price: 4990,
      description: "Для бизнеса",
      features: [
        "Безлимитные запросы",
        "Приоритетная поддержка",
        "Все функции Стандарт-тарифа",
        "API-доступ"
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
