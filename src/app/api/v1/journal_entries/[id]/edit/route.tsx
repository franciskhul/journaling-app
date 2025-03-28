import { NextResponse } from "next/server";
// import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/next-auth/authOptions";
import { ValidationError, NotFoundError, ForbiddenError } from "@/lib/errors";
import { ZodError, ZodTypeAny } from "zod";
import { db } from "@/lib/db";
import { journalEntrySchema } from "@/lib/validations/journalEntry";
import findOrCreateCategory from "@/services/category/findOrCreateCategory";

/**
 * @swagger
 * /api/v1/journal_entries/{id}/edit:
 *   patch:
 *     tags: [Journal Entries]
 *     summary: Update a journal entry
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The journal entry ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 200
 *                 example: "Updated Daily Reflection"
 *               content:
 *                 type: string
 *                 minLength: 4
 *                 example: "Updated content about API documentation..."
 *               categoryId:
 *                 type: string
 *                 example: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
 *     responses:
 *       200:
 *         description: Journal entry updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/JournalEntry'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not owner)
 *       404:
 *         description: Journal entry not found
 *       500:
 *         description: Internal server error
 */
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Request body parsing
    const body = await req.json();
    const validation = journalEntrySchema.safeParse(body);
    if (!validation.success) {
      throw ValidationError.fromZodError(
        validation.error as ZodError<ZodTypeAny>
      );
    }

    const { title, content, categoryId } = validation.data;
    const journalEntryId = params.id;

    const result = await db.$transaction(async (tx) => {
      // 1. Verify entry exists and user owns it (unless admin)
      const existingEntry = await tx.journalEntry.findUnique({
        where: { id: journalEntryId },
        include: { user: true },
      });

      if (!existingEntry) {
        throw new NotFoundError("Journal entry not found");
      }

      if (
        session.user.role !== "ADMIN" &&
        existingEntry.userId !== session.user.id
      ) {
        throw new ForbiddenError(
          "You don't have permission to edit this entry"
        );
      }

      // 3. Find or create category
      const category = await findOrCreateCategory(
        session.user.id,
        categoryId,
        tx
      );

      // 2. Update category relationship if changed
      await tx.journalEntryCategory.deleteMany({
        where: { journalId: journalEntryId },
      });

      await tx.journalEntryCategory.create({
        data: {
          journalId: journalEntryId,
          categoryId: category.id,
        },
      });

      // 3. Update journal entry
      return await tx.journalEntry.update({
        where: { id: journalEntryId },
        data: {
          title,
          content,
          updatedAt: new Date(),
        },
        include: {
          JournalEntryCategory: {
            include: {
              category: true,
            },
          },
        },
      });
    });

    return NextResponse.json({
      success: true,
      data: {
        ...result,
        category: result.JournalEntryCategory[0]?.category,
      },
    });
  } catch (error) {
    console.error("[JOURNAL_ENTRY_UPDATE_ERROR]", error);

    if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: error.message, details: error.errors },
        { status: error.statusCode }
      );
    }

    if (error instanceof NotFoundError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    if (error instanceof ForbiddenError) {
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
