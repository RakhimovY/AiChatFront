import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

/**
 * Component for displaying subscription information
 */
export default function SubscriptionInfo() {
  const { t } = useLanguage();

  return (
    <Link href="/subscription">
      <div className="flex items-center space-x-2 md:space-x-3 cursor-pointer hover:bg-accent rounded-md p-1 md:p-2">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-primary">💎</span>
        </div>
        <div>
          <p className="text-sm font-medium">Subscription</p>
          <p className="text-xs text-muted-foreground">Manage your plan</p>
        </div>
      </div>
    </Link>
  );
}