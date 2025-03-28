import { NextResponse } from "next/server";
import { ConflictError, ValidationError } from "@/lib/errors";
import registerUser from "@/services/auth/registerUser";
import { registrationSchema } from "@/lib/validations/auth";
import { ZodError, ZodTypeAny } from "zod";
import { AUTH_CONFIG } from "@/lib/config/auth";
/**
 * @swagger
 * /api/auth/registration:
 *   post:
 *     tags: [Authentication]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 50
 *               email:
 *                 type: string
 *                 format: email
 *                 maxLength: 100
 *               password:
 *                 type: string
 *                 minLength: 8
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                       enum: [USER, ADMIN]
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *                 expires:
 *                   type: string
 *                   format: date-time
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *             example: next-auth.session-token=abc123; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Validation failed
 *                 details:
 *                   type: object
 *                   additionalProperties:
 *                     type: array
 *                     items:
 *                       type: string
 *                   example:
 *                     email: ["Invalid email format"]
 *                     password: ["Must contain at least one uppercase letter"]
 *       409:
 *         description: Conflict
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Email already registered
 *       500:
 *         description: Internal server error
 */
export async function POST(req: Request) {
  try {
    let body;
    try {
      body = await req.json();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      throw new ValidationError({
        root: ["Invalid JSON format"],
      });
    }

    const validation = registrationSchema.safeParse(body);
    if (!validation.success) {
      throw ValidationError.fromZodError(
        validation.error as ZodError<ZodTypeAny>
      );
    }

    const { accessToken, refreshToken, user, expires } = await registerUser(
      validation.data
    );

    const response = NextResponse.json(
      { user, accessToken, refreshToken, expires },
      { status: 201 }
    );

    response.cookies.set({
      name: "next-auth.session-token",
      value: accessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: AUTH_CONFIG.TOKEN_EXPIRATION_TIME, // 1 day
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Registration error:", error);

    if (error instanceof ValidationError) {
      return NextResponse.json(
        {
          error: error.message,
          details: error.errors,
        },
        { status: error.statusCode }
      );
    }

    if (error instanceof ConflictError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
