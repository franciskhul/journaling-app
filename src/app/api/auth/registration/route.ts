// app/api/auth/register/route.ts
import { db } from "@/lib/db";
import { saltHashPassword } from "@/lib/auth"; // Assuming you've renamed saltHashPassword
import { NextResponse } from "next/server";
import { z } from "zod";
import { generateAccessToken } from "@/lib/jwt";
import { saveRefreshToken } from "@/lib/auth-db";
import { AUTH_CONFIG } from "@/lib/config/auth"; // Centralized config

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: User registration and authentication
 *
 * components:
 *   schemas:
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           example: "John Doe"
 *         email:
 *           type: string
 *           format: email
 *           example: "user@example.com"
 *         password:
 *           type: string
 *           format: password
 *           minLength: 8
 *           example: "Str0ngP@ssword"
 *
 *     UserResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         email:
 *           type: string
 *         role:
 *           type: string
 *           enum: [USER, ADMIN]
 *
 *     AuthTokens:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *           description: JWT access token
 *         refreshToken:
 *           type: string
 *           description: JWT refresh token
 *         expires:
 *           type: string
 *           format: date-time
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         errors:
 *           type: object
 *           additionalProperties:
 *             type: array
 *             items:
 *               type: string
 */

const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(
      AUTH_CONFIG.PASSWORD.MIN_LENGTH,
      `Password must be at least ${AUTH_CONFIG.PASSWORD.MIN_LENGTH} characters`
    )
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { errors: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, password } = validation.data;

    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { email },
      select: { id: true }, // Only get what we need
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email already in use" },
        { status: 409 }
      );
    }

    // Create user in transaction
    const [newUser, refreshToken] = await db.$transaction(async (tx) => {
      const hashedPassword = await saltHashPassword(password);
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: AUTH_CONFIG.DEFAULT_ROLE,
        },
        select: { id: true, email: true, role: true },
      });

      const refreshToken = await saveRefreshToken(user.id);
      return [user, refreshToken];
    });

    // Generate tokens
    const accessToken = generateAccessToken({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });

    // Prepare response
    const response = NextResponse.json(
      {
        user: newUser, // Already properly selected
        accessToken,
        refreshToken,
        expires: new Date(
          Date.now() + AUTH_CONFIG.TOKEN_EXPIRATION_TIME * 1000
        ).toISOString(),
      },
      { status: 201 }
    );

    // Set cookies
    response.cookies.set({
      name: AUTH_CONFIG.COOKIE_NAMES.SESSION_TOKEN,
      value: accessToken,
      maxAge: AUTH_CONFIG.TOKEN_EXPIRATION_TIME,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      httpOnly: true,
    });

    return response; // Note: No refresh token cookie as per your JWT strategy
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
