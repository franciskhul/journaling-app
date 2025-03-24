import { verifyToken, generateAccessToken } from "@/lib/jwt";
import { validateRefreshToken } from "@/lib/auth-db";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * @swagger
 * /api/v1/auth/refresh:
 *   post:
 *     summary: Refresh the access token
 *     description: Validates the refresh token and returns a new access token in the response body.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: The refresh token obtained during login.
 *                 example: "eyJhbGciOiJIUzI1NiIsInR..."
 *     responses:
 *       200:
 *         description: Successfully refreshed the access token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: The new access token.
 *                   example: "eyJhbGciOiJIUzI1NiIsInR..."
 *                 success:
 *                   type: boolean
 *                   example: true
 *       403:
 *         description: Invalid refresh token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid refresh token"
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User not found"
 */

export async function POST(req: Request) {
  const { refreshToken } = await req.json();

  // Validate refresh token from the database
  if (!(await validateRefreshToken(refreshToken))) {
    return NextResponse.json(
      { error: "Invalid refresh token" },
      { status: 403 }
    );
  }

  // Decode the refresh token
  const decoded = verifyToken<{ id: string }>(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET!
  );

  if (!decoded) {
    return NextResponse.json(
      { error: "Invalid refresh token" },
      { status: 403 }
    );
  }

  // Fetch user from the database
  const user = await db.user.findUnique({
    where: { id: decoded.id },
    select: { id: true, email: true, role: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Generate new access token
  const newAccessToken = generateAccessToken(user);

  return NextResponse.json({
    accessToken: newAccessToken,
    success: true,
  });
}
