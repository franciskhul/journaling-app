import { db } from "@/lib/db";
import { generateRefreshToken } from "./jwt";

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
