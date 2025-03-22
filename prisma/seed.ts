import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

enum Table {
  Category = "category",
  User = "user",
  Journal = "journal",
  JournalCategory = "journalCategory",
}

type CategoryAttributes = {
  name: string;
  color: string;
  systemGenerated: boolean;
};

type UserAttributes = {
  name: string;
  email: string;
  role: "ADMIN" | "USER";
  password: string;
};

type JournalAttributes = {
  title: string;
  content: string;
  userId: string;
  id: string;
};

type JournalCategoryAttributes = {
  journalId: string;
  categoryId: string;
};

type SeedItem =
  | { table: Table.Category; data: CategoryAttributes[] }
  | { table: Table.User; data: UserAttributes[] }
  | { table: Table.Journal; data: JournalAttributes[] }
  | { table: Table.JournalCategory; data: JournalCategoryAttributes[] };

const seedData: SeedItem[] = [
  {
    table: Table.Category,
    data: [
      { name: "Personal", color: "#FF5733", systemGenerated: true },
      { name: "Work", color: "#33C1FF", systemGenerated: true },
      { name: "Travel", color: "#FF33A1", systemGenerated: true },
    ],
  },
  // You can add more table seeds here in the future
];

async function main() {
  for (const seed of seedData) {
    const { table, data } = seed;

    for (const item of data) {
      switch (table) {
        case Table.Category:
          await prisma.category.upsert({
            where: { name: (item as CategoryAttributes).name },
            update: {},
            create: item as CategoryAttributes,
          });
          break;
        case Table.User:
          await prisma.user.upsert({
            where: { email: (item as UserAttributes).email },
            update: {},
            create: item as UserAttributes,
          });
          break;
        case Table.Journal:
          await prisma.journal.upsert({
            where: { id: (item as JournalAttributes).id },
            update: {},
            create: item as JournalAttributes,
          });
          break;
        case Table.JournalCategory:
          await prisma.journalCategory.upsert({
            where: {
              journalId_categoryId: {
                journalId: (item as JournalCategoryAttributes).journalId,
                categoryId: (item as JournalCategoryAttributes).categoryId,
              },
            },
            update: {},
            create: item as JournalCategoryAttributes,
          });
          break;
        default:
          throw new Error(`Unknown table: ${table}`);
      }
    }
  }

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
