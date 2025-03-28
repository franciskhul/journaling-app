import type { NextRequest } from "next/server";

export async function parseJsonRequest(req: NextRequest) {
  try {
    return await req.json();
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error("JSON parse error:", {
        error: error.message,
        rawBody: await req.text(),
      });
      throw {
        status: 400,
        message: "Invalid JSON format",
        details: error.message,
      };
    }
    throw error;
  }
}
