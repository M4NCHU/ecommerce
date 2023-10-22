import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { CategoryValidator } from "@/lib/validators/category";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    // check user session
    if (!session?.user || session.user.role !== "ADMIN")
      return new Response("Unauthorized", { status: 401 });

    // parse request
    const body = await req.json();
    const { name, desc, imageUrl } = CategoryValidator.parse(body);

    const categoryExists = await db.category.findFirst({
      where: {
        name: name,
      },
    });

    // check if category exists in db
    if (categoryExists)
      return new Response("Category with this name already exists", {
        status: 409,
      });

    // create category

    const newCategory = await db.category.create({
      data: {
        name: name,
        description: desc,
        imageUrl: imageUrl,
      },
    });

    return new Response(newCategory.name);
  } catch (error: any) {
    // handle errors
    if (error instanceof z.ZodError)
      return new Response(error.message, { status: 422 });
    return new Response("Could not create category", { status: 500 });
  }
}
