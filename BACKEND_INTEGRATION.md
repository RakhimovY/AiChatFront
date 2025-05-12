# Интеграция с бэкендом

Этот документ описывает, как настроить интеграцию между фронтендом (Next.js) и бэкендом (Spring Boot).

## Настройка окружения

1. Убедитесь, что бэкенд запущен и доступен по адресу `http://localhost:8080`.
2. Убедитесь, что фронтенд настроен для подключения к бэкенду через файл `.env.local`.

## Файл .env.local

В корне проекта создан файл `.env.local` со следующими переменными окружения:

```
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8080/api

# NextAuth.js configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-change-this-in-production

# Google OAuth (optional, for future use)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

При необходимости измените `NEXT_PUBLIC_API_URL` на актуальный адрес вашего бэкенда.

## Аутентификация

Аутентификация реализована с использованием NextAuth.js и JWT токенов.

### Эндпоинты бэкенда для аутентификации

Бэкенд предоставляет следующие эндпоинты для аутентификации:

- `POST /api/auth/sign-up` - Регистрация нового пользователя
  - Тело запроса: `{ "email": "user@example.com", "password": "Password123!" }`
  - Ответ: Объект пользователя

- `POST /api/auth/sign-in` - Вход пользователя
  - Тело запроса: `{ "email": "user@example.com", "password": "Password123!" }`
  - Ответ: `{ "token": "jwt-token", "privilege": ["ROLE_USER"] }`

- `POST /api/auth/google` - Аутентификация через Google
  - Тело запроса: `{ "token": "google-id-token", "email": "user@example.com", "name": "User Name", "picture": "https://...", "googleId": "google-user-id" }`
  - Ответ: `{ "token": "jwt-token", "privilege": ["ROLE_USER"] }`

### Требования к паролю

При регистрации пароль должен соответствовать следующим требованиям:

- Минимум 12 символов
- Хотя бы одна строчная буква (a-z)
- Хотя бы одна заглавная буква (A-Z)
- Хотя бы одна цифра (0-9)
- Хотя бы один специальный символ (@$!%*?&)

## Интеграция чата

Чат интегрирован с бэкендом для сохранения и загрузки истории сообщений.

### Эндпоинты бэкенда для чата

- `POST /api/chat/ask` - Отправка сообщения
  - Тело запроса: `{ "chatId": 123, "content": "Текст сообщения" }`
  - Если `chatId` не указан, создается новый чат
  - Ответ: Массив сообщений чата

- `GET /api/chat/{chatId}` - Получение истории чата
  - Ответ: Массив сообщений чата

- `GET /api/chat/user` - Получение всех чатов пользователя
  - Ответ: Массив чатов пользователя

### Модели данных

#### Сообщение (ChatMessage)
```typescript
interface ChatMessage {
  id: number;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
  chatId: number;
}
```

#### Чат (Chat)
```typescript
interface Chat {
  id: number;
  title: string | null;
  createdAt: string;
  messages: ChatMessage[];
}
```

### Google Authentication

Для аутентификации через Google используется NextAuth.js с провайдером GoogleProvider. Процесс аутентификации:

1. Пользователь нажимает кнопку "Google" на странице входа
2. NextAuth.js перенаправляет пользователя на страницу аутентификации Google
3. После успешной аутентификации Google возвращает пользователя на callback URL с кодом авторизации
4. NextAuth.js обменивает код на токен доступа и получает информацию о пользователе
5. Фронтенд отправляет информацию о пользователе на бэкенд через эндпоинт `/api/auth/google`
6. Бэкенд находит или создает пользователя с данными Google и возвращает JWT токен
7. Фронтенд сохраняет JWT токен в сессии NextAuth.js

Для настройки Google OAuth см. файл `GOOGLE_AUTH_SETUP.md`.

### Обработка токенов и сессий

Токены JWT хранятся в сессии NextAuth.js и автоматически добавляются к запросам через Axios interceptor. Если токен истекает, пользователь автоматически перенаправляется на страницу входа.

## Использование API

Для выполнения аутентифицированных запросов к API используйте утилиту `api` из `lib/api.ts`:

```typescript
import api from '@/lib/api';

// Пример запроса
const fetchData = async () => {
  try {
    const response = await api.get('/some-endpoint');
    return response.data;
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
};
```

Эта утилита автоматически добавляет токен аутентификации к запросам, если пользователь авторизован.

## Тестирование

Для тестирования интеграции:

1. Запустите бэкенд: `./gradlew bootRun` (в директории бэкенда)
2. Запустите фронтенд: `npm run dev` (в директории фронтенда)
3. Откройте браузер по адресу `http://localhost:3000`
4. Попробуйте зарегистрироваться и войти в систему
5. Перейдите в чат и отправьте сообщение

## Устранение неполадок

Если возникают проблемы с подключением:

1. Убедитесь, что бэкенд запущен и доступен
2. Проверьте консоль браузера на наличие ошибок
3. Проверьте консоль сервера на наличие ошибок
4. Убедитесь, что URL в `.env.local` правильный
5. Проверьте, что токен JWT не истек (можно проверить в localStorage или через инструменты разработчика)
