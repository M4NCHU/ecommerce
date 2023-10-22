import { db } from "@/lib/db";
import { z } from "zod";

export async function GET(req: Request) {
  try {
    const results = await db.category.findMany();
    return new Response(JSON.stringify(results));
  } catch (error: any) {
    if (error instanceof z.ZodError)
      return new Response(error.message, { status: 422 });
    return new Response("Could not read categories", { status: 500 });
  }
}
