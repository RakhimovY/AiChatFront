"use client";

import { ArrowRight, MessageSquare, FileText } from "lucide-react";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import PricingPreview from "@/components/landing/PricingPreview";
import CTASection from "@/components/ui/CTASection";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export default function Home() {
  const { t } = useLanguage();

  // Define features
  const features = [
    {
      icon: MessageSquare,
      title: t.featureAiChat,
      description: t.featureAiChatDesc
    },
    {
      icon: FileText,
      title: t.featureDocUpload,
      description: t.featureDocUploadDesc
    }
  ];

  // Define pricing plans
  const pricingPlans = [
    {
      id: "free",
      name: t.planFree,
      price: 0,
      description: t.planFreeDesc,
      features: [
        t.pricingFeature1,
        t.pricingFeature2,
        t.pricingFeature3
      ]
    },
    {
      id: "monthly",
      name: t.planMonthly,
      price: 9.99,
      description: t.planMonthlyDesc,
      features: [
        t.pricingFeature4,
        t.pricingFeature5,
        t.pricingFeature6,
        t.pricingFeature7
      ],
      popular: true
    },
    {
      id: "yearly",
      name: t.planYearly,
      price: 99.99,
      description: t.planYearlyDesc,
      features: [
        t.pricingFeature8,
        t.pricingFeature9,
        t.pricingFeature10,
        t.pricingFeature11
      ]
    }
  ];

  return (
    <main className="flex flex-col min-h-screen pt-16">
      {/* Navigation */}
      <Navigation activePage="home" />

      {/* Hero Section */}
      <Hero 
        title={t.heroTitle}
        description={t.heroDescription}
        primaryButtonText={t.startFree}
        primaryButtonLink="/auth/register"
        secondaryButtonText={t.tryDemo}
        secondaryButtonLink="/demo"
      />

      {/* Features Section */}
      <Features 
        title={t.featuresTitle}
        features={features}
      />

      {/* Pricing Section Preview */}
      <PricingPreview 
        title={t.pricingTitle}
        description={t.pricingDescription}
        plans={pricingPlans}
      />

      {/* CTA Section */}
      <CTASection 
        title={t.ctaTitle}
        description={t.ctaDescription}
        buttonText={t.createAccount}
        buttonLink="/auth/register"
        icon={<ArrowRight className="ml-2 h-5 w-5" />}
        bgClass="py-20 bg-primary/5"
      />

      {/* Footer */}
      <Footer />
    </main>
  );
}
