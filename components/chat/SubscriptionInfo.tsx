import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

interface SubscriptionInfoProps {
  expanded?: boolean;
}

/**
 * Component for displaying subscription information
 */
export default function SubscriptionInfo({ expanded = true }: SubscriptionInfoProps) {
  const { t } = useLanguage();

  return (
    <Link href="/subscription">
      <div className="flex items-center cursor-pointer hover:bg-accent rounded-md p-1 md:p-2 h-12">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <span className="text-primary">💎</span>
        </div>
        <div className={`ml-2 md:ml-3 sidebar-content-transition ${expanded ? 'opacity-100 max-w-[200px]' : 'opacity-0 max-w-0 overflow-hidden'}`}>
          <p className="text-sm font-medium whitespace-nowrap">Subscription</p>
          <p className="text-xs text-muted-foreground whitespace-nowrap">Manage your plan</p>
        </div>
      </div>
    </Link>
  );
}
