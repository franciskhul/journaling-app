import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { generateAccessToken } from "@/lib/jwt";
import { verifyPassword } from "@/lib/auth";
import { refreshAccessToken, saveRefreshToken } from "@/lib/auth-db";
import { AUTH_CONFIG } from "@/lib/config/auth";
import { db } from "@/lib/db";
import NextAuth from "next-auth";
import { checkDenylist } from "@/lib/auth-db";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    expires?: string;
    error?: "RefreshFailed" | "InvalidSession";
    user: {
      id: string;
      email: string;
      role: "ADMIN" | "USER";
    };
  }

  interface JWT {
    accessToken: string;
    refreshToken: string;
    exp: number;
  }

  interface User {
    id: string;
    email: string;
    role: "ADMIN" | "USER";
  }
}

const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
    maxAge: AUTH_CONFIG.TOKEN_EXPIRATION_TIME,
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      // Initial sign in
      if (trigger === "signIn" && user) {
        return {
          ...token,
          accessToken: generateAccessToken(user),
          refreshToken: await saveRefreshToken(user.id),
          exp:
            Math.floor(Date.now() / 1000) + AUTH_CONFIG.TOKEN_EXPIRATION_TIME,
          role: user.role,
        };
      }

      if (token.accessToken && typeof token.accessToken === "string") {
        const isRevoked = await checkDenylist(token.accessToken);
        if (isRevoked) {
          throw new Error("Token revoked");
        }
      }

      const currentTime = Math.floor(Date.now() / 1000);
      if (currentTime > (token.exp as number)) {
        try {
          if (typeof token.refreshToken !== "string") {
            throw new Error("Missing refresh token");
          }

          const [newAccessToken, newRefreshToken] = await refreshAccessToken(
            token.refreshToken
          );

          return {
            ...token,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            exp: currentTime + AUTH_CONFIG.TOKEN_EXPIRATION_TIME,
          };
        } catch (error) {
          console.error("Refresh token error:", error);
          return { ...token, error: "REAUTHENTICATE" };
        }
      }

      return token;
    },

    async session({ session, token }) {
      const expires =
        typeof token.exp === "number"
          ? new Date(token.exp * 1000).toISOString()
          : undefined;

      return {
        ...session,
        ...(expires && { expires }),
        ...(typeof token.accessToken === "string" && {
          accessToken: token.accessToken,
        }),
        ...(typeof token.refreshToken === "string" && {
          refreshToken: token.refreshToken,
        }),
        ...(token.error
          ? { error: token.error as "RefreshFailed" | "InvalidSession" }
          : {}),
        user: {
          ...session.user,
          id: token.sub || session.user.id,
          role: (token.role as "ADMIN" | "USER") || "USER",
        },
      };
    },
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", required: true },
        password: { label: "Password", type: "password", required: true },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email },
          select: { id: true, email: true, password: true, role: true },
        });

        if (
          !user ||
          !(await verifyPassword(credentials.password, user.password))
        ) {
          throw new Error("Invalid credentials");
        }
        return { id: user.id, email: user.email, role: user.role };
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
};

export default authOptions;

export const auth = async () => {
  return NextAuth(authOptions);
};
