"use client";

import {useRef, useEffect} from "react";
import Link from "next/link";
import {signOut} from "next-auth/react";
import {Bot, LogOut} from "lucide-react";
import {ThemeToggle} from "@/components/theme/ThemeToggle";

// Define types for menu items
export type MenuItem = {
    icon: React.ElementType;
    label: string;
    href: string;
};

// Define types for user
export type User = {
    name: string;
    email: string;
    image?: string;
};

// Define props for the Sidebar component
type SidebarProps = {
    menuItems: MenuItem[];
    user: User;
    isMobileMenuOpen: boolean;
    setIsMobileMenuOpen?: (isOpen: boolean) => void;
    activePage?: string;
};

export default function Sidebar({
                                    menuItems,
                                    user,
                                    isMobileMenuOpen,
                                    setIsMobileMenuOpen,
                                    activePage
                                }: SidebarProps) {
    // Reference to the sidebar element for click-outside handling
    const sidebarRef = useRef<HTMLDivElement>(null);

    // Handle clicks outside the sidebar to close it on mobile
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Only proceed if the sidebar is open and we're on mobile
            if (!isMobileMenuOpen || window.innerWidth >= 768) return;

            // Check if the click was outside the sidebar
            if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
                setIsMobileMenuOpen?.(false);
            }
        };

        // Add event listener
        document.addEventListener('mousedown', handleClickOutside);

        // Clean up
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMobileMenuOpen, setIsMobileMenuOpen]);

    // Handle sign out
    const handleSignOut = async () => {
        await signOut({redirect: true, callbackUrl: '/'});
    };

    return (
        <aside
            ref={sidebarRef}
            className={`
        ${isMobileMenuOpen ? 'block' : 'hidden'} 
        md:block w-64 border-r bg-card fixed md:static inset-y-0 z-10 md:pt-0
      `}
        >
            <div className="py-2 md:py-4 px-2 md:px-4 border-b md:hidden">
                <div className="flex justify-between items-center">
                    <Link href="/chat" className="flex items-center space-x-2">
                        <Bot className="h-6 w-6 text-primary"/>
                        <span className="font-bold text-lg">AIuris</span>
                    </Link>
                    <ThemeToggle/>
                </div>
            </div>
            <nav className="p-2 md:p-4 space-y-1">
                {menuItems.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = activePage === item.href;
                    return (
                        <Link
                            key={index}
                            href={item.href}
                            className={`flex items-center p-2 rounded-md hover:bg-accent 
                ${isActive
                                ? "bg-accent/50 text-foreground font-medium"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                            onClick={() => setIsMobileMenuOpen?.(false)}
                        >
                            <Icon className="h-5 w-5 mr-3"/>
                            {item.label}
                        </Link>
                    );
                })}
                <button
                    onClick={handleSignOut}
                    className="flex items-center p-2 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground w-full text-left"
                >
                    <LogOut className="h-5 w-5 mr-3"/>
                    Выйти
                </button>
            </nav>
        </aside>
    );
}
