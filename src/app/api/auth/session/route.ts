import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

/**
 * @swagger
 * /api/v1/auth/session:
 *   get:
 *     summary: Retrieve user session
 *     description: Returns the current authenticated user's session details, including access and refresh tokens.
 *     tags:
 *       - Authentication
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved session.
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
 *       401:
 *         description: Not authenticated.
 */
export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  const decoded = verifyToken<{ id: string; email: string; role: string }>(
    token,
    process.env.ACCESS_TOKEN_SECRET!
  );

  if (!decoded) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    user: {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    },
  });
}
