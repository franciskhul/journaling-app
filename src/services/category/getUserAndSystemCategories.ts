import { db } from "@/lib/db";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Category, CategoryWithUserFlag } from "@/types/category";

export async function getUserAndSystemCategories(
  userId: string
): Promise<CategoryWithUserFlag[]> {
  try {
    const categories = await db.category.findMany({
      where: {
        OR: [
          {
            UserCategory: {
              some: {
                userId: userId,
              },
            },
            systemGenerated: false,
          },
          {
            systemGenerated: true,
          },
        ],
      },
      include: {
        UserCategory: {
          where: {
            userId: userId,
          },
          select: {
            userId: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
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
    id: category.id,
    name: category.name,
    systemGenerated: category.systemGenerated,
    isUserCategory: category.UserCategory.length > 0,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  };
}

function handleCategoryError(error: unknown): never {
  if (error instanceof PrismaClientKnownRequestError) {
    console.error("[CATEGORY_SERVICE_ERROR]", error);
    throw new Error("Failed to fetch categories due to database error");
  }
  console.error("[UNKNOWN_ERROR]", error);
  throw new Error("Failed to fetch categories");
}
