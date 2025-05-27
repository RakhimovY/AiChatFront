import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { Session } from "next-auth";

interface UserProfileProps {
  session: Session | null;
  expanded?: boolean;
}

/**
 * Component for displaying user profile information
 */
export default function UserProfile({ session, expanded = true }: UserProfileProps) {
  const { t } = useLanguage();

  return (
    <Link href="/settings">
      <div className="flex items-center cursor-pointer hover:bg-accent rounded-md p-1 md:p-2 h-12">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          {session?.user?.image ? (
            <img 
              src={session.user.image} 
              alt={session?.user?.name || t.user} 
              className="h-8 w-8 rounded-full" 
            />
          ) : (
            <span className="text-primary font-medium">
              {(session?.user?.name || t.user.charAt(0)).charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div className={`ml-2 md:ml-3 sidebar-content-transition ${expanded ? 'opacity-100 max-w-[200px]' : 'opacity-0 max-w-0 overflow-hidden'}`}>
          <p className="text-sm font-medium whitespace-nowrap">{session?.user?.name || t.user}</p>
          <p className="text-xs text-muted-foreground whitespace-nowrap">{session?.user?.email || t.guest}</p>
        </div>
      </div>
    </Link>
  );
}
