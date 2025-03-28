import { db } from "@/lib/db";
import type { TransactionClient } from "@/lib/types/prisma";
import { PrismaClient } from "@prisma/client";

export default async function findOrCreateCategory(
  userId: string,
  categoryInput: string,
  tx: TransactionClient | PrismaClient = db
) {
  try {
    const existingCategory = await tx.category.findUnique({
      where: { id: categoryInput },
    });

    if (existingCategory) return existingCategory;

    return await db.category.create({
      data: {
        name: categoryInput,
        systemGenerated: false,
        UserCategory: {
          create: { userId },
        },
      },
    });
  } catch (error) {
    console.error("[CATEGORY_SERVICE_ERROR]", error);
    throw error;
  }
}
