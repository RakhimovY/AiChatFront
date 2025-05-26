import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { Session } from "next-auth";

interface UserProfileProps {
  session: Session | null;
}

/**
 * Component for displaying user profile information
 */
export default function UserProfile({ session }: UserProfileProps) {
  const { t } = useLanguage();

  return (
    <Link href="/settings">
      <div className="flex items-center space-x-2 md:space-x-3 cursor-pointer hover:bg-accent rounded-md p-1 md:p-2">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
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
        <div>
          <p className="text-sm font-medium">{session?.user?.name || t.user}</p>
          <p className="text-xs text-muted-foreground">{session?.user?.email || t.guest}</p>
        </div>
      </div>
    </Link>
  );
}