import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import axios from "axios";
import { OAuthUserConfig } from "next-auth/providers";

// Define user interface
interface User {
  id: string;
  email: string;
  name?: string;
}

// Define login response interface
interface LoginResponse {
  token: string;
  privilege: string[];
  name?: string;
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
              name: response.data.name || "Пользователь", // Use name from response or default
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
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          googleId: profile.sub,
        };
      },
    } as OAuthUserConfig<any>),
  ],
  pages: {
    signIn: "/auth/login",
    signOut: "/",
    error: "/auth/error",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Only handle Google sign-in
      if (account?.provider === "google" && profile) {
        try {
          // Check if Google credentials are configured
          if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
            console.error("Google OAuth credentials are not configured");
            return "/auth/error?error=GoogleCredentialsNotConfigured";
          }

          // Call the backend API to authenticate with Google
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/google`,
            {
              token: account.id_token,
              email: profile.email,
              name: profile.name,
              picture: profile.picture,
              googleId: profile.sub,
            }
          );

          if (response.data && response.data.token) {
            // Store the token in the user object so it can be accessed in the jwt callback
            user.token = response.data.token;
            return true;
          }
          console.error("Invalid response from backend Google authentication");
          return "/auth/error?error=InvalidBackendResponse";
        } catch (error) {
          console.error("Google authentication error:", error);
          // Check if the error is due to the backend being unavailable
          if (axios.isAxiosError(error) && !error.response) {
            return "/auth/error?error=BackendUnavailable";
          }
          return "/auth/error?error=GoogleAuthFailed";
        }
      }
      return true;
    },
    async jwt({ token, user, account }: { token: JWT; user: any; account: any }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
        // Store the JWT token from the backend in the NextAuth.js token
        token.accessToken = user.token;

        // Store provider information
        if (account) {
          token.provider = account.provider;
        }
      }
      return token;
    },
    async session({ session, token }: { session: any; token: JWT }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.image = token.picture;
        // Add the JWT token to the session so it can be used for authenticated requests
        session.accessToken = token.accessToken;
        session.provider = token.provider;
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
