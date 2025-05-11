import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import axios from "axios";

// Define user interface
interface User {
  id: string;
  email: string;
}

// Define login response interface
interface LoginResponse {
  token: string;
  privilege: string[];
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Call the backend API to authenticate the user
          const response = await axios.post<LoginResponse>(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/sign-in`,
            {
              email: credentials.email,
              password: credentials.password,
            }
          );

          if (response.data && response.data.token) {
            // Return the user object with the token
            return {
              id: credentials.email, // Use email as ID since we don't have the actual ID
              email: credentials.email,
              token: response.data.token,
            };
          }

          return null;
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "your-google-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "your-google-client-secret",
    }),
  ],
  pages: {
    signIn: "/auth/login",
    signOut: "/",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user: any }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        // Store the JWT token from the backend in the NextAuth.js token
        token.accessToken = user.token;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: JWT }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        // Add the JWT token to the session so it can be used for authenticated requests
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
