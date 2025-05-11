# LegalGPT - Руководство для разработчиков

Это руководство содержит информацию о структуре проекта, архитектуре и инструкции по разработке для проекта LegalGPT.

## Технологический стек

### Фронтенд
- **Основной фреймворк**: Next.js 14 (React)
- **Язык программирования**: TypeScript
- **Стилизация**: Tailwind CSS + Shadcn UI
- **Управление состоянием**: React Context API + Zustand
- **Формы**: React Hook Form + Zod
- **API-взаимодействие**: Axios, SWR
- **Аутентификация**: NextAuth.js
- **Платежная система**: Stripe

## Структура проекта

```
/
├── app/                    # Next.js App Router
│   ├── api/                # API Routes (будут добавлены)
│   ├── (landing)/          # Landing Page (главная страница)
│   │   └── page.tsx        # Компонент главной страницы
│   ├── chat/               # Чат-интерфейс
│   │   └── page.tsx        # Компонент чата
│   ├── pricing/            # Страница тарифов
│   │   └── page.tsx        # Компонент страницы тарифов
│   ├── checkout/           # Страница оформления подписки
│   │   └── page.tsx        # Компонент страницы оформления подписки
│   ├── layout.tsx          # Корневой layout
│   └── globals.css         # Глобальные стили
├── components/             # React компоненты (будут добавлены)
├── lib/                    # Утилиты и хелперы (будут добавлены)
├── hooks/                  # Кастомные React хуки (будут добавлены)
├── store/                  # Управление состоянием (будет добавлено)
├── public/                 # Статические файлы (будут добавлены)
├── package.json            # Зависимости проекта
├── tsconfig.json           # Конфигурация TypeScript
├── tailwind.config.js      # Конфигурация Tailwind CSS
└── postcss.config.js       # Конфигурация PostCSS
```

## Установка и запуск

### Требования
- Node.js 18.x или выше
- npm 9.x или выше

### Установка
1. Клонировать репозиторий:
   ```bash
   git clone <repository-url>
   cd AiChatFront
   ```

2. Установить зависимости:
   ```bash
   npm install
   ```

3. Создать файл `.env.local` в корне проекта и добавить необходимые переменные окружения:
   ```
   # Базовые настройки
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   
   # Аутентификация (для будущей интеграции)
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key
   
   # Stripe (для будущей интеграции)
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
   STRIPE_SECRET_KEY=sk_test_your_key
   ```

4. Запустить проект в режиме разработки:
   ```bash
   npm run dev
   ```

5. Открыть [http://localhost:3000](http://localhost:3000) в браузере.

## Архитектура приложения

### Основные компоненты

1. **Лендинг (Landing Page)**
   - Расположение: `app/page.tsx`
   - Описание: Главная страница с информацией о сервисе, возможностях и тарифах.
   - Особенности: Статический рендеринг для SEO, адаптивный дизайн.

2. **Чат-интерфейс (Chat Interface)**
   - Расположение: `app/chat/page.tsx`
   - Описание: Интерактивный чат для взаимодействия с AI-ассистентом.
   - Особенности: Клиентский рендеринг, управление состоянием чата, автоматическая прокрутка.

3. **Страница тарифов (Pricing Page)**
   - Расположение: `app/pricing/page.tsx`
   - Описание: Страница с подробной информацией о тарифах и их возможностях.
   - Особенности: Статический рендеринг, динамическое отображение функций тарифов.

4. **Страница оформления подписки (Checkout Page)**
   - Расположение: `app/checkout/page.tsx`
   - Описание: Форма для оформления подписки и оплаты.
   - Особенности: Клиентский рендеринг, валидация форм, интеграция с платежной системой.

### Планируемые компоненты

1. **Аутентификация**
   - Регистрация, вход, восстановление пароля
   - Интеграция с NextAuth.js

2. **Управление подписками**
   - Личный кабинет пользователя
   - Управление платежами и подписками

3. **API-интеграция**
   - Подключение к бэкенду для обработки запросов к AI
   - Кэширование и оптимизация запросов

## Рекомендации по разработке

### Стилизация

Проект использует Tailwind CSS для стилизации. Основные цветовые переменные и темы определены в `tailwind.config.js` и `app/globals.css`.

Для создания новых компонентов рекомендуется:
1. Использовать утилиты Tailwind CSS
2. Следовать принципам адаптивного дизайна (mobile-first)
3. Использовать переменные CSS для цветов и размеров

### Управление состоянием

Для простых компонентов используйте React useState и useReducer. Для более сложного состояния планируется использовать Zustand:

```typescript
// Пример store для чата (будет реализован)
import { create } from 'zustand';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

type ChatStore = {
  messages: Message[];
  isLoading: boolean;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;
  setLoading: (loading: boolean) => void;
};

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  isLoading: false,
  addMessage: (message) => 
    set((state) => ({
      messages: [...state.messages, {
        ...message,
        id: Date.now().toString(),
        timestamp: new Date(),
      }],
    })),
  clearMessages: () => set({ messages: [] }),
  setLoading: (loading) => set({ isLoading: loading }),
}));
```

### API-взаимодействие

Для взаимодействия с API планируется использовать SWR и Axios:

```typescript
// Пример хука для получения данных (будет реализован)
import useSWR from 'swr';
import axios from 'axios';

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export function useUser(id: string) {
  const { data, error, isLoading } = useSWR(
    id ? `/api/users/${id}` : null,
    fetcher
  );

  return {
    user: data,
    isLoading,
    isError: error
  };
}
```

## Тестирование

Планируется добавление тестов с использованием:
- Jest для модульных тестов
- React Testing Library для компонентных тестов
- Cypress для E2E тестов

## Деплой

Рекомендуемые платформы для деплоя:
- Vercel (оптимально для Next.js)
- Netlify
- AWS Amplify

## Дальнейшее развитие

Приоритетные задачи для развития проекта:
1. Реализация аутентификации и авторизации
2. Интеграция с бэкендом для обработки запросов к AI
3. Подключение платежной системы
4. Добавление аналитики и мониторинга
5. Оптимизация производительности и доступности