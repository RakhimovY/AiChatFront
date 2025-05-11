# LegalGPT - Юридический AI-ассистент

Проект представляет собой веб-приложение, похожее на ChatGPT, но с фокусом на юридические темы. Приложение состоит из трех основных частей:
1. Лендинг (Landing Page)
2. Чат-интерфейс (Chat Interface)
3. Система оплаты (Payment System)

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

### Бэкенд (рекомендуемый)
- **API**: Next.js API Routes / Отдельный бэкенд на Node.js + Express
- **База данных**: PostgreSQL
- **ORM**: Prisma
- **AI-интеграция**: OpenAI API

## Структура проекта

```
/
├── app/                    # Next.js App Router
│   ├── api/                # API Routes
│   ├── (landing)/          # Landing Page Routes
│   ├── chat/               # Chat Interface Routes
│   ├── pricing/            # Pricing Page Routes
│   ├── checkout/           # Checkout Routes
│   ├── auth/               # Authentication Routes
│   └── dashboard/          # User Dashboard Routes
├── components/             # React Components
│   ├── ui/                 # UI Components
│   ├── landing/            # Landing Page Components
│   ├── chat/               # Chat Interface Components
│   └── checkout/           # Checkout Components
├── lib/                    # Utility Functions
├── hooks/                  # Custom React Hooks
├── store/                  # State Management
├── styles/                 # Global Styles
├── types/                  # TypeScript Types
├── public/                 # Static Assets
└── prisma/                 # Database Schema
```

## Основные функциональные требования

### Лендинг
- Современный, отзывчивый дизайн
- Информация о возможностях юридического AI-ассистента
- Примеры использования
- Тарифные планы
- Форма регистрации/входа
- SEO-оптимизация

### Чат-интерфейс
- Интерфейс, похожий на ChatGPT
- История чатов
- Сохранение контекста разговора
- Возможность экспорта/сохранения чатов
- Специализированные юридические промпты

### Система оплаты
- Различные тарифные планы
- Безопасная обработка платежей
- Управление подписками
- Страница биллинга в личном кабинете

## Инструкция по установке и запуску

1. Клонировать репозиторий
2. Установить зависимости: 
   ```bash
   npm install
   ```
3. Настроить переменные окружения (опционально):
   - Создать файл `.env.local` в корне проекта
   - Добавить необходимые переменные окружения (для продакшн)

4. Запустить проект в режиме разработки:
   ```bash
   npm run dev
   ```

5. Открыть браузер и перейти по адресу:
   ```
   http://localhost:3000
   ```

## Запуск в продакшн режиме

1. Собрать проект:
   ```bash
   npm run build
   ```

2. Запустить собранный проект:
   ```bash
   npm run start
   ```

## Доступные страницы

- Главная страница (лендинг): `http://localhost:3000/`
- Чат-интерфейс: `http://localhost:3000/chat`
- Страница тарифов: `http://localhost:3000/pricing`
- Страница оформления подписки: `http://localhost:3000/checkout`
