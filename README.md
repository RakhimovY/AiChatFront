# LegalGPT - Юридический AI-ассистент

Интеллектуальный помощник по юридическим вопросам на базе искусственного интеллекта.

## Описание

LegalGPT - это веб-приложение, которое предоставляет юридические консультации с использованием искусственного интеллекта. Приложение позволяет пользователям получать ответы на юридические вопросы, составлять документы и анализировать правовые риски.

## Функциональность

- Юридические консультации по различным отраслям права
- Составление юридических документов
- Анализ правовых рисков
- Система аутентификации пользователей
- Различные тарифные планы
- Адаптивный дизайн для мобильных устройств
- Темная и светлая темы оформления

## Технологии

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- NextAuth.js для аутентификации
- SWR для управления состоянием
- Zustand для глобального состояния

## Структура проекта

```
/
├── app/                    # Next.js App Router
│   ├── api/                # API Routes
│   ├── auth/               # Authentication Routes
│   ├── chat/               # Chat Interface
│   ├── checkout/           # Payment System
│   ├── dashboard/          # User Dashboard
│   └── pricing/            # Pricing Page
├── components/             # React Components
│   ├── auth/               # Authentication Components
│   ├── chat/               # Chat Components
│   ├── checkout/           # Checkout Components
│   ├── dashboard/          # Dashboard Components
│   ├── landing/            # Landing Page Components
│   ├── layout/             # Layout Components
│   ├── pricing/            # Pricing Components
│   ├── theme/              # Theme Components
│   └── ui/                 # UI Components
├── lib/                    # Utility Functions
└── public/                 # Static Assets
```

## Доступные страницы

- Главная страница (лендинг): `/`
- Чат-интерфейс: `/chat`
- Страница тарифов: `/pricing`
- Страница оформления подписки: `/checkout`
- Авторизация: `/auth/login`, `/auth/register`
- Личный кабинет: `/dashboard`

## Установка и запуск

1. Клонировать репозиторий:
```bash
git clone https://github.com/yourusername/legal-gpt.git
cd legal-gpt
```

2. Установить зависимости:
```bash
npm install
```

3. Запустить в режиме разработки:
```bash
npm run dev
```

4. Открыть [http://localhost:3000](http://localhost:3000) в браузере.

## Сборка для продакшена

```bash
npm run build
npm start
```

## Лицензия

MIT
