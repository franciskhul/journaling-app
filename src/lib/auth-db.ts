import { db } from "@/lib/db";
import { generateAccessToken, generateRefreshToken } from "./jwt";
import { AUTH_CONFIG } from "@/lib/config/auth";

export async function saveRefreshToken(userId: string) {
  const refreshToken = generateRefreshToken({ id: userId });
  const expiresAt = new Date(
    Date.now() + AUTH_CONFIG.REFRESH_TOKEN_EXPIRATION_TIME
  ); // 7 days (604,800 seconds)

  await db.$transaction([
    // Delete any existing tokens for the user (optional)
    db.refreshToken.deleteMany({
      where: { userId },
    }),
    // Create new token
    db.refreshToken.create({
      data: {
        userId,
        token: refreshToken,
        expiresAt,
      },
    }),
  ]);

  return refreshToken;
}

export async function refreshAccessToken(
  refreshToken: string
): Promise<[string, string]> {
  // Verify token exists and isn't expired
  const tokenRecord = await db.refreshToken.findUnique({
    where: { token: refreshToken },
    include: { user: { select: { id: true, email: true, role: true } } },
  });

  if (!tokenRecord?.user || new Date() > tokenRecord.expiresAt) {
    // Auto-cleanup invalid tokens
    await db.refreshToken.deleteMany({
      where: { token: refreshToken },
    });
    throw new Error("Invalid or expired refresh token");
  }

  // Transaction for atomic operations
  const [newAccessToken, newRefreshToken] = await db.$transaction(
    async (tx) => {
      // Delete old token
      await tx.refreshToken.delete({
        where: { token: refreshToken },
      });

      // Generate new tokens
      const newRefreshToken = await saveRefreshToken(tokenRecord.userId);
      const newAccessToken = generateAccessToken({
        id: tokenRecord.user.id,
        email: tokenRecord.user.email,
        role: tokenRecord.user.role as "ADMIN" | "USER",
      });

      return [newAccessToken, newRefreshToken];
    }
  );

  return [newAccessToken, newRefreshToken];
}

export async function getRefreshToken(userId: string) {
  const tokenRecord = await db.refreshToken.findFirst({
    where: {
      userId,
      expiresAt: {
        gt: new Date(),
      },
    },
  });
  return tokenRecord?.token;
}

export async function validateRefreshToken(token: string) {
  const storedToken = await db.refreshToken.findFirst({ where: { token } });
  return storedToken ? true : false;
}

export async function revokeRefreshToken(token: string) {
  await db.refreshToken.deleteMany({ where: { token } });
}

export async function addToJWTDenylist(token: string, userId: string) {
  await db.jWT_Denylist.create({
    data: {
      token,
      userId: userId,
      expiresAt: new Date(Date.now() + AUTH_CONFIG.TOKEN_EXPIRATION_TIME + 30), // Will expire after the Token has expired with some buffer
    },
  });
}

export async function checkDenylist(token: string) {
  return await db.jWT_Denylist.findFirst({ where: { token } });
}
