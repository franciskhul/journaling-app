import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { generateAccessToken } from "@/lib/jwt";
import { verifyPassword } from "@/lib/auth";
import { refreshAccessToken, saveRefreshToken } from "@/lib/auth-db";
import { db } from "@/lib/db";

const TOKEN_EXPIRATION_TIME = 60 * 60 * 24;

declare module "next-auth" {
  interface Session {
    accessToken: string;
    refreshToken: string;
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

/**
 * @swagger
 * /api/auth/callback/credentials:
 *   post:
 *     summary: User Login with Credentials
 *     description: >
 *       Authenticates a user using credentials. This endpoint expects data in
 *       application/x-www-form-urlencoded format, including email, password, and a csrfToken.
 *       On successful authentication, the endpoint sets the authentication cookies (e.g. next-auth.session-token)
 *       and issues a 302 redirect to the callback URL (or default route, e.g. "/").
 *     tags:
 *       - Authentication
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     parameters:
 *       - in: formData
 *         name: email
 *         required: true
 *         type: string
 *         description: The user's email address.
 *         example: "user@example.com"
 *       - in: formData
 *         name: password
 *         required: true
 *         type: string
 *         description: The user's password.
 *         example: "password123"
 *       - in: formData
 *         name: csrfToken
 *         required: true
 *         type: string
 *         description: The CSRF token provided by the sign-in page.
 *         example: "the-generated-csrf-token"
 *     responses:
 *       302:
 *         description: >
 *           Successful authentication results in a redirect (HTTP 302) to the callback URL (or default route)
 *           and sets the authentication cookies.
 *       401:
 *         description: Invalid credentials.
 */
export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: TOKEN_EXPIRATION_TIME,
  },
  callbacks: {
    async jwt({ token, user }) {
      const currentTime = Math.floor(Date.now() / 1000);
      if (user) {
        token.accessToken = generateAccessToken({
          id: user.id,
          email: user.email as string,
          role: user.role as "ADMIN" | "USER",
        });
        token.refreshToken = await saveRefreshToken(user.id);
        token.exp = currentTime + TOKEN_EXPIRATION_TIME;
      } else if (currentTime > (token.exp as number)) {
        try {
          const newAccessToken = await refreshAccessToken(
            token.refreshToken as string
          );
          token.accessToken = newAccessToken;
          token.exp = currentTime + TOKEN_EXPIRATION_TIME;
        } catch (error) {
          console.error("Failed to refresh access token:", error);
          throw new Error("Session expired. Please log in again.");
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (typeof token.accessToken === "string") {
        session.accessToken = token.accessToken;
      }
      if (typeof token.refreshToken === "string") {
        session.refreshToken = token.refreshToken;
      }
      if (typeof token.user === "object" && token.user !== null) {
        session.user = token.user as {
          id: string;
          email: string;
          role: "ADMIN" | "USER";
        };
      }

      return session;
    },
  },
  debug: true,
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

/**
 * @swagger
 * (Swagger documentation goes here)
 */
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
