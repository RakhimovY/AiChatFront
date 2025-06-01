import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface NavButtonProps {
    href: string;
    variant?: "primary" | "secondary";
    icon?: LucideIcon;
    children: ReactNode;
    onClick?: () => void;
    className?: string;
    isMobile?: boolean;
}

export default function NavButton({
    href,
    variant = "primary",
    icon: Icon,
    children,
    onClick,
    className = "",
    isMobile = false
}: NavButtonProps) {
    const baseClasses = "text-sm transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary";
    const variantClasses = variant === "primary"
        ? "bg-primary text-primary-foreground hover:bg-primary/90"
        : "bg-secondary text-secondary-foreground hover:bg-secondary/80";
    const paddingClasses = isMobile ? "px-4 py-2.5" : "px-4 py-2";

    return (
        <Link
            href={href}
            className={`${baseClasses} ${paddingClasses} rounded-md ${variantClasses} ${className} ${Icon ? "flex items-center gap-2" : ""
                } ${isMobile ? "justify-center" : ""}`}
            onClick={onClick}
        >
            {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
            {children}
        </Link>
    );
} 