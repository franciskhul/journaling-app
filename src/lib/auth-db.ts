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
