import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/next-auth/authOptions";
import { getUserAndSystemCategories } from "@/services/category/getUserAndSystemCategories";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session?.user?.id;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const categories = await getUserAndSystemCategories(userId);

    return NextResponse.json({
      success: true,
      data: {
        categories,
      },
    });
  } catch (error) {
    console.error("[CATEGORIES_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
