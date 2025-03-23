import { NextResponse } from "next/server";
import { revokeRefreshToken, addToJWTDenylist } from "@/lib/auth-db";
import { verifyToken } from "@/lib/jwt";

/**
 * @swagger
 * /api/auth/logout:
 *   delete:
 *     summary: Logout the user
 *     description: Logs out the user by revoking the refresh token and adding the access token to a denylist.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               accessToken:
 *                 type: string
 *                 description: The access token to be added to the denylist.
 *               refreshToken:
 *                 type: string
 *                 description: The refresh token to be revoked.
 *     responses:
 *       200:
 *         description: Successfully logged out.
 *       400:
 *         description: Bad request. Access and refresh tokens are required.
 *       403:
 *         description: Invalid or expired access token.
 */
export async function DELETE(req: Request) {
  const { refreshToken, accessToken } = await req.json();

  if (!accessToken || !refreshToken) {
    return NextResponse.json(
      { error: "Access and refresh tokens are required" },
      { status: 400 }
    );
  }

  const decoded = verifyToken<{ id: string }>(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET!
  );

  if (!decoded) {
    return NextResponse.json(
      { error: "Invalid access token" },
      { status: 403 }
    );
  }

  const userId = decoded.id;

  await addToJWTDenylist(accessToken, userId);

  await revokeRefreshToken(refreshToken);

  return NextResponse.json({ message: "Logged out successfully" });
}
