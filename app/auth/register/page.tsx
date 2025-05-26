"use client";

import AuthForm from "@/components/auth/AuthForm";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import Navigation from "@/components/layout/Navigation";

export default function RegisterPage() {
  const { t } = useLanguage();

  return (
    <main className="flex flex-col min-h-screen bg-background">
      {/* Navigation */}
      <Navigation />

      <div className="container py-12 mt-16">

        <div className="max-w-md mx-auto">
          <AuthForm type="register" />
        </div>
      </div>
    </main>
  );
}
