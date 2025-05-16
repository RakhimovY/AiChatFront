"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import LanguageSelector from "@/components/layout/LanguageSelector";

export default function ForgotPasswordPage() {
  const { t } = useLanguage();

  return (
    <main className="flex flex-col min-h-screen bg-background">
      <div className="container py-12">
        <div className="flex justify-between items-center mb-8">
          <Link href="/auth/login" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.backToLogin}
          </Link>
          <LanguageSelector />
        </div>

        <div className="max-w-md mx-auto">
          <ForgotPasswordForm />
        </div>
      </div>
    </main>
  );
}
