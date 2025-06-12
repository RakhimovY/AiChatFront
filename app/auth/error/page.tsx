"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import LanguageSelector from "@/components/layout/LanguageSelector";
import Navigation from "@/components/layout/Navigation";

interface ErrorMessage {
  message: string;
  actions: string[];
}

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { t } = useLanguage();

  useEffect(() => {
    const errorMessages: Record<string, string> = {
      CredentialsSignin: t.errorInvalidCredentials,
      GoogleCredentialsNotConfigured: t.errorGoogleConfig,
      InvalidBackendResponse: t.errorBackendAuth,
      BackendUnavailable: t.errorBackendUnavailable,
      GoogleAuthFailed: t.errorGoogleAuth,
      OAuthAccountNotLinked: t.errorAccountLinked,
      OAuthSignin: t.errorOAuthInit,
      OAuthCallback: t.errorOAuthCallback,
    };

    setErrorMessage(errorMessages[error || ""] || t.errorGenericAuth);
  }, [error, t]);

  const actions = [
    t.checkCredentials,
    t.tryAnotherMethod,
    t.checkConnection,
    t.tryLater
  ];

  return (
    <main className="flex flex-col min-h-screen bg-background">
      <Navigation activePage="home" />
      <div className="container py-12 mt-16">
        <div className="max-w-md mx-auto p-6 bg-card rounded-lg shadow-sm border">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-4 text-center">{t.authError}</h2>

          <div className="bg-destructive/10 text-destructive text-sm p-4 rounded-md mb-6">
            {errorMessage}
          </div>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              {t.tryFollowingActions}
            </p>
            <ul className="text-sm space-y-2 list-disc list-inside">
              {actions.map((action, index) => (
                <li key={index}>{action}</li>
              ))}
            </ul>
          </div>

          <div className="mt-6 flex justify-center">
            <Link 
              href="/auth/login" 
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              {t.backToLoginPage}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
