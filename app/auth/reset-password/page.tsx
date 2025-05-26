"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import Navigation from "@/components/layout/Navigation";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { t } = useLanguage();

  if (!token) {
    return (
      <main className="flex flex-col min-h-screen bg-background">
        {/* Navigation */}
        <Navigation />

        <div className="container py-12 mt-16">

          <div className="max-w-md mx-auto">
            <div className="w-full max-w-md mx-auto p-6 bg-card rounded-lg shadow-sm border">
              <h2 className="text-2xl font-bold mb-6 text-center">{t.resetPassword}</h2>
              <div className="bg-destructive/10 text-destructive text-sm p-4 rounded-md mb-6">
                {t.invalidResetToken}
              </div>
              <Link 
                href="/auth/forgot-password" 
                className="block w-full py-2 text-center bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                {t.requestPasswordReset}
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col min-h-screen bg-background">
      {/* Navigation */}
      <Navigation />

      <div className="container py-12 mt-16">

        <div className="max-w-md mx-auto">
          <ResetPasswordForm token={token} />
        </div>
      </div>
    </main>
  );
}
