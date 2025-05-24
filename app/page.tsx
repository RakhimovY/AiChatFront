"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import SubscriptionPromo from '@/components/subscription/SubscriptionPromo';
import { Bot, MessageSquare, Shield, Zap } from 'lucide-react';
import Navigation from "@/components/layout/Navigation";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import Footer from "@/components/layout/Footer";

export default function Page() {
  const { data: session, status } = useSession();
  const { t } = useLanguage();

  // If still loading, show nothing
  if (status === 'loading') {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navigation activePage="home" />

      {/* Hero section */}
      <section className="py-10 md:py-20 px-2 md:px-4 mt-16">
        <div className="container mx-auto max-w-6xl">
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
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-medium">U</span>
                      </div>
                      <div className="bg-muted p-2 md:p-3 rounded-lg">
                        <p>Can you explain the legal requirements for starting a business?</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                      <div className="bg-primary/10 p-2 md:p-3 rounded-lg">
                        <p>To start a business, you'll need to consider several legal requirements:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                          <li>Choose a business structure (LLC, corporation, etc.)</li>
                          <li>Register your business name</li>
                          <li>Obtain necessary licenses and permits</li>
                          <li>Apply for an EIN (Employer Identification Number)</li>
                          <li>Register for state and local taxes</li>
                        </ul>
                        <p className="mt-2">Would you like me to explain any of these in more detail?</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-8 md:py-16 px-2 md:px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">{t.featuresTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <MessageSquare className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium">{t.featureAiChat}</h3>
                  <p className="text-muted-foreground">
                    {t.featureAiChatDesc}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium">{t.featureDocUpload}</h3>
                  <p className="text-muted-foreground">
                    {t.featureDocUploadDesc}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium">Fast Responses</h3>
                  <p className="text-muted-foreground">
                    Get quick answers to your legal questions without waiting for an appointment.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Subscription section */}
      <section className="py-8 md:py-16 px-2 md:px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">{t.pricingTitle}</h2>
              <p className="text-lg text-muted-foreground">
                {t.pricingDescription}
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  <span>{t.pricingFeature4}</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  <span>{t.pricingFeature9}</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  <span>{t.pricingFeature6}</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  <span>{t.pricingFeature8}</span>
                </li>
              </ul>
            </div>
            <div>
              <SubscriptionPromo className="max-w-md mx-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer/>
    </div>
  );
}
