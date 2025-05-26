import { CreditCard, Edit, FileText, HelpCircle, List, MessageSquare, Settings } from "lucide-react";

export type SubMenuItem = {
  label: string;
  href: string;
};

export type MenuItem = {
  icon: React.ElementType;
  label: string;
  href: string;
  subItems?: SubMenuItem[];
};

// Menu items for the web section
export const webMenuItems: MenuItem[] = [
  {
    icon: FileText,
    label: "Документы",
    href: "/web",
    subItems: [
      {
        label: "Шаблоны",
        href: "/web/templates",
      },
      {
        label: "Редактор",
        href: "/web/editor",
      },
      {
        label: "Мои документы",
        href: "/web/documents",
      },
    ],
  },
  {
    icon: List,
    label: "Каталог",
    href: "/web/catalog",
    subItems: [
      {
        label: "Категории",
        href: "/web/catalog/categories",
      },
      {
        label: "Новинки",
        href: "/web/catalog/new",
      },
      {
        label: "Популярное",
        href: "/web/catalog/popular",
      },
    ],
  },
  {
    icon: Settings,
    label: "Управление",
    href: "/web/management",
    subItems: [
      {
        label: "Пользователи",
        href: "/web/management/users",
      },
      {
        label: "Права доступа",
        href: "/web/management/permissions",
      },
      {
        label: "Статистика",
        href: "/web/management/statistics",
      },
    ],
  },
];

// Menu items for the subscription section
export const subscriptionMenuItems: MenuItem[] = [
  { 
    icon: MessageSquare, 
    label: "Чаты", 
    href: "/chat",
    subItems: [
      {
        label: "Новый чат",
        href: "/chat/new",
      },
      {
        label: "История чатов",
        href: "/chat/history",
      },
      {
        label: "Избранное",
        href: "/chat/favorites",
      },
    ],
  },
  {
    icon: CreditCard,
    label: "Подписка",
    href: "/subscription",
    subItems: [
      {
        label: "Мои подписки",
        href: "/subscription",
      },
      {
        label: "Тарифы",
        href: "/subscription/plans",
      },
      {
        label: "История платежей",
        href: "/subscription/history",
      },
    ],
  },
  { 
    icon: Settings, 
    label: "Настройки", 
    href: "/settings",
    subItems: [
      {
        label: "Профиль",
        href: "/settings/profile",
      },
      {
        label: "Безопасность",
        href: "/settings/security",
      },
      {
        label: "Уведомления",
        href: "/settings/notifications",
      },
    ],
  },
  { 
    icon: HelpCircle, 
    label: "Помощь", 
    href: "/support",
    subItems: [
      {
        label: "FAQ",
        href: "/support/faq",
      },
      {
        label: "Связаться с нами",
        href: "/support/contact",
      },
      {
        label: "Документация",
        href: "/support/docs",
      },
    ],
  },
];

// Combined menu items for all sections
export const allMenuItems: MenuItem[] = [
  ...webMenuItems,
  ...subscriptionMenuItems,
];

// Function to get the appropriate menu items based on the current path
export const getMenuItems = (path: string): MenuItem[] => {
  // Always return all menu items for consistency across all pages
  return allMenuItems;
};
