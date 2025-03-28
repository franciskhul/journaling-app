import { NextResponse } from "next/server";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/next-auth/authOptions";
import { ValidationError, ConflictError } from "@/lib/errors";
import { ZodError, ZodTypeAny } from "zod";
import findOrCreateCategory from "@/services/category/findOrCreateCategory";
import createJournalEntry from "@/services/journalEntry/createJournalEntry";
import { db } from "@/lib/db";
import { journalEntrySchema } from "@/lib/validations/journalEntry";

/**
 * @swagger
 * /api/v1/journal_entry/new:
 *   post:
 *     tags: [Journal Entries]
 *     summary: Create a new journal entry
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, content, categoryId]
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 200
 *                 example: "My Daily Reflection"
 *               content:
 *                 type: string
 *                 minLength: 4
 *                 example: "Today I learned about API documentation..."
 *               categoryId:
 *                 type: string
 *                 example: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
 *     responses:
 *       201:
 *         description: Journal entry created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     title:
 *                       type: string
 *                     content:
 *                       type: string
 *                     userId:
 *                       type: string
 *                       format: uuid
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                     category:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           format: uuid
 *                         name:
 *                           type: string
 *                         systemGenerated:
 *                           type: boolean
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Validation failed
 *                 details:
 *                   type: object
 *                   additionalProperties:
 *                     type: array
 *                     items:
 *                       type: string
 *                   example:
 *                     title: ["Title is required"]
 *                     content: ["Content must be at least 4 characters"]
 *                     categoryId: ["Invalid UUID format"]
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unauthorized
 *       409:
 *         description: Conflict
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Category already exists
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
export async function POST(req: Request) {
  try {
    // Authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Request body parsing
    let body;
    try {
      body = await req.json();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      throw new ValidationError({
        root: ["Invalid JSON format"],
      });
    }

    // Input validation
    const validation = journalEntrySchema.safeParse(body);
    if (!validation.success) {
      throw ValidationError.fromZodError(
        validation.error as ZodError<ZodTypeAny>
      );
    }

    const { title, content, categoryId } = validation.data;

    // Transaction wrapper
    const result = await db
      .$transaction(async (tx) => {
        // 1. Find or create category
        const category = await findOrCreateCategory(
          session.user.id,
          categoryId,
          tx
        );

        // 2. Create journal entry
        const journalEntry = await createJournalEntry(
          {
            title,
            content,
            userId: session.user.id,
            categoryId: category.id,
          },
          tx
        );

        return journalEntry;
      })
      .catch((error) => {
        if (
          error instanceof PrismaClientKnownRequestError &&
          error.code === "P2002"
        ) {
          throw new ConflictError("Category already exists");
        }
        throw error;
      });

    return NextResponse.json(
      {
        success: true,
        data: {
          ...result,
          category: result.JournalEntryCategory[0].category,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[JOURNAL_ENTRY_CREATION_ERROR]", error);

    if (error instanceof ValidationError) {
      return NextResponse.json(
        {
          error: error.message,
          details: error.errors,
        },
        { status: error.statusCode }
      );
    }

    if (error instanceof ConflictError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
