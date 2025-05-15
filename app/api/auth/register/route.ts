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
  country?: string;
}

export async function POST(request: Request) {
  try {
    const { name, email, password, country }: { name: string; email: string; password: string; country: string } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email и пароль обязательны для заполнения" },
        { status: 400 }
      );
    }

    // Validate password requirements
    if (password.length < 12) {
      return NextResponse.json(
        { message: "Пароль должен содержать не менее 12 символов" },
        { status: 400 }
      );
    }

    // Check if password contains at least one lowercase letter, one uppercase letter, one digit, and one special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        { message: "Пароль должен содержать как минимум одну строчную букву, одну заглавную букву, одну цифру и один специальный символ" },
        { status: 400 }
      );
    }

    // Call the backend API to register the user
    try {
      const registrationRequest: RegistrationRequest & { name?: string } = {
        email,
        password,
      };

      // Add name to the request if provided
      if (name) {
        registrationRequest.name = name;
      }

      // Add country to the request if provided
      if (country) {
        registrationRequest.country = country;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/sign-up`,
        registrationRequest
      );

      // Return success response
      return NextResponse.json(
        { 
          message: "Пользователь успешно зарегистрирован",
          user: {
            id: response.data.id.toString(),
            email: response.data.email,
          }
        },
        { status: 201 }
      );
    } catch (error) {
      // Handle API-specific errors
      console.error("API registration error:", error);
      return NextResponse.json(
        { message: "Ошибка при регистрации на сервере" },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Ошибка при регистрации" },
      { status: 500 }
    );
  }
}
