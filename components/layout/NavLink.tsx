import Link from "next/link";
import { ReactNode } from "react";

interface NavLinkProps {
    href: string;
    isActive?: boolean;
    onClick?: () => void;
    children: ReactNode;
    className?: string;
    isMobile?: boolean;
}

export default function NavLink({
    href,
    isActive,
    onClick,
    children,
    className = "",
    isMobile = false
}: NavLinkProps) {
    const baseClasses = "text-sm transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary";
    const activeClasses = "text-foreground font-medium bg-accent/50";
    const inactiveClasses = "text-muted-foreground hover:text-foreground hover:bg-accent/30";
    const paddingClasses = isMobile ? "px-3 py-2.5" : "px-3 py-2";

    return (
        <Link
            href={href}
            className={`${baseClasses} ${paddingClasses} rounded-md ${isActive ? activeClasses : inactiveClasses} ${className}`}
            onClick={onClick}
            aria-current={isActive ? "page" : undefined}
        >
            {children}
        </Link>
    );
} 