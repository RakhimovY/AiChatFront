"use client";

import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import Navigation from "@/components/layout/Navigation";

export default function ForgotPasswordPage() {
  const { t } = useLanguage();

  return (
    <main className="flex flex-col min-h-screen bg-background">
      {/* Navigation */}
      <Navigation />

      <div className="container py-12 mt-16">

        <div className="max-w-md mx-auto">
          <ForgotPasswordForm />
        </div>
      </div>
    </main>
  );
}
