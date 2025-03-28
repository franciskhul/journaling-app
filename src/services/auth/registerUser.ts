import { db } from "@/lib/db";
import { saltHashPassword } from "@/lib/auth";
import { generateAccessToken } from "@/lib/jwt";
import { saveRefreshToken } from "@/lib/auth-db";
import { RegisterInput } from "@/lib/validations/auth";
import { ConflictError } from "@/lib/errors";
import { AUTH_CONFIG } from "@/lib/config/auth";

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: User registration and management
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
 *           minLength: 1
 *           maxLength: 50
 *           example: "John Doe"
 *         email:
 *           type: string
 *           format: email
 *           example: "user@example.com"
 *         password:
 *           type: string
 *           format: password
 *           minLength: 8
 *           example: "SecurePass123!"
 *
 *     ValidationError:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: "Validation failed"
 *         details:
 *           type: object
 *           additionalProperties:
 *             type: array
 *             items:
 *               type: string
 *           example:
 *             name: ["Name is required"]
 *             email: ["Invalid email format"]
 *             password:
 *               - "Must be at least 8 characters"
 *               - "Must contain uppercase letter"
 *
 *     AuthResponse:
 *       type: object
 *       properties:
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *             email:
 *               type: string
 *             role:
 *               type: string
 *               enum: [USER, ADMIN]
 *         accessToken:
 *           type: string
 *         refreshToken:
 *           type: string
 *         expires:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/auth/registration:
 *   post:
 *     summary: Register a new user
 *     description: |
 *       Creates a new user account with the provided credentials.
 *       Returns authentication tokens on success.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
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
 *               $ref: '#/components/schemas/ValidationError'
 *       409:
 *         description: Email already registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Email already registered"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */

export default async function registerUser(input: RegisterInput) {
  const existingUser = await db.user.findUnique({
    where: { email: input.email },
    select: { id: true },
  });

  if (existingUser) {
    throw new ConflictError("Email already registered");
  }

  const saltHashedPassword = await saltHashPassword(input.password);
  const user = await db.user.create({
    data: {
      name: input.name,
      email: input.email,
      password: saltHashedPassword,
      role: "USER",
    },
    select: { id: true, email: true, role: true },
  });

  const accessToken = generateAccessToken(user);
  const refreshToken = await saveRefreshToken(user.id);

  return {
    user,
    accessToken,
    refreshToken,
    expires: new Date(
      Date.now() + AUTH_CONFIG.TOKEN_EXPIRATION_TIME
    ).toISOString(), // 1 day
  };
}
