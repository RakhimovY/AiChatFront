"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import LanguageSelector from "@/components/layout/LanguageSelector";

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { t } = useLanguage();

  useEffect(() => {
    // Set error message based on error code
    switch (error) {
      case "CredentialsSignin":
        setErrorMessage(t.errorInvalidCredentials);
        break;
      case "GoogleCredentialsNotConfigured":
        setErrorMessage(t.errorGoogleConfig);
        break;
      case "InvalidBackendResponse":
        setErrorMessage(t.errorBackendAuth);
        break;
      case "BackendUnavailable":
        setErrorMessage(t.errorBackendUnavailable);
        break;
      case "GoogleAuthFailed":
        setErrorMessage(t.errorGoogleAuth);
        break;
      case "OAuthAccountNotLinked":
        setErrorMessage(t.errorAccountLinked);
        break;
      case "OAuthSignin":
        setErrorMessage(t.errorOAuthInit);
        break;
      case "OAuthCallback":
        setErrorMessage(t.errorOAuthCallback);
        break;
      default:
        setErrorMessage(t.errorGenericAuth);
    }
  }, [error, t]);

  return (
    <main className="flex flex-col min-h-screen bg-background">
      <div className="container py-12">
        <div className="flex justify-between items-center mb-8">
          <Link href="/auth/login" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.backToLoginPage}
          </Link>
          <LanguageSelector />
        </div>

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
              <li>{t.checkCredentials}</li>
              <li>{t.tryAnotherMethod}</li>
              <li>{t.checkConnection}</li>
              <li>{t.tryLater}</li>
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
