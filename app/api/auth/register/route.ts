import { NextResponse } from "next/server";
import axios from "axios";

// Define user interface
interface User {
  id: string;
  email: string;
}

// Define registration request interface
interface RegistrationRequest {
  email: string;
  password: string;
  name?: string;
  country?: string;
}

interface RegistrationResponse {
  message: string;
  user?: User;
}

const PASSWORD_REQUIREMENTS = {
  minLength: 12,
  regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/
};

const createResponse = (message: string, status: number, user?: User): NextResponse => 
  NextResponse.json({ message, ...(user && { user }) }, { status });

const validatePassword = (password: string): string | null => {
  if (password.length < PASSWORD_REQUIREMENTS.minLength) {
    return "Пароль должен содержать не менее 12 символов";
  }
  if (!PASSWORD_REQUIREMENTS.regex.test(password)) {
    return "Пароль должен содержать как минимум одну строчную букву, одну заглавную букву, одну цифру и один специальный символ";
  }
  return null;
};

export async function POST(request: Request) {
  try {
    const { name, email, password, country } = await request.json() as RegistrationRequest;

    if (!email || !password) {
      return createResponse("Email и пароль обязательны для заполнения", 400);
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      return createResponse(passwordError, 400);
    }

    const registrationRequest: RegistrationRequest = {
      email,
      password,
      ...(name && { name }),
      ...(country && { country })
    };

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/sign-up`,
      registrationRequest
    );

    return createResponse(
      "Пользователь успешно зарегистрирован",
      201,
      {
        id: response.data.id.toString(),
        email: response.data.email
      }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return createResponse(
      error instanceof Error && error.message.includes("API") 
        ? "Ошибка при регистрации на сервере"
        : "Ошибка при регистрации",
      500
    );
  }
}
