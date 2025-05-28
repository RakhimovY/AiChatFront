import {FileText, HelpCircle, MessageSquare, Settings} from "lucide-react";
import React from "react";
import { Translation } from "@/lib/i18n";

export type SubMenuItem = {
    label: string;
    href: string;
    translationKey?: keyof Translation;
};

export type MenuItem = {
    icon: React.ElementType;
    label: string;
    href: string;
    translationKey?: keyof Translation;
    subItems?: SubMenuItem[];
    ariaLabel?: string;
};

/**
 * Get menu items with translations applied
 * @param path Current path for highlighting active items
 * @param t Translation object from useLanguage hook
 * @returns Array of menu items with translations applied
 */
export const getMenuItems = (path: string, t?: Translation | null): MenuItem[] => {
    // Define base menu structure with translation keys
    const menuItems: MenuItem[] = [
        {
            icon: MessageSquare,
            label: t?.chat || "Чаты",
            translationKey: "chat",
            href: "/chat",
        },
        {
            icon: FileText,
            label: t?.documents || "Документы",
            translationKey: "documents",
            href: "/web",
            subItems: [
                {
                    label: t?.templates || "Шаблоны",
                    translationKey: "templates",
                    href: "/web/templates",
                },
                {
                    label: t?.editor || "Редактор",
                    translationKey: "editor",
                    href: "/web/editor",
                },
                {
                    label: t?.myDocuments || "Мои документы",
                    translationKey: "myDocuments",
                    href: "/web/documents",
                },
            ],
        },
        {
            icon: Settings,
            label: t?.accountDashboard || "Личный кабинет",
            translationKey: "accountDashboard",
            href: "/account",
            subItems: [
                {
                    label: t?.security || "Безопасность",
                    translationKey: "security",
                    href: "/account/security",
                },
                {
                    label: t?.notifications || "Уведомления",
                    translationKey: "notifications",
                    href: "/account/notifications",
                },
            ],
        },
        {
            icon: HelpCircle,
            label: t?.help || "Помощь",
            translationKey: "help",
            href: "/support",
        },
    ];

    // Add aria-labels based on active state
    return menuItems.map(item => {
        const isActive = path === item.href || 
            (item.subItems?.some(sub => path === sub.href) ?? false);

        return {
            ...item,
            ariaLabel: isActive 
                ? `${item.label} (${t?.currentPage || "текущая страница"})` 
                : item.label
        };
    });
};
