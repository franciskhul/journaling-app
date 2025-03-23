import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { generateAccessToken } from "@/lib/jwt";
import { verifyPassword } from "@/lib/auth";
import { saveRefreshToken } from "@/lib/auth-db";
import { db } from "@/lib/db";

declare module "next-auth" {
  interface Session {
    accessToken: string;
    refreshToken: string;
  }

  interface JWT {
    accessToken: string;
    refreshToken: string;
  }

  interface User {
    id: string;
    email: string;
    role: "ADMIN" | "USER";
  }
}

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticates a user with credentials and returns access and refresh tokens in the response body.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Successfully authenticated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: The generated access token.
 *                   example: "eyJhbGciOiJIUzI1NiIsInR..."
 *                 refreshToken:
 *                   type: string
 *                   description: The refresh token.
 *                   example: "eyJhbGciOiJIUzI1NiIsInR..."
 *       401:
 *         description: Invalid credentials.
 */

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = generateAccessToken({
          id: user.id,
          email: user.email as string,
          role: user.role as "ADMIN" | "USER",
        });
        token.refreshToken = await saveRefreshToken(user.id);
      }
      return token;
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
};

/**
 * @swagger
 * (Swagger documentation goes here)
 */
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
