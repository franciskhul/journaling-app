import { db } from "@/lib/db";
import { generateAccessToken, generateRefreshToken } from "./jwt";

export async function saveRefreshToken(userId: string) {
  const refreshToken = generateRefreshToken({ id: userId });

  await db.refreshToken.create({
    data: {
      userId,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  return refreshToken;
}

export async function refreshAccessToken(refreshToken: string) {
  const tokenRecord = await db.refreshToken.findUnique({
    where: { token: refreshToken },
    select: { userId: true, expiresAt: true },
  });

  if (!tokenRecord) {
    throw new Error("Invalid refresh token");
  }

  if (new Date() > tokenRecord.expiresAt) {
    throw new Error("Refresh token has expired. Please log in again.");
  }

  const user = await db.user.findUnique({
    where: { id: tokenRecord.userId },
    select: { email: true, role: true, id: true },
  });

  if (!user) {
    throw new Error("Invalid refresh token");
  }

  const newAccessToken = generateAccessToken(user);
  return newAccessToken;
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
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Set expiration (same as access token)
    },
  });
}
