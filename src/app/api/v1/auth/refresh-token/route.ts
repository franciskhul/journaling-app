import { verifyToken, generateAccessToken } from "@/lib/jwt";
import { validateRefreshToken } from "@/lib/auth-db";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh the access token
 *     description: Validates the refresh token and returns a new access token.
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
 *     responses:
 *       200:
 *         description: Successfully refreshed the access token.
 *         headers:
 *           Set-Cookie:
 *             description: HTTP-only cookie containing the new access token.
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: The new access token.
 *                 success:
 *                   type: boolean
 *       403:
 *         description: Invalid refresh token.
 *       404:
 *         description: User not found.
 */
export async function POST(req: Request) {
  const { refreshToken } = await req.json();

  if (!(await validateRefreshToken(refreshToken))) {
    return NextResponse.json(
      { error: "Invalid refresh token" },
      { status: 403 }
    );
  }
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
  const user = await db.user.findUnique({
    where: { id: decoded.id },
    select: { id: true, email: true, role: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const newAccessToken = generateAccessToken(user);
  const response = NextResponse.json({
    accessToken: newAccessToken,
    success: true,
  });

  response.cookies.set({
    name: "accessToken",
    value: newAccessToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // Prevent CSRF attacks
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day expiry
  });

  return response;
}
