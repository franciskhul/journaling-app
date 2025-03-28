import { db } from "@/lib/db";

export default async function findOrCreateCategory(
  userId: string,
  categoryInput: string
) {
  const existingCategory = await db.category.findUnique({
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
}
