import Link from "next/link";
import {Bot, Scale} from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export default function Footer() {
  const { t } = useLanguage();

  return (
      <footer className="py-4 md:py-8 px-2 md:px-4 border-t">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Scale className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">{t.appName}</span>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/auth/login" className="text-sm text-muted-foreground hover:text-foreground">
                {t.login}
              </Link>
              <Link href="/auth/register" className="text-sm text-muted-foreground hover:text-foreground">
                {t.register}
              </Link>
              <Link href="/subscription" className="text-sm text-muted-foreground hover:text-foreground">
                {t.subscription}
              </Link>
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                {t.privacyPolicy}
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                {t.termsOfService}
              </Link>
            </div>
          </div>
          <div className="mt-6 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} {t.appName}. {t.allRightsReserved}
          </div>
        </div>
      </footer>
  );
}
