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
  country?: string;
}

// Define login response interface
interface LoginResponse {
  token: string;
  privilege: string[];
  name?: string;
  country?: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        remember: { label: "Remember Me", type: "text" },
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
              country: response.data.country || "Kazakhstan", // Use country from response or default
              token: response.data.token,
              remember: credentials.remember === "true", // Pass the remember me preference
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
      profile(profile: { sub: any; name: any; email: any; picture: any; locale?: string; }) {
        // Try to determine country from locale if available
        let country = "Kazakhstan"; // Default country
        if (profile.locale) {
          // Extract country code from locale (e.g., "ru-RU" -> "Russia")
          const localeCountryCode = profile.locale.split('-')[1];
          if (localeCountryCode === "KZ") country = "Kazakhstan";
          else if (localeCountryCode === "RU") country = "Russia";
          else if (localeCountryCode === "BY") country = "Belarus";
          else if (localeCountryCode === "UA") country = "Ukraine";
          else if (localeCountryCode === "UZ") country = "Uzbekistan";
          else if (localeCountryCode === "KG") country = "Kyrgyzstan";
          else if (localeCountryCode === "TJ") country = "Tajikistan";
          else if (localeCountryCode === "TM") country = "Turkmenistan";
          else if (localeCountryCode === "AZ") country = "Azerbaijan";
          else if (localeCountryCode === "AM") country = "Armenia";
          else if (localeCountryCode === "GE") country = "Georgia";
          else if (localeCountryCode === "MD") country = "Moldova";
        }

        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          googleId: profile.sub,
          country: country,
        };
      },
    } as OAuthUserConfig<any>),
  ],
  pages: {
    signIn: "/auth/login",
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

          // Try to determine country from locale if available
          let country = "Kazakhstan"; // Default country
          if (profile.locale) {
            // Extract country code from locale (e.g., "ru-RU" -> "Russia")
            const localeCountryCode = profile.locale.split('-')[1];
            if (localeCountryCode === "KZ") country = "Kazakhstan";
            else if (localeCountryCode === "RU") country = "Russia";
            else if (localeCountryCode === "BY") country = "Belarus";
            else if (localeCountryCode === "UA") country = "Ukraine";
            else if (localeCountryCode === "UZ") country = "Uzbekistan";
            else if (localeCountryCode === "KG") country = "Kyrgyzstan";
            else if (localeCountryCode === "TJ") country = "Tajikistan";
            else if (localeCountryCode === "TM") country = "Turkmenistan";
            else if (localeCountryCode === "AZ") country = "Azerbaijan";
            else if (localeCountryCode === "AM") country = "Armenia";
            else if (localeCountryCode === "GE") country = "Georgia";
            else if (localeCountryCode === "MD") country = "Moldova";
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
              country: country,
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
    async jwt({ token, user, account, trigger }: { token: JWT; user: any; account: any; trigger?: string }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
        token.country = user.country;
        // Store the JWT token from the backend in the NextAuth.js token
        token.accessToken = user.token;

        // Store provider information
        if (account) {
          token.provider = account.provider;
        }

        // Store remember me preference
        if (trigger === "signIn" && user.remember !== undefined) {
          token.remember = user.remember;
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
        session.user.country = token.country;
        // Add the JWT token to the session so it can be used for authenticated requests
        session.accessToken = token.accessToken;
        session.provider = token.provider;
        // Add the remember me preference to the session
        session.remember = token.remember;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days by default
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
