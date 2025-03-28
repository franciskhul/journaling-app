import { db } from "@/lib/db";
import type { TransactionClient } from "@/lib/types/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { PrismaClient } from "@prisma/client";

export default async function findOrCreateCategory(
  userId: string,
  categoryInput: string,
  tx: TransactionClient | PrismaClient = db
) {
  try {
    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        categoryInput
      );

    // Always use the transaction client (tx) for all operations
    if (isUuid) {
      const existingCategory = await tx.category.findUnique({
        where: { id: categoryInput },
      });
      if (existingCategory) return existingCategory;
    }

    // Create new category using the transaction client
    return await tx.category.create({
      data: {
        name: transformToTitleCase(categoryInput),
        systemGenerated: false,
        UserCategory: {
          create: { userId },
        },
      },
    });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        // Unique constraint violation
        // Try to find the existing category by name
        const existingCategory = await tx.category.findFirst({
          where: { name: categoryInput },
        });
        if (existingCategory) return existingCategory;
      }
    }
    console.error("[CATEGORY_SERVICE_ERROR]", error);
    throw error;
  }
}

function transformToTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
