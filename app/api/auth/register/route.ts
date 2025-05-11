import { NextResponse } from "next/server";

// This is a simple demo implementation
// In a real application, you would store users in a database
const users = [
  {
    id: "1",
    name: "Демо Пользователь",
    email: "demo@example.com",
    password: "password123",
  },
];

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Все поля обязательны для заполнения" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
      return NextResponse.json(
        { message: "Пользователь с таким email уже существует" },
        { status: 400 }
      );
    }

    // In a real application, you would hash the password and store the user in a database
    const newUser = {
      id: (users.length + 1).toString(),
      name,
      email,
      password, // In a real app, this would be hashed
    };

    // Add user to the in-memory array (for demo purposes)
    users.push(newUser);

    // Return success response
    return NextResponse.json(
      { 
        message: "Пользователь успешно зарегистрирован",
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Ошибка при регистрации" },
      { status: 500 }
    );
  }
}