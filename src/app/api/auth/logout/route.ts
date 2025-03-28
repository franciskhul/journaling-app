import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/next-auth/authOptions";
import { revokeRefreshToken, addToJWTDenylist } from "@/lib/auth-db";

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     tags: [Authentication]
 *     summary: Logout current user
 *     description: |
 *       Invalidates the current user session by:
 *       - Adding the JWT access token to denylist
 *       - Revoking the refresh token
 *       - Clearing authentication cookies
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *             example: next-auth.session-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT
 *       401:
 *         description: Unauthorized (no active session)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unauthorized
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Logout failed
 */
export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Revoke tokens
    if (session.accessToken) {
      await addToJWTDenylist(session.accessToken, session.user.id);
    }
    if (session.refreshToken) {
      await revokeRefreshToken(session.refreshToken);
    }

    // Clear session cookies
    const response = NextResponse.json({ success: true });
    response.cookies.delete("next-auth.session-token");
    response.cookies.delete("__Secure-next-auth.session-token");

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
