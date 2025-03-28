import { db } from "@/lib/db";

export default async function findOrCreateCategory(
  userId: string,
  categoryInput: string
) {
  try {
    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        categoryInput
      );
    if (isUuid) {
      const existingCategory = await db.category.findUnique({
        where: { id: categoryInput },
      });
      if (existingCategory) return existingCategory;
    }

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
