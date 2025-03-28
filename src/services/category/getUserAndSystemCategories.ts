// services/category/getUserAndSystemCategories.ts
import { db } from "@/lib/db";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import type { Category, CategoryWithUserFlag } from "@/types/category";

export async function getUserAndSystemCategories(
  userId: string
): Promise<CategoryWithUserFlag[]> {
  try {
    const categories = await db.category.findMany({
      where: {
        OR: [
          {
            UserCategory: { some: { userId } },
            systemGenerated: false,
          },
          { systemGenerated: true },
        ],
      },
      include: {
        UserCategory: {
          where: { userId },
          select: { userId: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return categories.map(transformCategory);
  } catch (error) {
    handleCategoryError(error);
  }
}

function transformCategory(
  category: Category & { UserCategory: { userId: string }[] }
): CategoryWithUserFlag {
  return {
    value: category.id,
    label: category.name,
  };
}

function handleCategoryError(error: unknown): never {
  if (error instanceof PrismaClientKnownRequestError) {
    console.error("[CATEGORY_SERVICE_ERROR]", error);
    throw new Error("Failed to fetch categories");
  }
  console.error("[UNKNOWN_ERROR]", error);
  throw new Error("Internal server error");
}
