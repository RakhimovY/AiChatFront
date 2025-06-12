"use client";

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import SubscriptionPromo from '@/components/subscription/SubscriptionPromo';
import { Bot, MessageSquare, Shield, Zap, LucideIcon } from 'lucide-react';
import Navigation from "@/components/layout/Navigation";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import Footer from "@/components/layout/Footer";
import Section from "@/components/layout/Section";
import ChatMessage from "@/components/chat/ChatMessage";

type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

type LanguageContext = Record<string, string>;

const features: Feature[] = [
  {
    icon: MessageSquare,
    title: "featureAiChat",
    description: "featureAiChatDesc"
  },
  {
    icon: Shield,
    title: "featureDocUpload",
    description: "featureDocUploadDesc"
  },
  {
    icon: Zap,
    title: "Fast Responses",
    description: "Get quick answers to your legal questions without waiting for an appointment."
  }
];

const pricingFeatures = [
  "pricingFeature4",
  "pricingFeature9",
  "pricingFeature6",
  "pricingFeature8"
] as const;

type FeatureCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  t: LanguageContext;
};

const FeatureCard = ({ icon: Icon, title, description, t }: FeatureCardProps) => (
  <Card>
    <CardContent className="pt-6">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="p-3 rounded-full bg-primary/10">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-xl font-medium">
          {typeof title === "string" ? title : t[title]}
        </h3>
        <p className="text-muted-foreground">
          {typeof description === "string" ? description : t[description]}
        </p>
      </div>
    </CardContent>
  </Card>
);

type SectionProps = {
  t: LanguageContext;
};

const HeroSection = ({ t }: SectionProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
    <div className="space-y-6">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
        {t.heroTitle}
      </h1>
      <p className="text-xl text-muted-foreground">
        {t.heroDescription}
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button size="lg" asChild>
          <Link href="/auth/login">{t.startFree}</Link>
        </Button>
      </div>
    </div>
    <div className="relative">
      <Card className="border-primary/20 overflow-hidden">
        <CardContent className="p-3 md:p-6">
          <div className="space-y-4">
            <ChatMessage iconText="U" isUser>
              Can you explain the legal requirements for starting a business?
            </ChatMessage>
            <ChatMessage icon={Bot}>
              <p>To start a business, you'll need to consider several legal requirements:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Choose a business structure (LLC, corporation, etc.)</li>
                <li>Register your business name</li>
                <li>Obtain necessary licenses and permits</li>
                <li>Apply for an EIN (Employer Identification Number)</li>
                <li>Register for state and local taxes</li>
              </ul>
              <p className="mt-2">Would you like me to explain any of these in more detail?</p>
            </ChatMessage>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

const FeaturesSection = ({ t }: SectionProps) => (
  <Section background="muted">
    <h2 className="text-3xl font-bold text-center mb-12">{t.featuresTitle}</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {features.map((feature) => (
        <FeatureCard key={feature.title} {...feature} t={t} />
      ))}
    </div>
  </Section>
);

const PricingSection = ({ t }: SectionProps) => (
  <Section>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      <div className="space-y-6">
        <h2 className="text-3xl font-bold">{t.pricingTitle}</h2>
        <p className="text-lg text-muted-foreground">
          {t.pricingDescription}
        </p>
        <ul className="space-y-2">
          {pricingFeatures.map((feature) => (
            <li key={feature} className="flex items-center">
              <span className="mr-2">✓</span>
              <span>{t[feature]}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <SubscriptionPromo className="max-w-md mx-auto" />
      </div>
    </div>
  </Section>
);

const HomePage = () => {
  const { data: session, status } = useSession();
  const { t } = useLanguage();

  if (status === 'loading') return null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation activePage="home" />
      <Section className="py-10 md:py-20 mt-16">
        <HeroSection t={t} />
      </Section>
      <FeaturesSection t={t} />
      <PricingSection t={t} />
      <Footer />
    </div>
  );
};

export default HomePage;
